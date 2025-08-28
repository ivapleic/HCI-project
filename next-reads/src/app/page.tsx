"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getGenreList } from "../lib/api";
import { getAllBooks } from "./books/_lib/booksApi";

// Dopuni ovo mapiranje prema svojim žanrovima!
const GENRE_ICONS: Record<string, string> = {
  "Science Fiction": "🚀",
  Cookbooks: "👨‍🍳",
  "Self Help": "🌱",
  Psychology: "🧠",
  Business: "💼",
  History: "🏺",
  Thriller: "🔪",
  Mystery: "🕵️",
  // fallback za ostale
  default: "📚",
};

const HomePage = () => {
  const scrollersRef = useRef<HTMLElement | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<any[]>([]);

  const fetchGenres = async () => {
    try {
      const data = await getGenreList();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const fetchedBooks = await getAllBooks();
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
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

  return (
    <main
      ref={scrollersRef}
      className="flex items-center min-h-screen flex-col px-6 md:p-10 bg-[#F2F2F2]"
    >
      {/* HERO SEKCIJA */}
      <div className="w-full max-w-screen-2xl rounded-xl overflow-hidden bg-gradient-to-tl from-[#f2cab3]/30 to-[#fff]/5 shadow mb-8 p-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex-1 pr-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#593E2E] mb-2 leading-tight">
            <span className="block">Welcome to</span>
            <span className="block text-[#8C6954]">NextReads</span>
          </h1>

          <p className="text-lg md:text-xl text-[#684536] mb-6">
            Discover your next favorite book.
            <br />
            Dive into curated selections, trending genres, and beloved authors.
          </p>
          {/* <Link href="/browse">
            <button className="bg-[#593E2E] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#8C6954] hover:scale-105 transition">
              Start Browsing →
            </button>
          </Link> */}
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

      {/* Books Scroller */}
      <div className="top-books-scroller w-full max-w-screen-2xl border-b-[0.5px] border-[#F2CAB3]">
        <p className="text-3xl text-[#593E2E] tracking-tight text-left my-6">
          Top Books this week
        </p>
        <div
          className="scroller mx-4 sm:mx-6 lg:mx-8"
          data-direction="left"
          data-speed="slow"
        >
          <div className="scroller__inner mb-8 flex space-x-4">
            {books.length > 0 ? (
              books.map((book, idx) => (
                <img
                  key={idx}
                  src={`https:${book.fields.coverImage.fields.file.url}`}
                  alt={book.fields.title}
                  className="w-24 h-36 object-cover rounded-lg shadow-md transition-transform hover:-translate-y-2 hover:scale-105 hover:shadow-xl"
                  draggable={false}
                />
              ))
            ) : (
              <p>Loading books...</p>
            )}
          </div>
        </div>
      </div>

      {/* Genre list */}
      <div className="w-full max-w-screen-2xl py-6 my-6 border-b-[0.5px] border-[#F2CAB3]">
        <p className="text-3xl text-[#593E2E] tracking-tight text-left mb-8">
          Browse books by your favourite genre
        </p>

        {loading ? (
          <div>Loading genres...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {genres.slice(0, 8).map((genre: any, index: number) => (
                <Link key={index} href={`/genres/${genre.fields.name}`}>
                  <div className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer flex flex-col items-center hover:shadow-lg hover:scale-105 transition group">
                    {genre.fields.coverImage?.fields?.file?.url ? (
                      <img
                        src={`https:${genre.fields.coverImage.fields.file.url}`}
                        alt={genre.fields.name}
                        className="w-14 h-14 mb-2 object-contain select-none"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-3xl mb-2 select-none">
                        {GENRE_ICONS[genre.fields.name] || GENRE_ICONS.default}
                      </span>
                    )}
                    <span className="group-hover:text-[#8C6954] font-semibold text-lg tracking-wide">
                      {genre.fields.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Genres aligned to the right */}
            <div className="flex justify-end items-center mt-4 mr-2">
              <Link
                href="/genres"
                className="flex items-center text-lg text-[#593E2E] hover:underline font-semibold"
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
