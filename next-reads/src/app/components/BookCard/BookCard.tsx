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

export default function BookCard({ book }: BookCardProps) {
  const coverImageUrl = book.coverImageUrl ?? "/placeholder_book.png";

  // Show more/less state
  const [expanded, setExpanded] = useState(false);
  const hasLongDesc = (book.description?.trim().length ?? 0) > 160;

  return (
    <div className="relative flex items-start gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
      {/* Dropdown u gornjem desnom kutu */}
      <div className="absolute top-3 right-3 z-10">
        <CategoryDropdown bookId={book.id} variant="icon" />
      </div>

      <Link href={`/books/${book.id}`} className="flex-shrink-0 cursor-pointer">
        <img
          src={coverImageUrl}
          alt={book.title}
          className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-md"
        />
      </Link>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Naslov: malo manji (mob: base, md: lg) */}
        <Link
          href={`/books/${book.id}`}
          className="text-base md:text-lg leading-tight font-semibold text-gray-900 hover:text-[#593E2E] hover:underline cursor-pointer break-words max-w-[170px] md:max-w-[280px] truncate"
          style={{ wordBreak: "break-word" }}
        >
          {book.title}
        </Link>

        {/* Autor: smanjeno (mob: xs, md: ~13px) */}
        {book.authorId && book.authorName ? (
          <Link
            href={`/author/${book.authorId}`}
            className="text-xs md:text-[13px] text-gray-700 mt-1 mb-1 hover:text-[#593E2E] hover:underline leading-5"
          >
            by {book.authorName}
          </Link>
        ) : book.authorName ? (
          <p className="text-xs md:text-[13px] text-gray-700 mt-1 mb-1 leading-5">
            by {book.authorName}
          </p>
        ) : null}

        {/* Opis + Show more/less */}
        {book.description && (
          <>
            <p
              id={`desc-${book.id}`}
              className={`text-xs md:text-[13px] text-gray-600 leading-snug ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {book.description}
            </p>

            {hasLongDesc && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="self-start mt-1 text-[11px] md:text-xs text-[#593E2E] hover:underline"
                aria-expanded={expanded}
                aria-controls={`desc-${book.id}`}
              >
                {expanded ? "Show less ▲" : "Show more ▾"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
