"use client";
import React from "react";
import PropTypes from "prop-types";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  if (totalPages === 0) return null;

  return (
    <nav className="flex items-center justify-between border-t border-secondary py-2 px-4">
      <div className="flex w-0 flex-1">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            //disabled={currentPage === 1}
            className="inline-flex items-center text-sm font-medium text-foreground hover:border-accent cursor-pointer"
          >
            <ArrowLongLeftIcon
              aria-hidden="true"
              className="mr-3 size-5 text-foreground hover:text-accent"
            />
            Previous
          </button>
        )}
      </div>

      <div className="flex items-center justify-center">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={
              number === currentPage
                ? "inline-flex items-center text-foreground"
                : "inline-flex items-center border-transparent text-foreground hover:text-accent hover:border-secondary"
            }
          >
            {number === currentPage
              ? "Page " + number + " of " + totalPages
              : ""}
          </button>
        ))}
      </div>
      <div className="flex w-0 flex-1 justify-end">
        {currentPage !== totalPages && (
          <button
            className="inline-flex items-center text-sm font-medium text-foreground hover:border-accent cursor-pointer"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowLongRightIcon
              aria-hidden="true"
              className="ml-3 size-5 text-gray-400"
            />
          </button>
        )}
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
