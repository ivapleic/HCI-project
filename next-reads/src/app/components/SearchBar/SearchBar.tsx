"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  searchBooksAuthorsSeriesLists,
  SearchResultItem,
  AuthorSearchResultItem,
  BookSearchResultItem,
} from "../../search/_lib/SearchApi";
interface SearchBarProps {
  className?: string;
}

const PLACEHOLDER_IMG = "/placeholder_book.png";
const DROPDOWN_LIMIT = 4; // <-- prikazujemo samo 4 rezultata u dropdownu

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  async function fetchSearchResults(q: string) {
    if (q.trim() === "") {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setResults([]);
    setShowDropdown(true);

    try {
      const data = await searchBooksAuthorsSeriesLists(q, 10); // dohvatimo više za "Show all"
      setResults(data);
      setShowDropdown(true);
    } catch {
      setResults([]);
      setShowDropdown(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchSearchResults(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

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

  function handleSearch() {
    if (!query.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <input
        type="text"
        value={query}
        placeholder="Search books or authors..."
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
        className="w-full rounded-lg border border-white bg-[#F9F3EE] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#593E2E] hover:border-[#593E2E]"
        aria-label="Search books or authors"
      />
      <button
        onClick={handleSearch}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 p-1 rounded cursor-pointer hover:text-[#593E2E] hover:border hover:border-[#593E2E] transition-colors"
        aria-label="Search"
        type="button"
      >
        <img
          src="/assets/icons8-search-30.png"
          alt="Search"
          width={24}
          height={24}
          draggable={false}
          className="w-6 h-6"
        />
      </button>

      {showDropdown && query.trim() && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-80 overflow-auto p-0">
          {loading && (
            <li className="p-2 text-center text-gray-500">Loading...</li>
          )}
          {!loading && results.length === 0 && (
            <li className="p-2 text-center text-gray-500">No results found</li>
          )}
          {!loading &&
            results.slice(0, DROPDOWN_LIMIT).map((item) => {
              const imgSrc =
                item.type === "book"
                  ? (item as BookSearchResultItem).imageUrl || PLACEHOLDER_IMG
                  : item.type === "author"
                  ? (item as AuthorSearchResultItem).profileImageUrl ||
                    PLACEHOLDER_IMG
                  : PLACEHOLDER_IMG;

              return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#faf3ec] cursor-pointer border-b last:border-none border-gray-100 transition"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 w-full"
                    onClick={() => setShowDropdown(false)}
                  >
                    <img
                      src={imgSrc}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded shadow"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#593E2E]">
                        {item.title}
                      </span>
                      {"authorName" in item && item.authorName && (
                        <span className="text-sm text-gray-600">
                          by {item.authorName}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          {!loading && results.length > DROPDOWN_LIMIT && (
            <li
              className="text-center p-2 bg-white text-[#593E2E] font-semibold cursor-pointer border-t border-gray-200 hover:bg-[#fbeee4] transition"
              onMouseDown={() => {
                setShowDropdown(false);
                handleSearch();
              }}
            >
              Show all results for "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
