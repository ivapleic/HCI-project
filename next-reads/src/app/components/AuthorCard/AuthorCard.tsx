"use client";

import React from "react";
import Link from "next/link";

export interface AuthorCardProps {
  author: {
    id: string;
    fullName: string;
    profileImageUrl?: string;
    bio?: string;
  };
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const profileImageUrl = author.profileImageUrl ?? "/placeholder_book.png";

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md border hover:shadow-lg transition">
      <Link href={`/author/${author.id}`} className="flex-shrink-0">
        <img
          src={profileImageUrl}
          alt={author.fullName}
          className="w-16 h-16 object-cover rounded-full"
        />
      </Link>

      <div>
        <Link
          href={`/author/${author.id}`}
          className="text-lg font-semibold text-gray-900 hover:text-[#593E2E] hover:underline"
        >
          {author.fullName}
        </Link>
        {author.bio && <p className="text-sm text-gray-600 line-clamp-2">{author.bio}</p>}
      </div>
    </div>
  );
}
