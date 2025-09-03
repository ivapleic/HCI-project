"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getGenreList, getBooks } from "./_lib/genresApi";
import GenresList from "../components/GenresList/GenresList";
import Pagination from "../components/Pagination/Pagination";

// Helper function to get cover URL with fallback
const getCoverUrl = (book: any): string => {
  if (book.fields?.coverImage?.fields?.file?.url) {
    return `https:${book.fields.coverImage.fields.file.url}`;
  }
  return "/assets/book-placeholder.png";
};

// Helper function to generate genre slug
const getGenreSlug = (genreName: string): string => {
  return genreName.toLowerCase().replace(/\s+/g, "-");
};

const GenresPage = () => {
  const [genres, setGenres] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 8;
  const totalPages = Math.ceil(genres.length / itemsPerPage);
  const displayedGenres = genres.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Memoize filtered books by genre to avoid recalculating on every render
  const filteredBooksByGenre = useMemo(() => {
    const filteredBooks: any = {};
    genres.forEach((genre: any) => {
      filteredBooks[genre.sys.id] = books.filter((book) =>
        book.fields.genre?.some(
          (genreItem: any) => genreItem.sys.id === genre.sys.id
        )
      );
    });
    return filteredBooks;
  }, [genres, books]);

  const filteredGenres = useMemo(() => 
    genres.filter((genre) =>
      genre.fields.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [genres, searchQuery]
  );

  useEffect(() => {
    const fetchGenresAndBooks = async () => {
      try {
        const [genreData, booksData] = await Promise.all([
          getGenreList(),
          getBooks()
        ]);
        
        setGenres(genreData);
        setBooks(booksData);
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
      router.push(`/genres/${getGenreSlug(matchedGenre.fields.name)}`);
      setShowDropdown(false);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      id="page-top"
      className="w-full mt-2 sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px] flex justify-center"
    >
      {loading ? (
        <div className="text-center text-lg">Loading genres...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-center mx-auto md:justify-normal w-full">
          <div className="md:col-span-2 sm:bg-white bg-neutral-light px-6 py-4 sm:py-6 sm:rounded-lg sm:shadow-md">
            <h1 className="text-3xl text-neutral-dark font-bold tracking-tight text-left mb-4">
              Genres
            </h1>

            {/* Enhanced Search Bar */}
            <div className="relative mb-8" ref={containerRef}>
              <input
                type="text"
                placeholder="Search genres by name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-lg border border-white bg-accent-pink px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-dark"
                aria-label="Search genres"
              />
              <button
                onClick={handleSearch}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 rounded cursor-pointer hover:text-neutral-dark transition-colors"
                aria-label="Search"
                type="button"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </button>

              {/* Dropdown for search suggestions */}
              {showDropdown && searchQuery.trim() && (
                <div className="absolute z-50 mt-1 w-full bg-white border-neutral-dark rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredGenres.length === 0 ? (
                    <div className="p-2 text-center text-neutral">No genres found</div>
                  ) : (
                    filteredGenres.slice(0, 5).map((genre) => (
                      <div
                        key={genre.sys.id}
                        className="px-3 py-2 hover:bg-accent-pink cursor-pointer border-b border-neutral-light last:border-none transition"
                        onClick={() => {
                          router.push(`/genres/${getGenreSlug(genre.fields.name)}`);
                          setShowDropdown(false);
                        }}
                      >
                        <div className="font-medium text-neutral-dark">{genre.fields.name}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-8 mb-10">
              {displayedGenres.map((genre, index) => (
                <div key={index}>
                  <h3
                    className="text-xl font-bold text-neutral-dark mb-2 cursor-pointer hover:underline"
                    onClick={() =>
                      router.push(`/genres/${getGenreSlug(genre.fields.name)}`)
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
                            src={getCoverUrl(book)}
                            alt={book.fields?.title || "Book cover"}
                            onError={(e) => {
                              e.currentTarget.src = "/assets/book-placeholder.png";
                            }}
                            className="w-24 h-33 2xl:w-40 2xl:h-60 object-cover rounded-md shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => router.push(`/books/${book.sys.id}`)}
                          />
                        ))
                    ) : (
                      <p className="text-neutral italic">
                        There are no books for this genre currently.
                      </p>
                    )}
                  </div>

                  <div className="text-right mt-4">
                    <Link
                      href={`/genres/${getGenreSlug(genre.fields.name)}`}
                      className="text-neutral-dark hover:underline font-medium"
                    >
                      More {genre.fields.name} Books →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              totalItems={genres.length}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>

          <div className="flex justify-center md:justify-start">
            <div className="w-full md:w-auto">
              <GenresList genres={genres} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenresPage;