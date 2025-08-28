"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBooksByAuthorId, getAuthorById } from "../../_lib/AuthorApi";
import BookCard from "../../../components/BookCard/BookCard";
import Pagination from "../../../components/Pagination/Pagination";

const AuthorBooksPage = () => {
  const rawAuthorId = useParams().authorId;
  const authorId = Array.isArray(rawAuthorId) ? rawAuthorId[0] : rawAuthorId;
  const [author, setAuthor] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const authorData = await getAuthorById(authorId as string);
      const booksData = await getBooksByAuthorId(authorId as string);

      setAuthor(authorData);
      setBooks(booksData);
      setLoading(false);
    };

    fetchData();
  }, [authorId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!author) return <div className="text-center text-red-500">Author not found</div>;

  const { fields } = author;

  // Books on current page
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">All Books by {fields.fullName}</h1>

        <div className="grid grid-cols-1 gap-6">
          {currentBooks.map((book) => (
            <BookCard
              key={book.sys.id}
              book={{
                id: book.sys.id,
                title: book.fields.title,
                coverImageUrl: book.fields.coverImage?.fields.file.url,
                authorName: fields.fullName,
                authorId: authorId,
                description: book.fields.description,
              }}
            />
          ))}
        </div>

        <Pagination
          totalItems={books.length}
          itemsPerPage={booksPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AuthorBooksPage;
