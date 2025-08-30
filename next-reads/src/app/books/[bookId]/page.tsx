"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookById, getSeriesByBookId } from "../_lib/booksApi"; // importaj novu funkciju
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Link from "next/link";
import CategoryDropdown from "../../components/CategoryDropdown/CategoryDropdown";

const BookDetailPage = () => {
  const { bookId } = useParams();
  const validBookId = typeof bookId === "string" ? bookId : "";
  const [book, setBook] = useState<any>(null);
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  // State za dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const categories = [
    { id: "wantToRead", label: "Want to Read" },
    { id: "currentlyReading", label: "Currently Reading" },
    { id: "read", label: "Read" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const bookData = await getBookById(bookId as string);
      setBook(bookData);

      const seriesData = await getSeriesByBookId(bookId as string);
      setSeries(seriesData);

      setLoading(false);
    };

    fetchData();
  }, [bookId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (!book)
    return <div className="text-center text-red-500">Book not found</div>;

  const { fields } = book;

  return (
    <>
      {/* MOBILE LAYOUT — prikazuje se samo ispod sm (640px) */}
      <div className="block xs:bg-green-300 mt-10 md:hidden max-w-md mx-auto rounded-lg sm:bg-white shadow-md p-4">
        <div className="flex flex-col items-center mt-10">
          <img
            src={fields.coverImage?.fields.file.url}
            alt={fields.title}
            className="w-48 h-64 object-cover rounded shadow mb-4"
          />

          {/* Ako serija postoji, prikaži link */}
          {series && series.fields?.title && (
            <div className="mb-2 w-full text-center">
              <Link
                href={`/series/${series.sys.id}`}
                className="italic text-sm text-[#593E2E] hover:underline"
              >
                {series.fields.title}
              </Link>
            </div>
          )}
          {/* Ako serija nema, a postoji serija tekstualno */}
          {!series && fields.seriesTitle && (
            <div className="italic text-sm text-gray-600 mb-2 w-full text-center">
              {fields.seriesTitle}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-1 w-full text-center text-[#593E2E]">
            {fields.title}
          </h1>
          <div className="mb-2 w-full text-center">
            <Link
              href={`/author/${fields.author.sys.id}`}
              className="hover:underline"
            >
              {fields.author?.fields.fullName}
            </Link>
          </div>
          {fields.rating && (
            <div className="flex justify-center mb-6 w-full gap-1">
              {[...Array(5)].map((_, i) => {
                const full = i < Math.floor(fields.rating);
                const half = i + 0.5 === fields.rating;
                return (
                  <span
                    key={i}
                    className={`text-2xl ${
                      full || half ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    {full ? "★" : half ? "★" : "☆"}
                  </span>
                );
              })}
              <span className="ml-2 text-lg text-gray-700">
                {fields.rating.toFixed(2)}
              </span>
            </div>
          )}

          {/* CategoryDropdown ikona plus za mobitel */}
          {validBookId ? (
            <CategoryDropdown
              bookId={validBookId}
              variant="full"
              className="mb-6"
            />
          ) : (
            <div>Invalid Book ID</div>
          )}
        </div>

        <div className="w-full">
          <div
            className={`prose prose-sm max-w-none text-left ${
              !showDescription ? "line-clamp-4" : ""
            }`}
          >
            {fields.description
              ? typeof fields.description === "string"
                ? fields.description
                    .split(/\n+/)
                    .map((para: any, i: any) => <p key={i}>{para}</p>)
                : documentToReactComponents(fields.description)
              : "No description available."}
          </div>
          {!showDescription && (
            <button
              onClick={() => setShowDescription(true)}
              className="text-[#593E2E] underline mt-2"
            >
              Show more
            </button>
          )}
        </div>
        {/* Genres */}
        <div className="mt-10">
          <h2 className="font-semibold text-left">Genres</h2>
          <div className="flex gap-2 flex-wrap">
            {fields.genre?.map((genre: any) => (
              <Link
                key={genre.sys.id}
                href={`/genres/${genre.fields.name.toLowerCase()}`}
                className="bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded-full text-xs"
              >
                {genre.fields.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Book Details */}
        <div className="mt-10 border-t border-gray-300 pt-6">
          <h2 className="font-semibold text-left">Book Details</h2>
          <ul className="list-disc list-inside text-sm space-y-2 text-gray-800">
            {fields.isbn && (
              <li>
                <strong>ISBN:</strong> {fields.isbn}
              </li>
            )}
            {fields.publicationYear && (
              <li>
                <strong>Publication Year:</strong> {fields.publicationYear}
              </li>
            )}
            {fields.language && (
              <li>
                <strong>Language:</strong> {fields.language}
              </li>
            )}
            {fields.rating && (
              <li>
                <strong>Rating:</strong> {fields.rating.toFixed(1)}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* DESKTOP LAYOUT — prikazuje se od sm (640px) naviše */}
      <div className="hidden md:block  max-w-4xl mx-auto bg-white rounded-lg shadow-md px-8 py-10">
        <div className="flex gap-8">
          <div className="w-1/4 flex flex-col justify-start items-start">
            <img
              src={fields.coverImage?.fields?.file?.url}
              alt={fields.title}
              className="w-full rounded object-contain max-h-[400px]"
            />

            {/* Komponenta dropdowna ispod slike */}
            <>
              {validBookId ? (
                <CategoryDropdown bookId={validBookId} variant="full" />
              ) : (
                <div>Invalid Book ID</div>
              )}
              {/* ostali JSX */}
            </>
          </div>

          {/* Info i detajli */}
          <div className="w-3/4 flex flex-col">
            {/* Serija */}
            {series && series.fields?.title && (
              <div className="mb-2">
                <Link
                  href={`/series/${series.sys.id}`}
                  className="italic text-base text-[#593E2E] hover:underline"
                >
                  {series.fields.title}
                </Link>
              </div>
            )}

            {/* Naslov */}
            <h1 className="text-4xl font-bold mb-4 text-[#593E2E]">
              {fields.title}
            </h1>

            {/* Autor */}
            <div className="mb-4">
              <Link
                href={`/author/${fields.author?.sys?.id}`}
                className="text-black hover:underline text-lg"
              >
                {fields.author?.fields?.fullName}
              </Link>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-6 gap-2">
              {[...Array(5)].map((_, i) => {
                const full = i < (fields.rating ?? 0);
                const half = i + 0.5 === fields.rating;
                return (
                  <span
                    key={i}
                    className={`text-3xl ${
                      full || half ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    {full ? "★" : half ? "★" : "☆"}
                  </span>
                );
              })}
              <span className="text-xl text-gray-700">
                {(fields.rating ?? 0).toFixed(2)}
              </span>
            </div>

            {/* Opis */}
            <div className="prose prose-lg max-w-none text-left">
              {typeof fields.description === "string"
                ? fields.description
                    .split(/\n+/)
                    .map((para: any, i: any) => <p key={i}>{para}</p>)
                : fields.description
                ? documentToReactComponents(fields.description)
                : "No description available."}

              {!showDescription && (
                <button
                  onClick={() => setShowDescription(true)}
                  className="text-[#593E9E] underline mt-4 cursor-pointer"
                >
                  Show more
                </button>
              )}
            </div>

            {/* Genres */}
            <div className="mt-10">
              <h2 className="font-semibold text-left">Genres</h2>
              <div className="flex gap-2 flex-wrap">
                {fields.genre?.map((genre: any) => (
                  <Link
                    key={genre.sys.id}
                    href={`/genres/${genre.fields.name.toLowerCase()}`}
                    className="bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded-full text-xs"
                  >
                    {genre.fields.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Book Details */}
            <div className="mt-5 border-t border-gray-300 pt-6">
              <h2 className="font-semibold text-left">Book Details</h2>
              <ul className="list-disc list-inside text-sm space-y-2 text-gray-800">
                {fields.isbn && (
                  <li>
                    <strong>ISBN:</strong> {fields.isbn}
                  </li>
                )}
                {fields.publicationYear && (
                  <li>
                    <strong>Publication Year:</strong> {fields.publicationYear}
                  </li>
                )}
                {fields.language && (
                  <li>
                    <strong>Language:</strong> {fields.language}
                  </li>
                )}
                {fields.rating && (
                  <li>
                    <strong>Rating:</strong> {fields.rating.toFixed(1)}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetailPage;
