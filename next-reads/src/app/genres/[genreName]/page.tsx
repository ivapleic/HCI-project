"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getGenreList, getBooks } from "../_lib/genresApi";
import { getLists } from "../../lists/_lib/ListApi";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import GenresList from "../../components/GenresList/GenresList";

// Helper function to get cover URL with fallback
const getCoverUrl = (book: any): string => {
  if (book.fields?.coverImage?.fields?.file?.url) {
    return `https:${book.fields.coverImage.fields.file.url}`;
  }
  return "/assets/book-placeholder.png";
};

export default function GenrePage() {
  const params = useParams();
  const genreName = params?.genreName as string;

  const [genre, setGenre] = useState<any>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [filteredLists, setFilteredLists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [genres, setGenres] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [newReleases, setNewReleases] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [genresData, allBooks, listsData] = await Promise.all([
          getGenreList(),
          getBooks(),
          getLists()
        ]);

        setGenres(genresData || []);
        setLists(listsData);

        const normalizedGenreName = genreName.toLowerCase().replace(/-/g, " ");
        const genreData = genresData.find(
          (g: any) => g.fields.name.toLowerCase() === normalizedGenreName
        );

        if (!genreData) {
          return notFound();
        }

        setGenre(genreData);

        const genreBooks = allBooks.filter((book: any) =>
          book.fields.genre?.some((g: any) => g.sys.id === genreData.sys.id)
        );
        setBooks(genreBooks);

        const genreLists = listsData.filter((list: any) =>
          list.fields.genres?.some((g: any) => g.sys.id === genreData.sys.id)
        );
        setFilteredLists(genreLists);

        const currentYear = new Date().getFullYear();
        const recentBooks = genreBooks.filter((book: any) => {
          const publicationYear = parseInt(book.fields.publicationYear, 10);
          return publicationYear && publicationYear === currentYear;
        });
        setNewReleases(recentBooks.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreName]);

  if (!loading && !genre) {
    return notFound();
  }

  const name = genre?.fields?.name || "Unknown Genre";
  const description = genre?.fields?.description || "No description available.";

  // Filter books for current year or previous year if none found
  const currentYear = new Date().getFullYear();
  const displayBooks = books.filter(
    (book: any) => parseInt(book.fields.publicationYear, 10) === currentYear
  ).length > 0
    ? books.filter((book: any) => parseInt(book.fields.publicationYear, 10) === currentYear)
    : books.filter((book: any) => parseInt(book.fields.publicationYear, 10) === currentYear - 1);

  return (
    <div
      id="page-top"
      className="w-full mt-2 sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px] flex justify-center"
    >
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-5 justify-center mx-auto md:justify-normal w-full">
          <div className="md:col-span-2 bg-neutral-light sm:bg-white border-b border-neutral-light sm:border-none p-6 py-2 sm:rounded-lg sm:shadow-md">
         
            {/* Breadcrumb */}
            <div className="mb-4 sm:mt-4 text-neutral select-none flex flex-wrap gap-2">
              <Link
                href="/genres"
                className="font-medium text-neutral hover:text-neutral-dark hover:underline text-lg"
              >
                Genres
              </Link>
              <span className="text-neutral">{">"}</span>
              <Link
                href={`/genres/${genreName.toLowerCase()}`}
                className="font-medium text-neutral-dark hover:underline text-lg"
                aria-current="page"
                tabIndex={-1}
              >
                {name}
              </Link>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-left text-neutral-dark">
              {name}
            </h1>
            <p className="text-neutral-dark mb-6">{description}</p>

            {/* New Releases Section */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-neutral-dark cursor-pointer hover:underline">
                <Link href={`/new-releases?genre=${genreName}`}>
                  New Releases
                </Link>
              </h2>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 justify-start [justify-items:start] [align-items:start] text-left">
                {displayBooks.length > 0 ? (
                  <>
                    {displayBooks.slice(0, 3).map((book: any) => (
                      <Link
                        href={`/books/${book.sys.id}`}
                        key={book.sys.id}
                        className="block"
                      >
                        <img
                          src={getCoverUrl(book)}
                          alt={book.fields?.title || "Book cover"}
                          onError={(e) => {
                            e.currentTarget.src = "/assets/book-placeholder.png";
                          }}
                          className="block object-cover rounded-md aspect-[0.7] w-[90px] md:w-auto cursor-pointer hover:opacity-80 transition-opacity duration-300"
                        />
                      </Link>
                    ))}

                    {displayBooks.length > 10 && (
                      <div className="flex justify-end mt-2 col-span-3 md:col-span-5">
                        <Link
                          href={`/new-releases?genre=${genreName}`}
                          className="text-sm text-neutral-dark hover:underline flex items-center"
                        >
                          More new releases from this genre
                          <span className="ml-1 text-lg leading-none">→</span>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-neutral col-span-3 md:col-span-5">
                    No recent releases
                  </p>
                )}
              </div>
            </div>

            {/* Lists under this Genre */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-neutral-dark cursor-pointer hover:underline">
                <Link href={`/tags/${genreName.toLowerCase()}`}>
                  Lists with this genre
                </Link>
              </h2>

              {filteredLists.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {filteredLists.slice(0, 6).map((list: any) => (
                      <ItemGrid
                        key={list.sys.id}
                        items={[list]}
                        itemType="lists"
                        maxDisplay={1}
                        moreLink={`/tags/${genreName.toLowerCase()}`}
                        moreLabel="More lists with this genre"
                        title=""
                        columns={1}
                      />
                    ))}
                  </div>

                  {filteredLists.length > 6 && (
                    <div className="flex justify-end mt-2">
                      <Link
                        href={`/tags/${genreName.toLowerCase()}`}
                        className="text-sm text-neutral-dark hover:underline flex items-center"
                      >
                        More lists from this genre
                        <span className="ml-1 text-lg leading-none">→</span>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-neutral mt-2">
                  No lists available for this genre.
                </p>
              )}
            </div>

            {/* Books of Genre */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4 text-neutral-dark cursor-pointer hover:underline">
                <Link href={`/books?genre=${genreName}`}>
                  Books of this Genre
                </Link>
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-5 gap-4">
                {books.length > 0 ? (
                  <>
                    {books.slice(0, 15).map((book) => (
                      <Link href={`/books/${book.sys.id}`} key={book.sys.id}>
                        <img
                          src={getCoverUrl(book)}
                          alt={book.fields?.title || "Book cover"}
                          onError={(e) => {
                            e.currentTarget.src = "/assets/book-placeholder.png";
                          }}
                          className="object-cover rounded-md aspect-[0.7] w-[90px] md:w-auto cursor-pointer"
                        />
                      </Link>
                    ))}

                    {books.length > 15 && (
                      <div className="mt-2 col-span-4 md:col-span-5">
                        <div className="flex justify-end">
                          <Link
                            href={`/books?genre=${genreName}`}
                            className="text-sm text-neutral-dark hover:underline flex items-center"
                          >
                            More books from this genre
                            <span className="ml-1 text-lg leading-none">→</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-neutral">No books available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right div - genres list sidebar */}
          <div className="flex justify-center md:justify-start">
            <div className="w-full md:w-auto">
              <GenresList genres={genres} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}