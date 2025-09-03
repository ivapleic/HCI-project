"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CategoryDropdown from "../CategoryDropdown/CategoryDropdown";

export interface BookCardProps {
  book: {
    id?: string;
    title?: string;
    coverImageUrl?: string;
    authorName?: string;
    authorId?: string;
    description?: string;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const coverImageUrl = book.coverImageUrl ?? "/assets/book-placeholder.png";

  const [expanded, setExpanded] = useState(false);
  const hasLongDesc = (book.description?.trim().length ?? 0) > 160;

  return (
    <div
      role="button"
      aria-label={`View details for ${book.title || "Untitled book"}`}
      className={`relative flex items-start gap-3 p-2 md:p-4 bg-neutral-light md:bg-white rounded-xl shadow-md hover:shadow-lg transition ${
        book.id ? "cursor-pointer" : "cursor-default opacity-70"
      }`}
      onClick={() => book.id && router.push(`/books/${book.id}`)}
    >
      {/* Dropdown in top right corner */}
      {book.id && (
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <CategoryDropdown bookId={book.id} variant="icon" />
        </div>
      )}

      {/* Book cover */}
      <img
        src={coverImageUrl}
        alt={book.title || "Book cover"}
        onError={(e) => {
          e.currentTarget.src = "/assets/book-placeholder.png";
        }}
        className="w-16 h-24 md:w-24 md:h-32 object-cover rounded-md flex-shrink-0"
      />

      {/* Book details */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="text-sm sm:text-lg md:text-xl leading-tight font-semibold text-neutral-dark break-words max-w-[170px] md:max-w-[280px] hover:underline">
          {book.title || "Untitled book"}
        </h3>

        {book.authorName ? (
          book.authorId ? (
            <Link
              href={`/author/${book.authorId}`}
              className="author-link text-sm md:text-md text-neutral-dark mt-1 mb-1 hover:text-neutral hover:underline leading-5"
              onClick={(e) => e.stopPropagation()}
            >
              by {book.authorName}
            </Link>
          ) : (
            <p className="text-xs md:text-[13px] text-neutral mt-1 mb-1 leading-5">
              by {book.authorName}
            </p>
          )
        ) : (
          <p className="text-xs md:text-[13px] text-neutral mt-1 mb-1 leading-5">
            Unknown author
          </p>
        )}

        {book.description ? (
          <>
            <p
              id={`desc-${book.id}`}
              className={`text-xs md:text-[13px] text-neutral-dark leading-snug whitespace-pre-line transition-all duration-200 ease-in-out ${
                expanded ? "" : "line-clamp-2"
              }`}
            >
              {book.description}
            </p>

            {hasLongDesc && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
                className="show-more-btn self-start rounder p-2 border hover:bg-gray-50 border-gray-50 mt-1 text-[11px] md:text-xs text-neutral-dark hover:text-neutral"
                aria-expanded={expanded}
                aria-controls={`desc-${book.id}`}
              >
                {expanded ? "Show less ▲" : "Show more ▾"}
              </button>
            )}
          </>
        ) : (
          <p className="text-xs md:text-[13px] text-neutral italic">
            No description available.
          </p>
        )}
      </div>
    </div>
  );
}
