"use client";

import React from "react";
import Link from "next/link";

interface Tag {
  sys: { id: string };
  fields: {
    tagName: string;
  };
}

interface TagListProps {
  tags: Tag[];
}

export default function TagList({ tags }: TagListProps) {
  return (
      <div className="bg-gray-100 p-6 md:rounded-lg shadow-md border-b border-[#D8D8D8] sm:border-none">
      <h2 className="text-xl text-[#593E2E] sm:text-2xl font-semibold mb-4">
        Browse by Tags
      </h2>
      <ul className="grid grid-cols-2 gap-x-10 gap-y-6">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <li
              key={tag.sys.id}
              className="border-b border-white pb-2 text-[#593E2E]"
            >
              <Link href={`/tags/${tag.fields.tagName.toLowerCase()}`}>
                <span className="text-[#593E2E] hover:text-[#a3714b] transition whitespace-nowrap">
                  {tag.fields.tagName}
                </span>
              </Link>
            </li>
          ))
        ) : (
          <p>No tags available.</p>
        )}
      </ul>
    </div>
  );
}

