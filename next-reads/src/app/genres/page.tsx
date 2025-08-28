"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGenreList, getBooks } from "./_lib/genresApi";
import GenresList from "../components/GenresList/GenresList";

const GenresPage = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooksByGenre, setFilteredBooksByGenre] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(genres.length / itemsPerPage);
  const displayedGenres = genres.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredGenres = genres.filter((genre) =>
    genre.fields.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchGenresAndBooks = async () => {
      try {
        const genreData = await getGenreList();
        setGenres(genreData);

        const booksData = await getBooks();
        setBooks(booksData);

        const filteredBooks: any = {};
        genreData.forEach((genre: any) => {
          filteredBooks[genre.sys.id] = booksData.filter((book) =>
            book.fields.genre.some(
              (genreItem: any) => genreItem.sys.id === genre.sys.id
            )
          );
        });
        setFilteredBooksByGenre(filteredBooks);
      } catch (error) {
        console.error("Error fetching genres or books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenresAndBooks();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const matchedGenre = genres.find(
      (genre) => genre.fields.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (matchedGenre) {
      const genreSlug = matchedGenre.fields.name
        .toLowerCase()
        .replace(/\s+/g, "-");

      router.push(`/genres/${genreSlug}`);
    } else {
      router.push("/genres/not-found");
    }
  };

  useEffect(() => {
    const topElement = document.getElementById("page-top");
    if (topElement) {
      topElement.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [page]);

  return (
    <div
      id="page-top"
      className="
        w-full
        mt-4
        mb-4
        px-0
        md:px-20
        mx-0
        md:mx-auto
        md:max-w-[1200px]
        flex
        justify-center
      "
    >
      {loading ? (
        <div className="text-center text-lg">Loading genres...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center mx-auto md:justify-normal w-full">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
            <h1 className="text-3xl text-[#593E2E] font-bold tracking-tight text-left mb-4">
              Genres
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-8">
              <input
                type="text"
                placeholder="Search genres by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#593E2E]"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#593E2E] text-white rounded-md hover:bg-[#8C6954] w-full sm:w-auto text-sm sm:text-base"
              >
                Search
              </button>
            </div>

            <div className="space-y-8">
              {displayedGenres.map((genre, index) => (
                <div key={index} className="border-b pb-6">
                  <h3
                    className="text-xl font-bold text-[#593E2E] mb-2 cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(
                        `/genres/${genre.fields.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`
                      )
                    }
                  >
                    {genre.fields.name}
                  </h3>

                  <div className="flex space-x-4 overflow-hidden min-h-[132px]">
                    {filteredBooksByGenre[genre.sys.id] &&
                    filteredBooksByGenre[genre.sys.id].length > 0 ? (
                      filteredBooksByGenre[genre.sys.id]
                        .slice(0, 6)
                        .map((book: any, idx: number) => (
                          <img
                            key={idx}
                            src={book.fields.coverImage.fields.file.url}
                            alt={book.fields.title}
                            className="w-24 h-33 2xl:w-40 2xl:h-60 object-cover rounded-md shadow-md cursor-pointer"
                            onClick={() => router.push(`/books/${book.sys.id}`)}
                          />
                        ))
                    ) : (
                      <p className="text-gray-500 italic">
                        There are no books for this genre currently.
                      </p>
                    )}
                  </div>

                  <div className="text-right mt-4">
                    <Link
                      href={`/genres/${genre.fields.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="text-[#593E2E] hover:underline font-medium"
                    >
                      More {genre.fields.name} Books →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4 mt-6 flex-wrap">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded-md ${
                  page === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#593E2E] text-white hover:bg-[#8C6954]"
                } text-xs sm:text-sm`}
              >
                Previous
              </button>
              <span className="text-gray-700 font-semibold flex items-center justify-center text-xs sm:text-sm whitespace-nowrap">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded-md ${
                  page === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#593E2E] text-white hover:bg-[#8C6954]"
                } text-xs sm:text-sm`}
              >
                Next
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-start">
            <div className="w-full md:w-auto">
              <GenresList genres={filteredGenres} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresPage;
