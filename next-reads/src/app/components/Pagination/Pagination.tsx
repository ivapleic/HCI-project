"use client";

import React from "react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null; // Ne prikazuj ako je samo jedna stranica

  return (
    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#593E2E] text-white hover:bg-[#8C6954] cursor-pointer"
        }`}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-4 py-2 rounded-md ${
            currentPage === i + 1
              ? "bg-[#593E2E] text-white cursor-default"
              : "bg-gray-100 hover:bg-gray-200 cursor-pointer"
          }`}
          disabled={currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-[#593E2E] text-white hover:bg-[#8C6954] cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
}
