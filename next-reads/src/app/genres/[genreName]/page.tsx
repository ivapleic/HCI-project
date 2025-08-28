"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { getGenreList } from "../_lib/genresApi";
import { useState, useEffect } from "react";
import { getBooks } from "../_lib/genresApi";
import { getLists } from "../../lists/_lib/ListApi";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import GenresList from "../../components/GenresList/GenresList";

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
        const genresData = await getGenreList();
        setGenres(genresData || []);

        // Normalizacija za usporedbu
        const normalizedGenreName = genreName.toLowerCase().replace(/-/g, " ");

        const genreData = genresData.find(
          (g: any) => g.fields.name.toLowerCase() === normalizedGenreName
        );

        if (!genreData) {
          return notFound();
        }

        setGenre(genreData);

        const allBooks = await getBooks();
        const genreBooks = allBooks.filter((book: any) =>
          book.fields.genre?.some((g: any) => g.sys.id === genreData.sys.id)
        );
        setBooks(genreBooks);

        const listsData = await getLists();
        setLists(listsData);

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

  return (
    <div
      id="page-top"
      className="
        w-full
        mt-4
        mb-4
        px-0
        md:px-20
        mx-0
        md:mx-auto
        md:max-w-[1200px]
        flex
        justify-center
      "
    >
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center mx-auto md:justify-normal w-full">
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
              {/* Breadcrumb inside left div above heading */}
              <div className="mb-4 text-gray-600 text-sm select-none flex flex-wrap gap-2">
                <Link
                  href="/genres"
                  className="font-medium text-[#8C6954] hover:text-[#593e2e] hover:underline text-lg"
                >
                  Genres
                </Link>
                <span className="text-gray-400 text-lg">{">"}</span>
                <Link
                  href={`/genres/${genreName.toLowerCase()}`}
                  className="font-medium text-[#8C6954] hover:text-[#593e2e] hover:underline text-lg"
                  aria-current="page"
                  tabIndex={-1}
                >
                  {name}
                </Link>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-left text-[#593e2e]">
                {name}
              </h1>
              <p className="text-gray-700 mb-6">{description}</p>

              {/* New Releases Section */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[#593e2e] cursor-pointer">
                  <Link href={`/new-releases?genre=${genreName}`}>
                    New Releases
                  </Link>
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const prevYear = currentYear - 1;

                    const booksThisYear = books.filter(
                      (book: any) =>
                        parseInt(book.fields.publicationYear, 10) ===
                        currentYear
                    );
                    const displayBooks =
                      booksThisYear.length > 0
                        ? booksThisYear
                        : books.filter(
                            (book: any) =>
                              parseInt(book.fields.publicationYear, 10) ===
                              prevYear
                          );

                    return displayBooks.length > 0 ? (
                      <>
                        {displayBooks.slice(0, 3).map((book: any) => (
                          <Link
                            href={`/books/${book.sys.id}`}
                            key={book.sys.id}
                          >
                            <img
                              src={book.fields.coverImage.fields.file.url}
                              alt={book.fields.title}
                              className="object-cover rounded-md aspect-[0.7] w-[90px] md:w-auto cursor-pointer"
                            />
                          </Link>
                        ))}

                        {displayBooks.length > 10 && (
                          <div className="flex justify-end mt-2 col-span-3 md:col-span-5">
                            <Link
                              href={`/new-releases?genre=${genreName}`}
                              className="text-sm text-[#593E2E] hover:underline flex items-center"
                            >
                              More new releases from this genre
                              <span className="ml-1 text-lg leading-none">
                                →
                              </span>
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-center text-gray-600 col-span-3 md:col-span-5">
                        No recent releases
                      </p>
                    );
                  })()}
                </div>
              </div>

              {/* Lists under this Genre */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[#593e2e]">
                  <Link href={`/tags/${genreName.toLowerCase()}`}>
                    Lists with this genre
                  </Link>
                </h2>

                {filteredLists.length > 0 ? (
                  <>
                    <ItemGrid
                      items={filteredLists}
                      itemType="lists"
                      maxDisplay={6}
                      columns={2}
                      moreLink={`/tags/${genreName.toLowerCase()}`}
                      moreLabel="More lists with this genre"
                      title="" 
                    />
                    {filteredLists.length > 6 && (
                      <div className="flex justify-end mt-2">
                        <Link
                          href={`/tags/${genreName.toLowerCase()}`}
                          className="text-sm text-[#593E2E] hover:underline flex items-center"
                        >
                          More lists from this genre
                          <span className="ml-1 text-lg leading-none">→</span>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-600 mt-2">
                    No lists available for this genre.
                  </p>
                )}
              </div>

              {/* Books of Genre */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 text-[#593e2e]">
                  <Link href={`/books?genre=${genreName}`}>
                    Books of this Genre
                  </Link>
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {books.length > 0 ? (
                    <>
                      {books.slice(0, 15).map((book) => (
                        <Link href={`/books/${book.sys.id}`} key={book.sys.id}>
                          <img
                            src={book.fields.coverImage.fields.file.url}
                            alt={book.fields.title}
                            className="object-cover rounded-md aspect-[0.7] w-[90px] md:w-auto cursor-pointer"
                          />
                        </Link>
                      ))}

                      {books.length > 15 && (
                        <div className="flex justify-end mt-2 col-span-3 md:col-span-5">
                          <Link
                            href={`/books?genre=${genreName}`}
                            className="text-sm text-[#593E2E] hover:underline flex items-center"
                          >
                            More books from this genre
                            <span className="ml-1 text-lg leading-none">→</span>
                          </Link>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-600">No books available.</p>
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
        </>
      )}
    </div>
  );
}
