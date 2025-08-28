"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getBooksByAuthorId,
  getAuthorById,
  getSeriesByAuthorId,
} from "../_lib/AuthorApi";
import Link from "next/link";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import BookCard from "../../components/BookCard/BookCard";

const AuthorPage = () => {
  const rawAuthorId = useParams().authorId;
  const authorId = Array.isArray(rawAuthorId) ? rawAuthorId[0] : rawAuthorId;
  const [author, setAuthor] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMoreBio, setShowMoreBio] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const authorData = await getAuthorById(authorId as string);
      const booksData = await getBooksByAuthorId(authorId as string);
      const seriesData = await getSeriesByAuthorId(authorId as string);

      setAuthor(authorData);
      setBooks(booksData);
      setSeries(seriesData);
      setLoading(false);
    };

    fetchData();
  }, [authorId]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!author)
    return <div className="text-center text-red-500">Author not found</div>;

  const { fields } = author;
  const imageUrl = fields.profileImage?.fields.file?.url;
  const safeUrl = imageUrl?.startsWith("//") ? `https:${imageUrl}` : imageUrl;

  return (
    <>
      {/* MOBILE VERZIJA */}
      <div className="block md:hidden max-w-md mx-auto bg-white rounded-lg shadow-md p-6 my-8 border border-gray-200">
        {/* Slika i ime autora */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={safeUrl}
            alt={fields.fullName}
            className="w-36 h-44 object-cover rounded-lg shadow mb-3"
          />
          <h1 className="text-3xl font-bold text-center">{fields.fullName}</h1>
          <div
            className={`text-gray-800 text-sm mt-4 text-start ${
              showMoreBio ? "" : "line-clamp-5"
            }`}
          >
            {fields.bio}
          </div>
          {!showMoreBio && fields.bio && fields.bio.length > 180 && (
            <button
              onClick={() => setShowMoreBio(true)}
              className="mt-2 text-sm border px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Show more ▾
            </button>
          )}
        </div>

        {/* Knjige */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#593e2e]">
            <Link
              href={`/author/${authorId}/books`}
              className="hover:underline"
            >
              Books by {fields.fullName}
            </Link>
          </h2>
          <div className="flex flex-col space-y-6">
            {books.slice(0, 5).map((book) => (
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
          {books.length > 4 && (
            <div className="flex justify-end mt-4">
              <Link
                href={`/author/${authorId}/books`}
                className="text-sm text-[#593E2E] hover:underline"
              >
                More books from {fields.fullName}
                <span className="ml-1 text-lg leading-none">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Serije */}
        <ItemGrid
          items={series}
          itemType="series"
          title={`Series by ${fields.fullName}`}
          maxDisplay={10}
          moreLink={`/author/${authorId}/series`}
          moreLabel="More series by"
        />
      </div>

      {/* DESKTOP VERZIJA */}
      <div className="hidden md:block max-w-4xl mx-auto bg-white rounded-lg shadow-md px-8 py-10">
        {/* Slika i ime autora  */}
        <div className="flex flex-row gap-6 mb-10 items-start">
          <img
            src={safeUrl}
            alt={fields.fullName}
            className="w-40 h-52 object-cover rounded shadow shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{fields.fullName}</h1>
            <div
              className={`text-gray-800 text-sm ${
                showMoreBio ? "" : "line-clamp-4"
              }`}
            >
              {fields.bio}
            </div>
            {!showMoreBio && fields.bio && fields.bio.length > 180 && (
              <button
                onClick={() => setShowMoreBio(true)}
                className="mt-2 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                Show more ▾
              </button>
            )}
          </div>
        </div>

        {/* Knjige */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-[#593e2e]">
            <Link
              href={`/author/${authorId}/books`}
              className="hover:underline"
            >
              {fields.fullName}’s Books
            </Link>
          </h2>
          <div className="space-y-6">
            {books.slice(0, 5).map((book) => (
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
          {books.length > 4 && (
            <div className="flex justify-end mt-4">
              <Link
                href={`/author/${authorId}/books`}
                className="mt-4 inline-flex items-center text-sm text-[#593E2E] hover:underline cursor-pointer"
              >
                More books from {fields.fullName}
                <span className="ml-1 text-lg leading-none">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Naslov za serije */}
        <h2 className="text-2xl font-semibold mb-4 mt-10 text-[#593e2e] hover:underline">
          <Link href={`/author/${authorId}/series`}>
            Series by {fields.fullName}
          </Link>
        </h2>
        <ItemGrid
          items={series}
          itemType="series"
          title=""
          maxDisplay={6}
          moreLink={`/author/${authorId}/series`}
          moreLabel="More series by"
        />
      </div>
    </>
  );
};

export default AuthorPage;
