"use client";
import React, { useMemo } from "react";
import Link from "next/link";

type Genre = {
  sys: { id: string };
  fields: { name: string };
};

type GenresListProps = {
  genres: Genre[];
};

// helper: normalizira dijakritike i radi čist slug
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // makni naglaske (č/ć/š/ž/đ -> c/c/s/z/d)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const GenresList: React.FC<GenresListProps> = ({ genres }) => {
  const sorted = useMemo(
    () =>
      [...genres].sort((a, b) =>
        a.fields.name.localeCompare(b.fields.name, "hr-HR", {
          sensitivity: "base",
          numeric: true,
        })
      ),
    [genres]
  );

  return (
    <div className="bg-gray-100 p-6 sm:rounded-lg border-b border-[#D8D8D8] sm:border-none sm:shadow-md">
      <h2 className="text-xl text-[#593E2E] sm:text-2xl font-semibold mb-4">All Genres</h2>

      <ul className="grid grid-cols-2 gap-x-16 gap-y-4">
        {sorted.map((genre) => (
          <li key={genre.sys.id} className="border-b border-white pb-2 text-[#593E2E]">
            <Link href={`/genres/${toSlug(genre.fields.name)}`}>
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
