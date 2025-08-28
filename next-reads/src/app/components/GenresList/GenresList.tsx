"use client";
import React from "react";
import Link from "next/link";

type Genre = {
  sys: { id: string };
  fields: { name: string };
};

type GenresListProps = {
  genres: Genre[];
};

const GenresList: React.FC<GenresListProps> = ({ genres }) => {
  return (
    <div className="bg-gray-100 p-10 rounded-lg shadow-md border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        All Genres
      </h2>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
        {genres.map((genre, index) => (
          <li key={`${genre.sys.id}-${index}`} className="border-b pb-2">
            <Link
              href={`/genres/${genre.fields.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              <span className="text-gray-800 hover:text-blue-500 transition">
                {genre.fields.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenresList;
