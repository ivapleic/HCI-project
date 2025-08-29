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
   <div className="bg-gray-100 p-6 rounded-lg shadow-md border">
      <h2 className="text-xl text-[#593E2E] sm:text-2xl font-semibold mb-4">All Genres</h2>
      <ul className="grid grid-cols-2 gap-x-16 gap-y-4">
        {genres.map((genre, index) => (
          <li
            key={`${genre.sys.id}-${index}`}
           className="border-b border-white pb-2 text-[#593E2E]"
          >
            <Link
              href={`/genres/${genre.fields.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
                <span className="text-[#593E2E] hover:text-[#a3714b] transition whitespace-nowrap">
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
