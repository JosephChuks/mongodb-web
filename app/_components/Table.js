"use client";
import React, { useState, useEffect, useMemo } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import debounce from "lodash.debounce";
import Collections from "./Collections";
import Documents from "./Documents";
import Dbs from "./Dbs";

const Table = ({ data, type, title }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isReversed, setIsReversed] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalData = data.length;

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    handler();

    return () => {
      handler.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, isReversed]);

  const filteredData = useMemo(() => {
    if (!debouncedQuery) return data;
    const lowercasedQuery = debouncedQuery.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value && value.toString().toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [data, debouncedQuery]);

  const sortedData = useMemo(() => {
    if (isReversed) {
      return [...filteredData].reverse();
    }
    return filteredData;
  }, [filteredData, isReversed]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortToggle = () => {
    setIsReversed((prev) => !prev);
  };

  const handleItemsPerPage = (e) => {
    setItemsPerPage(e);
  };

  return (
    <div className="">
      <SearchBar
        value={searchQuery}
        onChange={handleSearch}
        sort={handleSortToggle}
        itemsPerPage={itemsPerPage}
        handleItemsPerPage={handleItemsPerPage}
        data={data}
      />
      {type === "collections" && (
        <Collections
          collections={currentPageData}
          total={totalData}
          title={title}
        />
      )}
      {type === "documents" && (
        <Documents data={currentPageData} total={totalData} title={title} />
      )}
      {type === "dbs" && (
        <Dbs data={currentPageData} total={totalData} title={title} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Table;
