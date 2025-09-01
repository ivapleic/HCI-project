"use client";

import { useEffect, useState } from "react";
import {
  getWantToReadByUserId,
  getCurrentlyReadingBookByUserId,
  getReadBooksByUserId,
  getFavouritesByUserId,
} from "../my-books/_lib/MyBooksApi";

type Category = "wantToRead" | "currentlyReading" | "read" | "favourites";

const BookCard = ({
  book,
  type,
  onCategoryChange,
  onRemove,
}: {
  book: any;
  type: Category;
  onCategoryChange: (
    bookId: string,
    oldCategory: Category,
    newCategory: Category
  ) => void;
  onRemove: (bookId: string, category: Category) => void;
}) => {
  const bookId = book.sys.id;
  const author = book.fields.author;
  const authorId = author?.sys?.id;
  const bookTitle = book.fields.title;
  const coverImageUrl = book?.fields?.coverImage?.fields?.file?.url;

  return (
    <div className="bg-white rounded-lg shadow flex items-start gap-3 p-4 mb-4 relative">
      <a
        href={`/books/${bookId}`}
        className="flex-shrink-0 block w-16 h-24 rounded overflow-hidden"
      >
        {coverImageUrl && (
          <img
            src={`https:${coverImageUrl}`}
            alt={bookTitle}
            className="w-full h-full object-cover"
          />
        )}
      </a>

      <div className="flex-1">
        <a
          href={`/books/${bookId}`}
          className="font-semibold text-[#8B5E3C] hover:underline"
        >
          {bookTitle}
        </a>

        {author && author.fields.fullName && (
          <div className="text-xs text-gray-700 mt-1">
            <a
              href={`/author/${authorId}`}
              className="hover:underline text-gray-700"
            >
              {author.fields.fullName}
            </a>
          </div>
        )}

        <div className="text-xs text-yellow-500 mb-1">★★★★★</div>

        {type === "currentlyReading" && (
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className="bg-orange-400 h-2 rounded"
              style={{ width: "20%" }}
            />
          </div>
        )}

      <div className="mt-3 flex gap-2">
  {type !== "wantToRead" && (
    <button
      onClick={() => onCategoryChange(bookId, type, "wantToRead")}
      className="py-1 px-3 text-xs rounded bg-[#f7e8c9] hover:bg-gray-100 transition hover:cursor-pointer"
    >
      Want to Read
    </button>
  )}
  {type !== "currentlyReading" && (
    <button
      onClick={() => onCategoryChange(bookId, type, "currentlyReading")}
      className="py-1 px-3 text-xs rounded bg-[#cde7cd] hover:bg-green-200 transition hover:cursor-pointer"
    >
      Start Reading
    </button>
  )}
  {type !== "read" && (
    <button
      onClick={() => onCategoryChange(bookId, type, "read")}
      className="py-1 px-3 text-xs rounded bg-[#c6d5e9] hover:bg-blue-200 transition hover:cursor-pointer"
    >
      Mark as Read
    </button>
  )}
</div>

      </div>

      {/* Ikona kantice za uklanjanje iz kategorije */}
      <button
        onClick={() => onRemove(bookId, type)}
        title="Remove from category"
        className="absolute top-2 right-2 cursor-pointer transition hover:opacity-80"
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

export default function MyBooks() {
  const [wantToRead, setWantToRead] = useState<any[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<any[]>([]);
  const [readBooks, setReadBooks] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Dohvat userId iz localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUserId(null);
      setLoading(false);
      return;
    }
    const userObj = JSON.parse(storedUser);
    setUserId(userObj.id);
  }, []);

  // Dohvat knjiga
  const fetchBooks = async (uid: string) => {
    setLoading(true);
    const [want, reading, read, favs] = await Promise.all([
      getWantToReadByUserId(uid),
      getCurrentlyReadingBookByUserId(uid),
      getReadBooksByUserId(uid),
      getFavouritesByUserId(uid),
    ]);

    if (Array.isArray(reading)) {
      setCurrentlyReading(reading);
    } else if (reading) {
      setCurrentlyReading([reading]);
    } else {
      setCurrentlyReading([]);
    }

    setWantToRead(want || []);
    setReadBooks(read || []);
    setFavourites(favs || []);
    setLoading(false);
  };

  // Pokretanje fetchBooks kad se promjene userId ili reloadTrigger
  useEffect(() => {
    if (userId) {
      fetchBooks(userId);
    }
  }, [userId, reloadTrigger]);

  // Funkcija za promjenu kategorije (premještanje knjige)
  const handleCategoryChange = async (
    bookId: string,
    oldCategory: Category,
    newCategory: Category
  ) => {
    if (!userId) return;

    let movedBook: any;
    if (oldCategory === "wantToRead") {
      movedBook = wantToRead.find((b) => b.sys.id === bookId);
      setWantToRead((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (oldCategory === "currentlyReading") {
      movedBook = currentlyReading.find((b) => b.sys.id === bookId);
      setCurrentlyReading((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (oldCategory === "read") {
      movedBook = readBooks.find((b) => b.sys.id === bookId);
      setReadBooks((prev) => prev.filter((b) => b.sys.id !== bookId));
    }

    if (movedBook) {
      if (newCategory === "wantToRead") {
        setWantToRead((prev) => [...prev, movedBook]);
      } else if (newCategory === "currentlyReading") {
        setCurrentlyReading((prev) => {
          if (!prev.some((b) => b.sys.id === movedBook.sys.id)) {
            return [...prev, movedBook];
          }
          return prev;
        });
      } else if (newCategory === "read") {
        setReadBooks((prev) => [...prev, movedBook]);
      }
    }

    try {
      const res = await fetch("/api/my-books/moveCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId, oldCategory, newCategory }),
      });
      if (!res.ok) throw new Error("Failed to update category");

      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Backend error:", error);
    }
  };

  // Nova funkcija za uklanjanje iz kategorije (favorites ili ostale)
  const handleRemoveFromCategory = async (
    bookId: string,
    category: Category
  ) => {
    if (!userId) return;

    // Lokalno ukloni odmah knjigu iz stanja
    if (category === "wantToRead") {
      setWantToRead((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (category === "currentlyReading") {
      setCurrentlyReading((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (category === "read") {
      setReadBooks((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (category === "favourites") {
      setFavourites((prev) => prev.filter((b) => b.sys.id !== bookId));
    }

    try {
      const res = await fetch("/api/my-books/removeFromCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId, category }),
      });
      if (!res.ok) throw new Error("Failed to remove book from category");

      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Backend error:", error);
    }
  };

  if (!userId) {
    return (
      <div className="py-16 text-center text-lg text-red-600">
        No user ID found. Please log in.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-lg text-gray-700">
        Loading your shelves…
      </div>
    );
  }

  if (
    wantToRead.length === 0 &&
    currentlyReading.length === 0 &&
    readBooks.length === 0
  ) {
    return (
      <div className="py-16 text-center text-lg text-gray-700">
        You have no books in your shelves yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <h1 className="text-3xl font-bold my-4 text-[#593E2E]">Bookshelves</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {/* Want To Read */}
        <div className="bg-[#F9F6F3] rounded-xl p-5 shadow">
          <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
            <span className="inline-block rounded-full bg-[#EEE3D2] px-2 py-1 text-xs font-bold text-[#87715A]">
              Want To Read
            </span>
          </h2>
          <div>
            {wantToRead.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                Nothing here yet…
              </div>
            ) : (
              wantToRead.map((book: any) => (
                <BookCard
                  key={book.sys.id}
                  book={book}
                  type="wantToRead"
                  onCategoryChange={handleCategoryChange}
                  onRemove={handleRemoveFromCategory}
                />
              ))
            )}
          </div>
        </div>

        {/* Favourites */}
        <div className="bg-[#F3F6FA] rounded-xl p-5 shadow">
          <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
            <span className="inline-block rounded-full bg-[#D6E3F3] px-2 py-1 text-xs font-bold text-[#6A7BA3]">
              Favourites
            </span>
          </h2>
          <div>
            {favourites.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                No favourites yet.
              </div>
            ) : (
              favourites.map((book: any) => (
                <BookCard
                  key={book.sys.id}
                  book={book}
                  type="favourites"
                  onCategoryChange={handleCategoryChange}
                  onRemove={handleRemoveFromCategory}
                />
              ))
            )}
          </div>
        </div>

        {/* Currently Reading + Read */}
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
                    <BookCard
                      key={book.sys.id}
                      book={book}
                      type="currentlyReading"
                      onCategoryChange={handleCategoryChange}
                      onRemove={handleRemoveFromCategory}
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
                  <BookCard
                    key={book.sys.id}
                    book={book}
                    type="read"
                    onCategoryChange={handleCategoryChange}
                    onRemove={handleRemoveFromCategory}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
