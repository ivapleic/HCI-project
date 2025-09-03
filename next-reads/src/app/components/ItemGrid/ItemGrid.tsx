"use client";

import React from "react";
import Link from "next/link";

interface Item {
  sys: { id: string };
  fields: {
    title?: string;
    name?: string;
    coverImage?: { fields: { file: { url: string } } };
    books?: Item[];
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

  const safeImageUrl = (url?: string) =>
    url?.startsWith("//") ? `https:${url}` : url;

  const fallback = "/assets/book-placeholder.png";

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-neutral-dark">{title}</h2>
      {displayedItems.length === 0 ? (
        <p className="text-neutral text-sm italic">
          No {itemType} available.
        </p>
      ) : (
        <>
          <div className={`grid grid-cols-${columns} gap-6`}>
            {displayedItems.map((item) => (
              <Link
                key={item.sys.id}
                href={`/${itemType}/${item.sys.id}`}
                className="group flex min-w-0 flex-col items-center bg-neutral-white rounded-xl shadow-md border border-neutral-light p-4 hover:shadow-lg transition"
              >
                {/* Grid 3 slike (ili manje, ostatak placeholder) */}
                <div className="w-full mb-2">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {Array.from({ length: 3 }).map((_, i) => {
                      const b = (item.fields.books ?? [])[i];
                      const src = safeImageUrl(
                        b?.fields.coverImage?.fields.file?.url ??
                          item.fields.coverImage?.fields.file?.url ??
                          fallback
                      );
                      const alt =
                        b?.fields?.title ??
                        (itemType === "lists"
                          ? item.fields.name
                          : item.fields.title) ??
                        "Cover";

                      return (
                        <img
                          key={i}
                          src={src}
                          alt={alt}
                          onError={(e) => {
                            e.currentTarget.src = fallback;
                          }}
                          className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
                          loading="lazy"
                        />
                      );
                    })}
                  </div>
                </div>

                <h3 className="text-center text-[15px] font-bold text-neutral mt-1 group-hover:text-primary transition-colors duration-200">
                  {itemType === "lists" ? item.fields.name : item.fields.title}
                </h3>
              </Link>
            ))}
          </div>

          {moreLink && items.length > maxDisplay && (
            <div className="flex justify-end mt-4">
              <Link
                href={moreLink}
                className="text-sm text-primary hover:underline font-medium"
              >
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
