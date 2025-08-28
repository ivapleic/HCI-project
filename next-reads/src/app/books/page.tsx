"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBooksByGenre } from "./_lib/booksApi";
import { GetAuthorById } from "../../lib/api";
import { getGenreList } from "../genres/_lib/genresApi";

const BooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1); // Stanje za trenutnu stranicu
  const itemsPerPage = 5; // Broj knjiga po stranici

  const searchParams = useSearchParams(); // Use searchParams to access query parameters

  // Access the query parameters
  const genre = searchParams.get("genre");
  const tag = searchParams.get("tag");

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        let fetchedBooks: any[] = []; // Inicijalizacija varijable za pohranu knjiga

        if (genre) {
          // Dohvati knjige na temelju žanra
          fetchedBooks = await getBooksByGenre(genre);
        } else if (tag) {
          // Dohvati knjige na temelju taga (ako implementiraš ovu logiku)
          fetchedBooks = []; // Podesiti ovo prema implementaciji za tag-based fetching
        }

        // Za svaku knjigu dohvatiti autora
        for (const book of fetchedBooks) {
          if (book.fields.author) {
            const author = await GetAuthorById(book.fields.author.sys.id); // Dohvati autora na temelju ID-a
            book.fields.authorDetails = author; // Dodaj detalje autora u knjigu
          }
        }

        setBooks(fetchedBooks); // Ažuriraj stanje s dohvaćenim knjigama
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenres = async () => {
      try {
        const genresData = await getGenreList(); // Dohvati popis žanrova
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchBooks();
    fetchGenres();
  }, [genre, tag]);

  // Izračunaj ukupne stranice
  const totalPages = Math.ceil(books.length / itemsPerPage);

  // Prikazivanje samo knjiga za trenutnu stranicu
  const displayedBooks = books.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="w-full my-4 px-4 md:px-10 lg:px-20">
      <div className="grid grid-cols-4 gap-10">
        {/* Left side: Book details */}
        <div className="col-span-3">
          {loading ? (
            <div className="text-center text-lg">Loading books...</div>
          ) : (
            <div className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold text-[#593E2E] mb-6">
                {genre
                  ? `Books in ${genre}`
                  : tag
                  ? `Books with tag: ${tag}`
                  : "All Books"}
              </h1>

              {displayedBooks.length > 0 ? (
                displayedBooks.map((book: any, index: number) => (
                  <div
                    key={index}
                    className="flex bg-white rounded-lg shadow-md p-4 w-full mb-4"
                  >
                    {/* Slika knjige */}
                    <img
                      src={book.fields.coverImage.fields.file.url}
                      alt={book.title}
                      className="w-32 h-48 object-cover rounded-md mr-4"
                    />

                    {/* Detalji knjige i dropdown meni */}
                    <div className="flex flex-col  w-full space-y-2">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col space-y-1">
                          <h3 className="font-semibold text-xl text-[#593E2E]">
                            {book.fields.title}
                          </h3>
                          <h3 className="text-md text-gray-700">
                            {book.fields.authorDetails
                              ? book.fields.authorDetails.fullName
                              : "Unknown Author"}
                          </h3>
                        </div>

                        {/* Dropdown meni */}
                        <select
                          defaultValue="wantToRead"
                          className="p-2 bg-[#12504F] text-white rounded-md cursor-pointer hover:bg-[#0A3C39] transition duration-300"
                        >
                          <option value="favourites">Favourites</option>
                          <option value="wantToRead">Want to Read</option>
                          <option value="readingNow">Reading Now</option>
                        </select>
                      </div>

                      {/* Opis knjige */}
                      <p className="text-sm text-gray-500 ">
                        {book.fields.description
                          ? book.fields.description.slice(0, 250)
                          : "No description available."}
                        ...
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No books available.</p>
              )}

              {/* Navigacija stranica */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded-md ${
                    page === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#593E2E] text-white hover:bg-[#8C6954]"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700 font-semibold flex items-center justify-center">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    page === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#593E2E] text-white hover:bg-[#8C6954]"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desni div: Popis svih žanrova (uži dio) */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            All Genres
          </h2>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {genres.map((genre, index) => (
              <li key={`${genre.sys.id}-${index}`} className="border-b pb-2">
                <Link href={`/genres/${genre.fields.name.toLowerCase()}`}>
                  <span className="text-gray-800 hover:text-blue-500 transition">
                    {genre.fields.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
