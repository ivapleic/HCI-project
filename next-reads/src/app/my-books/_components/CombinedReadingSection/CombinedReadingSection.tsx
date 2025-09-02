"use client";

import React from "react";
import BookItem from "../BookCard/BookItem";
import { Category } from "../../page";

interface CombinedReadingSectionProps {
  currentlyReading: any[];
  readBooks: any[];
  onCategoryChange: (
    bookId: string,
    oldCategory: Category,
    newCategory: Category
  ) => void;
  onRemove: (bookId: string, category: Category) => void;
  actionInProgress: string | null;
}

const CombinedReadingSection = ({
  currentlyReading,
  readBooks,
  onCategoryChange,
  onRemove,
  actionInProgress
}: CombinedReadingSectionProps) => {
  return (
    <div className="bg-[#F6FAF6] rounded-xl p-5 shadow flex flex-col gap-2">
      <div>
        <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
          <span className="inline-block rounded-full bg-[#DBF1DD] px-2 py-1 text-xs font-bold text-[#599C66]">
            Currently Reading
          </span>
        </h2>
        <div>
          {currentlyReading.length === 0 ? (
            <div className="text-gray-400 text-sm italic">
              Nothing here yet…
            </div>
          ) : (
            currentlyReading
              .filter((book) => {
                const valid = book && book.sys && book.sys.id;
                if (!valid)
                  console.warn("Invalid currentlyReading item:", book);
                return valid;
              })
              .map((book) => (
                <BookItem
                  key={book.sys.id}
                  book={book}
                  type="currentlyReading"
                  onCategoryChange={onCategoryChange}
                  onRemove={onRemove}
                  actionInProgress={actionInProgress}
                />
              ))
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-300">
        <h3 className="text-sm font-semibold text-[#599C66] mb-2">Read</h3>
        <div>
          {readBooks.length === 0 ? (
            <div className="text-gray-400 text-sm italic">
              You have not read any books yet.
            </div>
          ) : (
            readBooks.map((book: any) => (
              <BookItem
                key={book.sys.id}
                book={book}
                type="read"
                onCategoryChange={onCategoryChange}
                onRemove={onRemove}
                actionInProgress={actionInProgress}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedReadingSection;