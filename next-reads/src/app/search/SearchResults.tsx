"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import BookCard from "../components/BookCard/BookCard";
import AuthorCard from "../components/AuthorCard/AuthorCard";
import Pagination from "../components/Pagination/Pagination";
import { searchBooksAuthorsSeriesLists, SearchResultItem } from "./_lib/SearchApi";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;

  useEffect(() => {
    async function fetchResults() {
      if (!query.trim()) {
        setResults([]);
        setCurrentPage(1);
        setHasSearched(false);
        return;
      }
      
      setLoading(true);
      setHasSearched(true);
      
      try {
        const r = await searchBooksAuthorsSeriesLists(query, 100);
        setResults(r);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
      
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
    <div className="w-full mt-2 sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px]">
      <div className="sm:bg-neutral-white sm:rounded-2xl sm:shadow-lg p-6">
        <SearchBar className="mb-6" />

        <h2 className="text-xl sm:text-2xl md:text-3xl text-neutral-dark font-bold tracking-tight mb-6">
          Search Results for
          {query && <span className="text-neutral"> "{query}"</span>}
        </h2>

        {loading && (
          <div className="text-center py-8">
            <p className="text-neutral">Searching...</p>
          </div>
        )}
        
        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-dark">No results found for "{query}"</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-neutral mb-6">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            
            <ul className="space-y-6">
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
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;