"use client";
import React from "react";
import {
  BarsArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const SearchBar = ({
  value,
  onChange,
  sort,
  itemsPerPage,
  handleItemsPerPage,
}) => {
  return (
    <div className="border-b border-secondary pb-1 flex gap-x-2 justify-between items-center">
      <select
        className="mr-auto block rounded-md bg-background p-1 text-base outline outline-1 -outline-offset-1 placeholder:text-gray-500 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
        onChange={(e) => handleItemsPerPage(e.target.value)}
        value={itemsPerPage}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <div className="flex ml-auto sm:mt-0">
        <div className="-mr-px grid grow grid-cols-1 focus-within:relative">
          <input
            id="query"
            name="query"
            type="text"
            onChange={(e) => onChange(e.target.value)}
            value={value}
            placeholder="Search any keyword"
            aria-label="Search"
            className="col-start-1 row-start-1 block w-full rounded-l-md bg-background py-1.5 pl-10 pr-3 text-foreground outline outline-1 -outline-offset-1  placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondarysm:pl-9 text-sm/3"
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-4 self-center text-gray-400 sm:size-4"
          />
        </div>
        <button
          type="button"
          onClick={sort}
          className="flex shrink-0 items-center gap-x-1.5 rounded-r-md bg-background px-3 py-2 text-sm/3 font-semibold text-accent outline outline-1 -outline-offset-1  hover:bg-background focus:relative focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary"
        >
          <BarsArrowUpIcon
            aria-hidden="true"
            className="-ml-0.5 size-3 text-accent"
          />
          Sort
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
