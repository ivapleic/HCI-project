"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBookById, getSeriesByBookId } from "../_lib/booksApi";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Link from "next/link";
import CategoryDropdown from "../../components/CategoryDropdown/CategoryDropdown";

// Helper function to get cover URL with fallback
const getCoverUrl = (book: any): string => {
  if (book?.fields?.coverImage?.fields?.file?.url) {
    return `https:${book.fields.coverImage.fields.file.url}`;
  }
  return "/assets/book-placeholder.png";
};

const BookDetailPage = () => {
  const { bookId } = useParams();
  const validBookId = typeof bookId === "string" ? bookId : "";
  const [book, setBook] = useState<any>(null);
  const [series, setSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookData, seriesData] = await Promise.all([
          getBookById(validBookId),
          getSeriesByBookId(validBookId),
        ]);

        setBook(bookData);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching book data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (validBookId) {
      fetchData();
    }
  }, [validBookId]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (!book)
    return <div className="text-center text-red-500">Book not found</div>;

  const { fields } = book;
  const coverUrl = getCoverUrl(book);

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => {
          const full = i < Math.floor(rating);
          const half = i + 0.5 === rating;
          return (
            <span
              key={i}
              className={`text-2xl md:text-3xl ${
                full || half ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              {full ? "★" : half ? "★" : "☆"}
            </span>
          );
        })}
        <span className="ml-2 text-lg md:text-xl text-neutral">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderBookDetails = () => {
    const details = [];
    if (fields.isbn) details.push({ label: "ISBN", value: fields.isbn });
    if (fields.publicationYear)
      details.push({
        label: "Publication Year",
        value: fields.publicationYear,
      });
    if (fields.language)
      details.push({ label: "Language", value: fields.language });

    return (
      <ul className="list-disc list-inside text-sm space-y-2 mt-2 text-neutral-dark">
        {details.map((detail, index) => (
          <li key={index}>
            <strong>{detail.label}:</strong> {detail.value}
          </li>
        ))}
      </ul>
    );
  };

  const renderDescription = () => {
    if (!fields.description) {
      return (
        <div className="mt-2">
          {" "}
          // Promijenjeno sa mt-4 na mt-2
          <p className="text-sm md:text-base text-neutral italic">
            {" "}
            // Promijenjeno veličina fonta No description available.
          </p>
        </div>
      );
    }

    const hasLongDesc =
      typeof fields.description === "string" && fields.description.length > 200;

    return (
      <div className="mt-2">
        {typeof fields.description === "string" ? (
          <>
            <p
              id={`desc-${book.sys.id}`}
              className={`text-sm md:text-base text-neutral-dark leading-snug whitespace-pre-line transition-all duration-200 ease-in-out ${
                !showDescription && hasLongDesc ? "line-clamp-10" : ""
              }`}
            >
              {fields.description}
            </p>

            {hasLongDesc && (
              <button
                type="button"
                onClick={() => setShowDescription(!showDescription)}
                className="show-more-btn self-start rounded p-2 border hover:bg-neutral-light border-neutral-light mt-1 text-[11px] md:text-xs text-neutral-dark hover:text-neutral"
                aria-expanded={showDescription}
                aria-controls={`desc-${book.sys.id}`}
              >
                {showDescription ? "Show less ▲" : "Show more ▾"}
              </button>
            )}
          </>
        ) : (
          <div
            id={`desc-${book.sys.id}`}
            className={`text-sm md:text-base text-neutral-dark leading-snug transition-all duration-200 ease-in-out ${
              !showDescription && hasLongDesc ? "line-clamp-2" : ""
            }`} // Promijenjeno veličina fonta
          >
            {documentToReactComponents(fields.description)}

            {hasLongDesc && (
              <button
                type="button"
                onClick={() => setShowDescription(!showDescription)}
                className="show-more-btn self-start rounded p-2 border hover:bg-neutral-light border-neutral-light mt-1 text-[11px] md:text-xs text-neutral-dark hover:text-neutral"
                aria-expanded={showDescription}
                aria-controls={`desc-${book.sys.id}`}
              >
                {showDescription ? "Show less ▲" : "Show more ▾"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px]">
      {/* MOBILE LAYOUT */}
      <div className="block md:hidden max-w-md mx-auto my-0 p-4 px-6 ">
        <div className="flex flex-col items-center mt-10">
          <img
            src={coverUrl}
            alt={fields.title}
            onError={(e) => {
              e.currentTarget.src = "/assets/book-placeholder.png";
            }}
            className="w-48 h-64 object-cover rounded shadow mb-4"
          />

          {/* Series info */}
          {series && series.fields?.title && (
            <div className="mb-2 w-full text-center">
              <Link
                href={`/series/${series.sys.id}`}
                className="italic text-sm text-neutral-dark hover:underline"
              >
                {series.fields.title}
              </Link>
            </div>
          )}
          {!series && fields.seriesTitle && (
            <div className="italic text-sm text-neutral mb-2 w-full text-center">
              {fields.seriesTitle}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-1 w-full text-center text-neutral-dark">
            {fields.title}
          </h1>

          <div className="mb-2 w-full text-center">
            <Link
              href={`/author/${fields.author.sys.id}`}
              className="hover:underline text-neutral-dark"
            >
              {fields.author?.fields.fullName}
            </Link>
          </div>

          {fields.rating && renderRating(fields.rating)}

          {/* CategoryDropdown with enhanced styling */}
          {validBookId && (
            <div className="my-6 w-full flex justify-center">
              <CategoryDropdown bookId={validBookId} variant="full" />
            </div>
          )}

          {renderDescription()}

          {/* Genres */}
          <div className="mt-10 w-full">
            <h2 className="font-semibold text-left text-neutral">Genres</h2>
            <div className="flex gap-2 flex-wrap mt-2">
              {fields.genre?.map((genre: any) => (
                <Link
                  key={genre.sys.id}
                  href={`/genres/${genre.fields.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="bg-whitek text-neutral-dark py-1 px-3 rounded-full text-xs"
                >
                  {genre.fields.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Book Details */}
          <div className="mt-5 border-t border-neutral-light pt-6 w-full">
            <h2 className="font-semibold text-left text-neutral">
              Book Details
            </h2>
            {renderBookDetails()}
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="my-5 sm:mb-15 hidden md:block max-w-4xl mx-auto sm:bg-white rounded-lg shadow-md px-8 py-10">
        <div className="flex gap-8">
          <div className="w-1/4 flex flex-col items-start">
            <div className="w-[180px]">
              <img
                src={coverUrl}
                alt={fields.title}
                onError={(e) => {
                  e.currentTarget.src = "/assets/book-placeholder.png";
                }}
                className="rounded object-contain w-full max-h-[300px] shadow-md"
              />

              {/* Enhanced CategoryDropdown */}
              {validBookId && (
                <CategoryDropdown bookId={validBookId} variant="full" />
              )}
            </div>
          </div>

          {/* Info i detajli */}
          <div className="w-3/4 flex flex-col">
            {/* Serija */}
            {series && series.fields?.title && (
              <div className="mb-2">
                <Link
                  href={`/series/${series.sys.id}`}
                  className="italic text-base text-neutral-dark hover:underline"
                >
                  {series.fields.title}
                </Link>
              </div>
            )}

            {/* Naslov */}
            <h2 className="text-3xl font-bold mb-4 text-neutral-dark">
              {fields.title}
            </h2>

            {/* Autor */}
            <div className="mb-2">
              <Link
                href={`/author/${fields.author?.sys?.id}`}
                className="text-neutral-dark hover:underline text-lg"
              >
                {fields.author?.fields?.fullName}
              </Link>
            </div>

            {/* Rating */}
            {fields.rating && (
              <div className="mb-6">{renderRating(fields.rating)}</div>
            )}

            {/* Opis */}
            <div className="mb-6">{renderDescription()}</div>

            {/* Genres */}
          <div className="mt-10 w-full">
            <h2 className="font-semibold text-left text-neutral">Genres</h2>
            <div className="flex gap-2 flex-wrap mt-2">
              {fields.genre?.map((genre: any) => (
                <Link
                  key={genre.sys.id}
                  href={`/genres/${genre.fields.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="bg-neutral-light hover:bg-accent-pink text-neutral-dark py-1 px-3 rounded-full text-xs"
                >
                  {genre.fields.name}
                </Link>
              ))}
            </div>
          </div>


            {/* Book Details */}
            <div className="mt-6 border-t border-neutral-light pt-6">
              <h2 className="font-semibold text-left mb-3 text-neutral">
                Book Details
              </h2>
              {renderBookDetails()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
