"use client";

import React, { useState } from "react";
import Link from "next/link";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";

export interface BookCardProps {
  book: {
    id: string;
    title: string;
    coverImageUrl?: string;
    authorName?: string;
    authorId?: string;
    description?: string;
  };
  onCategoryChange?: (newCategory: string) => void;
}

export default function BookCard({ book, onCategoryChange }: BookCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const coverImageUrl = book.coverImageUrl ?? "/placeholder_book.png";

  return (
    <div className="relative flex items-start gap-3 p-4 bg-white rounded-xl shadow-md border hover:shadow-lg transition">
      {/* Mjesto za CategoryDropdown u gornjem desnom kutu */}
      <div className="absolute top-3 right-3 z-10">
        <CategoryDropdown bookId={book.id} variant="icon"/>
      </div>

      <Link href={`/books/${book.id}`} className="flex-shrink-0 cursor-pointer">
        <img
          src={coverImageUrl}
          alt={book.title}
          className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-md"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <Link
          href={`/books/${book.id}`}
          className="text-lg md:text-xl font-semibold text-gray-900 hover:text-[#593E2E] hover:underline cursor-pointer"
        >
          {book.title}
        </Link>

        {book.authorId && book.authorName ? (
          <Link
            href={`/author/${book.authorId}`}
            className="text-sm text-gray-700 mt-1 mb-1 hover:text-[#593E2E] hover:underline"
          >
            by {book.authorName}
          </Link>
        ) : book.authorName ? (
          <p className="text-sm text-gray-700 mt-1 mb-1">by {book.authorName}</p>
        ) : null}

        {book.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
        )}
      </div>
    </div>
  );
}
