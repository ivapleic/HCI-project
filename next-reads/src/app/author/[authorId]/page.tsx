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

// Helper function to get image URL with fallback
const getImageUrl = (image: any): string => {
  if (image?.fields?.file?.url) {
    const url = image.fields.file.url;
    return url.startsWith("//") ? `https:${url}` : url;
  }
  return "/assets/author-placeholder.png";
};

const AuthorPage = () => {
  const rawAuthorId = useParams().authorId;
  const authorId = Array.isArray(rawAuthorId) ? rawAuthorId[0] : rawAuthorId;

  const [author, setAuthor] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMoreBio, setShowMoreBio] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchData = async () => {
      try {
        const [authorData, booksData, seriesData] = await Promise.all([
          getAuthorById(authorId as string),
          getBooksByAuthorId(authorId as string),
          getSeriesByAuthorId(authorId as string),
        ]);

        setAuthor(authorData);
        setBooks(booksData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorId]);

  if (!mounted) return null;
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!author)
    return <div className="text-center text-red-500">Author not found</div>;

  const { fields } = author;
  const imageUrl = getImageUrl(fields.profileImage);

  // Render bio with show more/less toggle
  const renderBio = () => {
    if (!fields.bio) return null;

    const hasLongBio = fields.bio.length > 180;

    return (
      <div className="mt-4">
        <p
          className={`text-sm text-neutral-dark leading-relaxed whitespace-pre-line ${
            !showMoreBio && hasLongBio ? "line-clamp-4" : ""
          }`}
        >
          {fields.bio}
        </p>

        {hasLongBio && (
          <button
            onClick={() => setShowMoreBio(!showMoreBio)}
            className="mt-2 text-sm text-neutral-dark hover:text-neutral"
          >
            {showMoreBio ? "Show less ▲" : "Show more ▾"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      id="page-top"
      className="w-full sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px] flex justify-center"
    >
      {/* MOBILE LAYOUT - Transparent background */}
      <div className="block sm:hidden max-w-md mb-0 p-6 my-2">
        <div className="flex flex-col items-center pt-4 mb-6">
          <img
            src={imageUrl}
            alt={fields.fullName}
            onError={(e) => {
              e.currentTarget.src = "/assets/author-placeholder.png";
            }}
            className="w-36 h-44 object-cover rounded-lg shadow mb-3"
          />
          <h1 className="text-3xl font-bold text-center text-neutral-dark">
            {fields.fullName}
          </h1>
          {renderBio()}
        </div>

        {/* Books */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-neutral-dark">
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
                className="text-sm text-neutral-dark hover:underline"
              >
                More books from {fields.fullName}
                <span className="ml-1 text-lg leading-none">→</span>
              </Link>
            </div>
          )}
        </div>

      {/* Series */}
<div className="mb-10">
  <h2 className="text-xl font-semibold mb-4 text-neutral-dark">
    <Link
      href={`/author/${authorId}/series`}
      className="hover:underline"
    >
      Series by {fields.fullName}
    </Link>
  </h2>
  <ItemGrid
    items={series}
    itemType="series"
    title=""
    maxDisplay={10}
    columns={2} // 👈 Dodano, sada 2 kolone na mobitelu
    moreLink={`/author/${authorId}/series`}
    moreLabel="More series by"
  />
</div>

      </div>

      {/* DESKTOP LAYOUT - White background */}
      <div className="hidden sm:block max-w-4xl mb-0 bg-white rounded-lg shadow-md px-8 py-10">
        <div className="flex flex-row gap-6 mb-10 items-start">
          <img
            src={imageUrl}
            alt={fields.fullName}
            onError={(e) => {
              e.currentTarget.src = "/assets/author-placeholder.png";
            }}
            className="w-40 h-52 object-cover rounded shadow shrink-0"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4 text-neutral-dark">
              {fields.fullName}
            </h1>
            {renderBio()}
          </div>
        </div>

        {/* Books */}
        <div className="mb-5">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-dark">
            <Link
              href={`/author/${authorId}/books`}
              className="hover:underline"
            >
              {fields.fullName}'s Books
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
                className="mt-4 inline-flex items-center text-sm text-neutral-dark hover:underline cursor-pointer"
              >
                More books from {fields.fullName}
                <span className="ml-1 text-lg leading-none">→</span>
              </Link>
            </div>
          )}
        </div>

        {/* Series */}
        <div className="max-w-4xl mx-auto py-4">
          <h2 className="text-2xl font-semibold text-neutral-dark mb-3">
            <Link
              href={`/author/${authorId}/series`}
              className="hover:underline"
            >
              Series by {fields.fullName}
            </Link>
          </h2>

          <ItemGrid
            items={series.slice(0, 6)}
            itemType="series"
            title=""
            maxDisplay={6}
            columns={3} // ➝ sad lijepo podijeli u 3 kolone
            moreLink={`/author/${authorId}/series`}
            moreLabel="More series by"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
