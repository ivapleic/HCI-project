"use client";

import React from "react";
import BookItem from "../BookCard/BookItem";
import { Category } from "../../page";

interface BookshelfSectionProps {
  title: string;
  books: any[];
  type: Category;
  badgeColor: string;
  badgeTextColor: string;
  onCategoryChange: (
    bookId: string,
    oldCategory: Category,
    newCategory: Category
  ) => void;
  onRemove: (bookId: string, category: Category) => void;
  emptyMessage: string;
  actionInProgress: string | null;
}

const BookshelfSection = ({
  title,
  books,
  type,
  badgeColor,
  badgeTextColor,
  onCategoryChange,
  onRemove,
  emptyMessage,
  actionInProgress
}: BookshelfSectionProps) => {
  return (
    <div className={`rounded-xl p-5 shadow ${getBgColor(type)}`}>
      <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
        <span 
          className="inline-block rounded-full px-2 py-1 text-xs font-bold"
          style={{ backgroundColor: badgeColor, color: badgeTextColor }}
        >
          {title}
        </span>
      </h2>
      <div>
        {books.length === 0 ? (
          <div className="text-neutral text-sm italic">
            {emptyMessage}
          </div>
        ) : (
          books.map((book: any) => (
            <BookItem
              key={book.sys.id}
              book={book}
              type={type}
              onCategoryChange={onCategoryChange}
              onRemove={onRemove}
              actionInProgress={actionInProgress}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Helper function to determine background color based on shelf type
const getBgColor = (type: Category) => {
  switch (type) {
    case "wantToRead":
      return "bg-accent-pink";
    case "favourites":
      return "bg-[#F3F6FA]";
    case "currentlyReading":
    case "read":
      return "bg-[#F6FAF6]";
    default:
      return "bg-neutral-light";
  }
};

export default BookshelfSection;