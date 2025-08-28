"use client";
import Link from "next/link";
import GenresList from "../../components/GenresList/GenresList";
import { useEffect, useState } from "react";
import { getGenreList } from "../_lib/genresApi";

export default function NotFoundPage() {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getGenreList();
        setGenres(genreData);
      } catch (error) {
        setGenres([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="w-full px-4 md:px-20 mx-0 my-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Lijevi blok: Not found poruka */}
        <div className="relative md:col-span-2 flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md border p-8">
          <Link
            href="/genres"
            className="absolute top-8 left-8 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to Genres
          </Link>
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-4xl font-bold text-[#593E2E] mb-4 mt-8">
              Genre Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The genre you searched for does not exist in our library.
            </p>
          </div>
        </div>

        {/* Desni blok: Lista žanrova */}
        <div>
          {loading ? (
            <div className="text-center text-lg">Loading genres...</div>
          ) : (
            <GenresList genres={genres} />
          )}
        </div>
      </div>
    </div>
  );
}
