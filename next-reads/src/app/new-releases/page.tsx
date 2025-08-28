"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBooks, getGenreList } from "../genres/_lib/genresApi";
import GenresList from "../components/GenresList/GenresList";
import BookCard from "../components/BookCard/BookCard";
import Pagination from "../components/Pagination/Pagination";

export default function NewReleasesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const genreName = searchParams.get("genre") || "";
  const [genreId, setGenreId] = useState<string | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchGenreAndBooks = async () => {
      setLoading(true);
      try {
        const genresData = await getGenreList();
        setGenres(genresData || []);

        const genre = genresData.find(
          (g: any) => g.fields.name.toLowerCase() === genreName.toLowerCase()
        );

        if (!genre) {
          router.push("/genres");
          return;
        }

        setGenreId(genre.sys.id);

        const allBooks = await getBooks();

        const currentYear = new Date().getFullYear();
        const prevYear = currentYear - 1;

        const filteredBooks = allBooks.filter(
          (book: any) =>
            book.fields.genre?.some((g: any) => g.sys.id === genre.sys.id) &&
            (parseInt(book.fields.publicationYear, 10) === currentYear ||
              parseInt(book.fields.publicationYear, 10) === prevYear)
        );

        filteredBooks.sort((a, b) => {
          const yearB =
            typeof b.fields.publicationYear === "number" ? b.fields.publicationYear : 0;
          const yearA =
            typeof a.fields.publicationYear === "number" ? a.fields.publicationYear : 0;
          return yearB - yearA;
        });

        setBooks(filteredBooks);
        setPage(1);
      } catch (error) {
        console.error("Error fetching new releases or genres:", error);
        router.push("/genres");
      } finally {
        setLoading(false);
      }
    };

    if (genreName) {
      fetchGenreAndBooks();
    } else {
      router.push("/genres");
    }
  }, [genreName, router]);

  if (loading) return <div className="text-center mt-12">Loading...</div>;

  if (books.length === 0)
    return (
      <p className="text-gray-600 text-center mt-12">
        No recent releases available in this genre.
      </p>
    );

  // Izračun prikaza za trenutnu stranicu
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const displayedBooks = books.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="md:max-w-[1200px] md:mx-auto p-0 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-10">
        {/* Lijevi blok: New Releases lista */}
        <div className="w-full md:col-span-2 space-y-4 bg-white p-0 md:p-6 rounded-none md:rounded-lg shadow-none md:shadow-md border-none md:border mb-4">
          <h2 className="text-2xl font-bold mb-4 text-[#593e2e] px-4 md:px-0 pt-4 md:pt-0">
            New Releases
          </h2>
          {displayedBooks.map((book: any) => (
            <BookCard
              key={book.sys.id}
              book={{
                id: book.sys.id,
                title: book.fields.title,
                coverImageUrl: book.fields.coverImage?.fields.file.url,
                authorName: book.fields.author?.fields.fullName,
                authorId: book.fields.author?.sys.id,
                description: book.fields.description,
              }}
            />
          ))}
          <Pagination
            totalItems={books.length}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Desni blok */}
        <div className="flex justify-center md:justify-start mb-4">
          <div className="w-full md:w-auto">
            <GenresList genres={genres} />
          </div>
        </div>
      </div>
    </div>
  );
}
