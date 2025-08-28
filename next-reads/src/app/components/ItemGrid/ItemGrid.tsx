"use client";

import React from "react";
import Link from "next/link";

interface Item {
  sys: { id: string };
  fields: {
    title?: string;              // za serijale
    name?: string;               // za liste
    coverImage?: { fields: { file: { url: string } } };
    books?: Item[];              // za serijale i liste koje imaju knjige
  };
}

interface ItemGridProps {
  items: Item[];
  itemType: "lists" | "series";
  maxDisplay?: number;
  moreLink?: string;
  moreLabel?: string;
  title: string;
  columns?: number;
}

export default function ItemGrid({
  items,
  itemType,
  maxDisplay = 3,
  moreLink,
  moreLabel = "More",
  title,
  columns = 3,
}: ItemGridProps) {
  const displayedItems = items.slice(0, maxDisplay);

  // Siguran URL za slike (dodaj https: ako nedostaje)
  const safeImageUrl = (url?: string) =>
    url?.startsWith("//") ? `https:${url}` : url;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 text-[#593e2e]">{title}</h2>
      {displayedItems.length === 0 ? (
        <p className="text-gray-600 mt-2">No {itemType} available.</p>
      ) : (
        <>
          <div className={`grid grid-cols-${columns} gap-6`}>
            {displayedItems.map((item) => (
              <Link
                key={item.sys.id}
                href={`/${itemType}/${item.sys.id}`}
                className="group flex flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition"
              >
                <div className="flex gap-2 mb-2 justify-center max-w-[180px]">
                  {(itemType === "series" || itemType === "lists") &&
                  item.fields.books?.length ? (
                    item.fields.books.slice(0, 3).map((b) => (
                      <img
                        key={b.sys.id}
                        src={safeImageUrl(b.fields.coverImage?.fields.file.url)}
                        alt={b.fields.title}
                        className="object-cover rounded-md shadow-md w-20 h-28 cursor-pointer hover:opacity-80 transition"
                      />
                    ))
                  ) : (
                    <img
                      src={safeImageUrl(item.fields.coverImage?.fields.file.url)}
                      alt={itemType === "lists" ? item.fields.name : item.fields.title}
                      className="object-cover rounded-md shadow-md w-20 h-28 cursor-pointer hover:opacity-80 transition"
                    />
                  )}
                </div>
                <h3 className="text-center text-[15px] font-bold text-gray-900 mt-1 group-hover:text-[#8c6954] transition-colors duration-200">
                  {itemType === "lists" ? item.fields.name : item.fields.title}
                </h3>
              </Link>
            ))}
          </div>
          {moreLink && items.length > maxDisplay && (
            <div className="flex justify-end mt-4">
              <Link href={moreLink} className="text-sm text-[#593E2E] hover:underline">
                {moreLabel} {itemType}
                <span className="ml-1 text-lg leading-none">→</span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
