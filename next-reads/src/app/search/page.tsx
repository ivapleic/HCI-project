"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import BookCard from "../components/BookCard/BookCard";
import AuthorCard from "../components/AuthorCard/AuthorCard";
import Pagination from "../components/Pagination/Pagination"; // tvoja Pagination komponenta
import { searchBooksAuthorsSeriesLists, SearchResultItem } from "./_lib/SearchApi";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setResults([]);
        setCurrentPage(1);
        return;
      }
      setLoading(true);
      const r = await searchBooksAuthorsSeriesLists(query, 100);
      setResults(r);
      setLoading(false);
      setCurrentPage(1);
    }
    fetchResults();
  }, [query]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg my-8">
      <SearchBar className="mb-6" />

      {loading && <p>Loading results...</p>}
      {!loading && results.length === 0 && <p>No results found for “{query}”</p>}

      <ul className="space-y-4">
        {currentResults.map((item) => (
          <li key={item.id}>
            {item.type === "book" ? (
              <BookCard
                book={{
                  id: item.id,
                  title: item.title,
                  coverImageUrl: (item as any).imageUrl,
                  authorName: item.authorName,
                  authorId: (item as any).authorId,
                  description: (item as any).description,
                }}
              />
            ) : item.type === "author" ? (
              <AuthorCard
                author={{
                  id: item.id,
                  fullName: item.title,
                  profileImageUrl: (item as any).profileImageUrl,
                  bio: (item as any).description,
                }}
              />
            ) : null}
          </li>
        ))}
      </ul>

      <Pagination
        totalItems={results.length}
        itemsPerPage={resultsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
