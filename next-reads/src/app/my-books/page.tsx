"use client";

import { useEffect, useState } from "react";
import {
  getWantToReadByUserId,
  getCurrentlyReadingBookByUserId,
  getReadBooksByUserId,
  getFavouritesByUserId
} from "../my-books/_lib/MyBooksApi";

// BookCard komponenta za prikaz svake knjige u listama
const BookCard = ({
  book,
  type,
}: {
  book: any;
  type: "want" | "reading" | "read";
}) => {
  const bookId = book.sys.id;
  const author = book.fields.author;
  const authorId = author?.sys?.id;
  const bookTitle = book.fields.title;
  const coverImageUrl = book?.fields?.coverImage?.fields?.file?.url;

  return (
    <div className="bg-white rounded-lg shadow border flex items-start gap-3 p-4 mb-4">
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

        {/* Stars Dummy */}
        <div className="text-xs text-yellow-500 mb-1">★★★★★</div>

        {/* Progress Dummy */}
        {type === "reading" && (
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className="bg-orange-400 h-2 rounded"
              style={{ width: "20%" }}
            />
          </div>
        )}

        {type === "read" ? (
          // <button className="mt-3 py-1 px-3 text-xs border rounded hover:bg-gray-50 transition">
          //   Write A Review
          // </button>
            <></>
        ) : (
           <button className="mt-3 py-1 px-3 text-xs border rounded hover:bg-gray-50 transition">
             Update Progress
           </button>
        
        )}
      </div>
    </div>
  );
};

export default function MyBooks() {
  const [wantToRead, setWantToRead] = useState<any[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<any[]>([]);
  const [readBooks, setReadBooks] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Pagination state for all 3 categories
  const [currentPageWant, setCurrentPageWant] = useState(1);
  const [currentPageReading, setCurrentPageReading] = useState(1);
  const [currentPageRead, setCurrentPageRead] = useState(1);
  const booksPerPage = 5;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUserId(null);
      setLoading(false);
      return;
    }
    const userObj = JSON.parse(storedUser);
    const id = userObj.id;
    setUserId(id);
  }, []);

useEffect(() => {
    if (!userId) return;

    async function fetchBooks() {
      setLoading(true);
      const [want, reading, read, favs] = await Promise.all([
        getWantToReadByUserId(userId!),
        getCurrentlyReadingBookByUserId(userId!),
        getReadBooksByUserId(userId!),
        getFavouritesByUserId(userId!),
      ]);
      setWantToRead(want || []);
      setCurrentlyReading(reading ? [reading] : []);
      setReadBooks(read || []);
      setFavourites(favs || []);
      setLoading(false);
    }
    fetchBooks();
  }, [userId]);


  // Pagination slices
  const indexLastWant = currentPageWant * booksPerPage;
  const indexFirstWant = indexLastWant - booksPerPage;
  const currentWantToRead = wantToRead.slice(indexFirstWant, indexLastWant);

  const indexLastReading = currentPageReading * booksPerPage;
  const indexFirstReading = indexLastReading - booksPerPage;
  const currentCurrentlyReading = currentlyReading.slice(
    indexFirstReading,
    indexLastReading
  );

  const indexLastRead = currentPageRead * booksPerPage;
  const indexFirstRead = indexLastRead - booksPerPage;
  const currentReadBooks = readBooks.slice(indexFirstRead, indexLastRead);

  // Total pages
  const totalPagesWant = Math.ceil(wantToRead.length / booksPerPage);
  const totalPagesReading = Math.ceil(currentlyReading.length / booksPerPage);
  const totalPagesRead = Math.ceil(readBooks.length / booksPerPage);

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

  // Pagination buttons component
  const Pagination = ({
    totalPages,
    currentPage,
    onPageChange,
  }: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-1 rounded ${
              pageNum === currentPage
                ? "bg-[#6A7BA3] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    );
  };

return (
  <div className="max-w-7xl mx-auto px-4 py-4">
    <h1 className="text-3xl font-bold mb-8 text-[#593E2E]">Bookshelves</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
      {/* Want To Read (lijevo) */}
      <div className="bg-[#F9F6F3] rounded-xl p-5 shadow border">
        <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
          <span className="inline-block rounded-full bg-[#EEE3D2] px-2 py-1 text-xs font-bold text-[#87715A]">
            Want To Read
          </span>
        </h2>
        {/* <button className="w-full py-2 mb-5 rounded border bg-white text-[#87715A] font-semibold hover:bg-[#F0EADD] transition">
          + Add A New Book
        </button> */}
        <div>
          {wantToRead.length === 0 && (
            <div className="text-gray-400 text-sm italic">Nothing here yet…</div>
          )}
          {currentWantToRead.map((book: any) => (
            <BookCard key={book.sys.id} book={book} type="want" />
          ))}
        </div>
        <Pagination
          totalPages={totalPagesWant}
          currentPage={currentPageWant}
          onPageChange={setCurrentPageWant}
        />
      </div>

      {/* Favourites (sredina) */}
      <div className="bg-[#F3F6FA] rounded-xl p-5 shadow border">
        <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
          <span className="inline-block rounded-full bg-[#D6E3F3] px-2 py-1 text-xs font-bold text-[#6A7BA3]">
            Favourites
          </span>
        </h2>
        {/* <button className="w-full py-2 mb-5 rounded border bg-white text-[#6A7BA3] font-semibold hover:bg-[#E3EDFA] transition">
          + Add A New Book
        </button> */}
        <div>
          {favourites.length === 0 && (
            <div className="text-gray-400 text-sm italic">No favourites yet.</div>
          )}
          {favourites.map((book: any) => (
            <BookCard key={book.sys.id} book={book} type="read" />
          ))}
        </div>
      </div>

      {/* Currently Reading + Read (desno) */}
      <div className="bg-[#F6FAF6] rounded-xl p-5 shadow border flex flex-col gap-2">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-base mb-4">
            <span className="inline-block rounded-full bg-[#DBF1DD] px-2 py-1 text-xs font-bold text-[#599C66]">
              Currently Reading
            </span>
          </h2>
          {/* <button className="w-full py-2 mb-5 rounded border bg-white text-[#599C66] font-semibold hover:bg-[#E6F0E6] transition">
            + Add A New Book
          </button> */}
          <div>
            {currentlyReading.length === 0 ? (
              <div className="text-gray-400 text-sm italic">Nothing here yet…</div>
            ) : (
              currentCurrentlyReading.map((book: any) => (
                <BookCard key={book.sys.id} book={book} type="reading" />
              ))
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <h3 className="text-sm font-semibold text-[#599C66] mb-2">Read</h3>
          <div>
            {currentReadBooks.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                You have not read any books yet.
              </div>
            ) : (
              currentReadBooks.map((book: any) => (
                <BookCard key={book.sys.id} book={book} type="read" />
              ))
            )}
          </div>
          <Pagination
            totalPages={totalPagesRead}
            currentPage={currentPageRead}
            onPageChange={setCurrentPageRead}
          />
        </div>
      </div>
    </div>
  </div>
);
}
