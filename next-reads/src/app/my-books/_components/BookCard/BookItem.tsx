"use client";

import React from "react";
import { Category } from "../../page";

interface BookItemProps {
  book: any;
  type: Category;
  onCategoryChange: (
    bookId: string,
    oldCategory: Category,
    newCategory: Category
  ) => void;
  onRemove: (bookId: string, category: Category) => void;
  actionInProgress: string | null;
}

const BookItem = ({
  book,
  type,
  onCategoryChange,
  onRemove,
  actionInProgress
}: BookItemProps) => {
  const bookId = book.sys.id;
  const author = book.fields.author;
  const authorId = author?.sys?.id;
  const bookTitle = book.fields.title;
  const coverImageUrl = book?.fields?.coverImage?.fields?.file?.url;

  // Provjeri je li trenutna akcija u tijeku za ovu knjigu
  const isActionInProgress = actionInProgress?.includes(bookId) || false;

  return (
    <div className="bg-neutral-white rounded-lg shadow flex items-start gap-3 p-4 mb-4 relative">
      <a
        href={`/books/${bookId}`}
        className="flex-shrink-0 block w-16 h-24 rounded overflow-hidden"
      >
        {coverImageUrl ? (
          <img
            src={`https:${coverImageUrl}`}
            alt={bookTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/assets/book-placeholder.png";
            }}
          />
        ) : (
          <img
            src="/assets/book-placeholder.png"
            alt={bookTitle}
            className="w-full h-full object-cover"
          />
        )}
      </a>

      <div className="flex-1">
        <a
          href={`/books/${bookId}`}
          className="font-semibold text-neutral-dark hover:underline"
        >
          {bookTitle}
        </a>

        {author && author.fields.fullName && (
          <div className="text-xs text-neutral mt-1">
            <a
              href={`/author/${authorId}`}
              className="hover:underline text-neutral"
            >
              {author.fields.fullName}
            </a>
          </div>
        )}


        <div className="mt-3 flex gap-2 flex-wrap">
          {type !== "wantToRead" && (
            <button
              onClick={() => !isActionInProgress && onCategoryChange(bookId, type, "wantToRead")}
              disabled={isActionInProgress}
              className={`py-1 px-3 text-xs rounded bg-accent-pink text-neutral-dark transition ${
                isActionInProgress 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-neutral-light hover:cursor-pointer"
              }`}
            >
              {isActionInProgress ? "Processing..." : "Want to Read"}
            </button>
          )}
          {type !== "currentlyReading" && (
            <button
              onClick={() => !isActionInProgress && onCategoryChange(bookId, type, "currentlyReading")}
              disabled={isActionInProgress}
              className={`py-1 px-3 text-xs rounded bg-[#cde7cd] text-neutral-dark transition ${
                isActionInProgress 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-green-200 hover:cursor-pointer"
              }`}
            >
              {isActionInProgress ? "Processing..." : "Start Reading"}
            </button>
          )}
          {type !== "read" && (
            <button
              onClick={() => !isActionInProgress && onCategoryChange(bookId, type, "read")}
              disabled={isActionInProgress}
              className={`py-1 px-3 text-xs rounded bg-[#c6d5e9] text-neutral-dark transition ${
                isActionInProgress 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:bg-blue-200 hover:cursor-pointer"
              }`}
            >
              {isActionInProgress ? "Processing..." : "Mark as Read"}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => !isActionInProgress && onRemove(bookId, type)}
        disabled={isActionInProgress}
        title="Remove from category"
        className={`absolute top-2 right-2 transition ${
          isActionInProgress ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"
        }`}
      >
        <img
          src="/assets/icons8-bin-50.png" 
          alt="Remove"
          className="w-4 h-4"
        />
      </button>
    </div>
  );
};

export default BookItem;