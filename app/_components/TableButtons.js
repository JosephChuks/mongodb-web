"use client";
import React, { useState } from "react";
import Spinner from "./Spinner";
import { FaEye, FaTrashAlt } from "react-icons/fa";

export default function TableButtons({
  isLoading,
  onDelete,
  onManage,
  item,
  activeItem,
}) {
  const [buttonActive, setButtonActive] = useState(false);

  return (
    <div className="shrink-0 flex">
      <button
        type="submit"
        onClick={() => {
          setButtonActive(1);
          onDelete(item);
        }}
        className="bg-red-600 px-2 py-1 text-sm rounded text-white cursor-pointer mr-1"
      >
        {isLoading && activeItem === item && buttonActive === 1 ? (
          <Spinner size="5" />
        ) : (
          <>
            <FaTrashAlt className="inline-flex" />
          </>
        )}
      </button>
      <button
        type="submit"
        onClick={() => {
          setButtonActive(2);
          onManage(item);
        }}
        className="bg-primary px-2 py-1 text-sm rounded text-text-muted font-bold cursor-pointer"
      >
        {isLoading && activeItem === item && buttonActive === 2 ? (
          <Spinner size="5" />
        ) : (
          <FaEye className="inline-flex" />
        )}
      </button>
    </div>
  );
}
