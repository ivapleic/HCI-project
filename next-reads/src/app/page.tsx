"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { getGenreList } from "../lib/api";
import { getAllBooks } from "./books/_lib/booksApi";

const PREFERRED_GENRES: string[] = [
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "History",
  "Non-fiction",
  "Classics",
];

const keyOf = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const HomePage = () => {

  const scrollersRef = useRef<HTMLElement | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchGenres = async () => {
    try {
      const data = await getGenreList();
      setGenres(data);
    } catch (err) {
      console.error("Error fetching genres:", err);
      setError("Could not load genres.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const fetchedBooks = await getAllBooks();
      setBooks(fetchedBooks.slice(0, 20));
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Could not load books.");
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchBooks();

    const scrollers = scrollersRef.current?.querySelectorAll(".scroller");
    if (
      scrollers &&
      scrollers.length > 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      addAnimation(scrollers);
    }
  }, []);

  function addAnimation(scrollers: NodeListOf<Element>) {
    scrollers.forEach((scroller) => {
      scroller.setAttribute("data-animated", "true");
      const scrollerInner = scroller.querySelector(
        ".scroller__inner"
      ) as HTMLElement;
      const scrollerContent = Array.from(
        scrollerInner.children
      ) as HTMLElement[];

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true) as HTMLElement;
        duplicatedItem.setAttribute("aria-hidden", "true");
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }

  const displayGenres = useMemo(() => {
    if (!genres?.length) return [];
    const wantedKeys = PREFERRED_GENRES.map(keyOf);
    const normalized = genres.map((g: any) => ({
      ...g,
      _key: keyOf(g.fields?.name || ""),
    }));

    const preferred = wantedKeys
      .map((k) => normalized.find((g: any) => g._key === k))
      .filter(Boolean) as any[];

    const remaining = normalized
      .filter((g: any) => !wantedKeys.includes(g._key))
      .sort((a: any, b: any) =>
        (a.fields?.name || "").localeCompare(b.fields?.name || "", "hr-HR", {
          sensitivity: "base",
        })
      );

    return [...preferred, ...remaining].slice(0, 8);
  }, [genres]);

  return (
    <main
      ref={scrollersRef}
      className="flex items-center min-h-screen flex-col md:px-20 pt-10 md:p-10 p-5"
    >
     {/* HERO SEKCIJA */}
      <div className="w-full max-w-screen-2xl rounded-xl overflow-hidden bg-gradient-to-tl from-[#f2cab3]/30 to-[#fff]/5 shadow mb-8 p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 pr-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-dark mb-2 leading-tight">
            <span className="block">Welcome to</span>
            <span className="block text-neutral">NextReads</span>
          </h1>

          <p className="text-lg md:text-xl text-neutral-dark mb-6">
            Discover your next favorite book.
            <br />
            Dive into curated selections, trending genres, and beloved authors.
          </p>
      
        </div>
        <div className="hidden md:flex self-end justify-end pl-4 max-w-[300px]">
          <img
            src="/assets/undraw_bookshelves_2.svg"
            alt=""
            className="w-full h-auto object-contain opacity-80"
            draggable={false}
          />
        </div>
      </div>

      {/* SCROLLER */}
      <div className="w-full max-w-screen-2xl0">
        <p className="text-3xl text-neutral-dark tracking-tight text-left my-6">
          Top Books this week
        </p>
        <div
          className="scroller mx-4 sm:mx-6 lg:mx-8"
          data-direction="left"
          data-speed="slow"
        >
          <div className="scroller__inner mb-8 flex space-x-4">
            {books.length > 0 ? (
              books.map((book, idx) => {
                const coverUrl =
                  book.fields?.coverImage?.fields?.file?.url
                    ? `https:${book.fields.coverImage.fields.file.url}`
                    : "/assets/book-placeholder.png";
                return (
                  <Link key={idx} href={`/books/${book.sys?.id || ""}`}>
                    <img
                      src={coverUrl}
                      alt={book.fields?.title || "Book cover"}
                      onError={(e) =>
                        (e.currentTarget.src = "/assets/book-placeholder.png")
                      }
                      className="w-24 h-36 object-cover rounded-lg shadow-md transition-transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
                      draggable={false}
                    />
                  </Link>
                );
              })
            ) : (
              <p className="text-neutral italic">Loading books...</p>
            )}
          </div>
        </div>
      </div>

      {/* GENRES */}
      <div className="w-full max-w-screen-2xl py-2 my-2">
        <p className="text-3xl text-neutral-dark tracking-tight text-left mb-8">
          Browse books by your favourite genre
        </p>

        {loading ? (
          <div className="text-neutral italic">Loading genres...</div>
        ) : error ? (
          <div className="text-secondary">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {displayGenres.map((genre: any, index: number) => {
                const genreCover =
                  genre.fields?.coverImage?.fields?.file?.url
                    ? `https:${genre.fields.coverImage.fields.file.url}`
                    : "/assets/genre-placeholder.png";
                return (
                  <Link key={index} href={`/genres/${genre.fields?.name || ""}`}>
                    <div className="bg-white p-4 rounded-lg shadow-md text-center cursor-pointer flex flex-col items-center hover:shadow-lg hover:scale-105 transition group">
                      <img
                        src={genreCover}
                        alt={genre.fields?.name || "Genre cover"}
                        onError={(e) =>
                          (e.currentTarget.src = "/assets/genre-placeholder.png")
                        }
                        className="w-14 h-14 mb-2 object-contain select-none"
                        loading="lazy"
                      />
                      <span className="hover:text-neutral text-neutral-dark font-semibold text-md sm:text-lg tracking-wide">
                        {genre.fields?.name || "Unknown Genre"}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="flex justify-end items-center mt-4 mr-2">
              <Link
                href="/genres"
                className="flex items-center text-lg text-neutral-dark hover:text-neutral hover:underline font-semibold"
              >
                View All Genres
                <span className="ml-1 text-lg leading-none">→</span>
              </Link>
            </div>
          </>
        )}
      </div>
      
    </main>
  );
};

export default HomePage;
