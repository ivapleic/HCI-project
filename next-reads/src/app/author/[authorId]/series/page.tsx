"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSeriesByAuthorId, getAuthorById } from "../../_lib/AuthorApi";
import Link from "next/link";
import Pagination from "../../../components/Pagination/Pagination";

// Helper function to get image URL with fallback
const getImageUrl = (url?: string): string => {
  if (!url) return "/assets/book-placeholder.png";
  return url.startsWith("//") ? `https:${url}` : url;
};

const AuthorSeriesPage = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState<any>(null);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorData, seriesData] = await Promise.all([
          getAuthorById(authorId as string),
          getSeriesByAuthorId(authorId as string),
        ]);

        setAuthor(authorData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching author series data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!author)
    return <div className="text-center text-red-500">Author not found</div>;

  const { fields } = author;

  const indexOfLastSerie = currentPage * seriesPerPage;
  const indexOfFirstSerie = indexOfLastSerie - seriesPerPage;
  const currentSeries = series.slice(indexOfFirstSerie, indexOfLastSerie);
  const totalPages = Math.ceil(series.length / seriesPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="sm:bg-white sm:rounded-2xl sm:shadow-lg p-6">

        {/* Breadcrumb Navigation */}
        <div className="mb-6 text-md text-neutral flex flex-wrap gap-2">
          <Link
            href={`/author/${authorId}`}
            className="hover:underline text-neutral-dark"
          >
            {fields.fullName}
          </Link>
          <span className="text-neutral">{">"}</span>
          <span className="text-neutral-dark font-medium">Series</span>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-neutral-dark">
          Series by {fields.fullName}
        </h2>

        {series.length === 0 ? (
          <div className="text-sm text-neutral-dark">
            No series available for this author.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentSeries.map((serie) => (
              <Link
                key={serie.sys.id}
                href={`/series/${serie.sys.id}`}
                className="group"
              >
                <div className="w-full bg-white rounded-xl shadow-md p-4 flex flex-col items-center transition hover:shadow-lg">
                  <div className="flex gap-2 mb-2 justify-center max-w-[180px]">
                    {serie.fields.books?.length > 0 ? (
                      serie.fields.books
                        .slice(0, 3)
                        .map((b: any, idx: number) => (
                          <img
                            key={idx}
                            src={getImageUrl(
                              b.fields.coverImage?.fields.file.url
                            )}
                            alt={b.fields.title || "Book cover"}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/assets/book-placeholder.png";
                            }}
                            className="object-cover rounded-md shadow-md w-16 h-24 sm:w-20 sm:h-28"
                          />
                        ))
                    ) : (
                      <p className="text-sm text-neutral">No books available</p>
                    )}
                  </div>
                  <h3 className="text-center text-base sm:text-[15px] font-bold text-neutral-dark mt-1 group-hover:text-neutral transition-colors duration-200 line-clamp-2">
                    {serie.fields.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination
          totalItems={series.length}
          itemsPerPage={seriesPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AuthorSeriesPage;
