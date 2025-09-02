"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const coverImageUrl = book.coverImageUrl ?? "/placeholder_book.png";
  const [expanded, setExpanded] = useState(false);
  const hasLongDesc = (book.description?.trim().length ?? 0) > 160;

  // Handle card click
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Check if the click was on an excluded element
    const isExcludedElement = 
      e.target instanceof HTMLElement && 
      (e.target.closest('.category-dropdown') || 
       e.target.closest('.author-link') ||
       e.target.closest('.show-more-btn'));
    
    if (!isExcludedElement) {
      router.push(`/books/${book.id}`);
    }
  }, [book.id, router]);

  return (
    <div 
      className="relative flex items-start gap-3 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Dropdown in top right corner */}
      <div className="absolute top-3 right-3 z-10 category-dropdown" onClick={e => e.stopPropagation()}>
        <CategoryDropdown bookId={book.id} variant="icon" />
      </div>

      {/* Book cover */}
      <div className="flex-shrink-0">
        <img
          src={coverImageUrl}
          alt={book.title}
          className="w-16 h-24 md:w-24 md:h-32 object-cover rounded-md"
        />
      </div>

      {/* Book details */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Book title */}
        <h3 className="text-sm md:text-lg leading-tight font-semibold text-gray-900 break-words max-w-[170px] md:max-w-[280px]">
          {book.title}
        </h3>

        {/* Author */}
        {book.authorId && book.authorName ? (
          <Link
            href={`/author/${book.authorId}`}
            className="author-link text-xs md:text-[13px] text-gray-700 mt-1 mb-1 hover:text-[#593E2E] hover:underline leading-5"
            onClick={e => e.stopPropagation()}
          >
            by {book.authorName}
          </Link>
        ) : book.authorName ? (
          <p className="text-xs md:text-[13px] text-gray-700 mt-1 mb-1 leading-5">
            by {book.authorName}
          </p>
        ) : null}

        {/* Description */}
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
                onClick={e => {
                  e.stopPropagation();
                  setExpanded(v => !v);
                }}
                className="show-more-btn self-start mt-1 text-[11px] md:text-xs text-[#593E2E] hover:cursor-pointer"
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