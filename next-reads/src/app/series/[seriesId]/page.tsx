"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSeriesList } from "../_lib/SeriesApi";
import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import BookCard from "../../components/BookCard/BookCard";
import TagList from "../../components/TagsList/TagsList";
import { getAllTags } from "../../tags/_lib/TagsApi";
import Pagination from "../../components/Pagination/Pagination";

const SeriesPage = () => {
  const { seriesId } = useParams();

  const [currentSeries, setCurrentSeries] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state za knjige
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const allSeries = await getSeriesList();
        const allTags = await getAllTags();
        setTags(allTags);

        if (seriesId) {
          const found = allSeries.find((s) => s.sys.id === seriesId);
          setCurrentSeries(found || null);
          setPage(1); // resetiramo paginaciju knjiga kod promjene serijala
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [seriesId]);

  if (loading) {
    return <div className="text-center">Loading series...</div>;
  }

  if (!currentSeries) {
    return <div className="text-center">Series not found.</div>;
  }

  // Paginated books
  const pagedBooks = currentSeries.fields.books?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ) || [];

  const totalPages = Math.ceil(currentSeries.fields.books.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
      <div
      id="page-top"
      className="
        w-full
        mt-4
        mb-0
        sm:mb-8
        px-0
        md:px-20
        mx-0
        md:mx-auto
        md:max-w-[1200px]
        flex
        justify-center
      "
    >
      <div className="grid xs:grid-cols-1 xs:gap-5 md:grid-cols-3 md:gap-10 w-full max-w-[1200px] mx-auto">
        {/* Glavni sadržaj */}
        <div className="md:col-span-2 md:bg-white p-6 md:rounded-lg shadow-md">
          <h1 className="text-2xl mb-1 font-semibold text-[#593E64]">
            {currentSeries.fields.title}
          </h1>

          {currentSeries.fields.description && (
            <div className="prose max-w-none mb-10">
              {documentToReactComponents(currentSeries.fields.description)}
            </div>
          )}

          {/* PAGINIRANE KNJIGE */}
          <div className="space-y-6">
            {pagedBooks.map((book: any) => (
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

          {/* PAGINATION za knjige */}
          {currentSeries.fields.books.length > itemsPerPage && (
            <Pagination
              totalItems={currentSeries.fields.books.length}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Desni sidebar s tagovima */}
        <div>
          <TagList tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;
