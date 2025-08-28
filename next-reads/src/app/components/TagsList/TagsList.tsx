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
    <div className="bg-gray-100 p-6 rounded-lg shadow-md border">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Browse by Tags
      </h2>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag.sys.id} className="border-b pb-2">
              <Link href={`/tags/${tag.fields.tagName.toLowerCase()}`}>
                <span className="text-gray-800 hover:text-blue-500 transition">
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
