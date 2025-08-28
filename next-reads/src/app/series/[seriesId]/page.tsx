"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSeriesList } from "../_lib/SeriesApi";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import BookCard from "../../components/BookCard/BookCard";

const SeriesPage = () => {
  const { seriesId } = useParams();

  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [currentSeries, setCurrentSeries] = useState<any>(null);
   const [tags, setTags] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const allSeries = await getSeriesList();
        setSeriesList(allSeries);

        if (seriesId) {
          const found = allSeries.find((s) => s.sys.id === seriesId);
          setCurrentSeries(found || null);
        } else {
          setCurrentSeries(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [seriesId]);

  const displayedSeries = seriesId ? (currentSeries ? [currentSeries] : []) : seriesList;
  const totalPages = Math.ceil(displayedSeries.length / itemsPerPage);
  const pagedSeries = displayedSeries.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return <div className="text-center">Loading list...</div>;
  }

  return (
    <div className="w-full my-4 px-4 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Glavni sadržaj */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border">
          {seriesId && currentSeries && (
            <>
              {/* Detalji serijala */}
              <h1 className="text-2xl mb-1 font-semibold text-[#593E64]">{currentSeries.fields.title}</h1>

              {currentSeries.fields.description && (
                <div className="prose max-w-none mb-10">
                  {documentToReactComponents(currentSeries.fields.description)}
                </div>
              )}

              {/* Knjige u serijalu s BookCard komponentom */}
              <div className="space-y-6">
                {currentSeries.fields.books?.map((book: any) => (
                  <BookCard
                    key={book.sys.id}
                    book={{
                      id: book.sys.id,
                      title: book.fields.title,
                      coverImageUrl: book.fields.coverImage?.fields.file.url,
                      authorName: book.fields.author?.fields?.fullName,
                      authorId: book.fields.author?.sys.id,
                      description: book.fields.description,
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {!seriesId && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pagedSeries.length > 0 ? (
                  pagedSeries.map((seriesItem) => (
                    <div
                      key={seriesItem.sys.id}
                      className="bg-white rounded-lg shadow-sm p-3 border border-gray-200 flex flex-col items-start"
                    >
                      <Link href={`/series/${seriesItem.sys.id}`} className="w-full">
                        {seriesItem.fields.books && seriesItem.fields.books.length > 0 ? (
                          <div className="grid grid-cols-4 gap-1 w-full mb-2">
                            {seriesItem.fields.books.slice(0, 4).map((book: any, idx: number) => (
                              <div key={idx} className="relative">
                                <img
                                  src={book.fields.coverImage?.fields.file.url}
                                  alt={book.fields.title}
                                  className="object-cover rounded-md shadow-md w-full h-20"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm opacity-60 text-center col-span-4">No books available</p>
                        )}
                        <h3 className="text-sm sm:text-base font-bold text-[#593E64] hover:text-[#8B6E54] transition-colors">
                          {seriesItem.fields.title}
                        </h3>
                      </Link>
                      {seriesItem.fields.author?.fields?.fullName ? (
                        <Link
                          href={`/author/${seriesItem.fields.author.sys.id}`}
                          className="text-xs text-gray-700 hover:underline"
                        >
                          by {seriesItem.fields.author.fields.fullName}
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-700">by Unknown Author</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No series found.</p>
                )}
              </div>

              {pagedSeries.length > itemsPerPage && (
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-md ${
                      page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#593E64] text-white hover:bg-[#8B6E54]"
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-semibold flex items-center justify-center">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#593E64] text-white hover:bg-[#8B6E54]"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar za tagove */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md border">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#593E64] mb-4">Browse by Tags</h2>
          <ul className="grid grid-cols-2 gap-4">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <li key={tag.sys.id} className="border-b border-gray-300 pb-2">
                  <Link href={`/tags/${tag.fields.tagName.toLowerCase()}`}>
                    <span className="text-[#593E64] hover:text-[#8B6E54] transition-colors">{tag.fields.tagName}</span>
                  </Link>
                </li>
              ))
            ) : (
              <p>No tags available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;
