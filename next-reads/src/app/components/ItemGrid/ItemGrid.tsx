// "use client";

// import React from "react";
// import Link from "next/link";

// interface Item {
//   sys: { id: string };
//   fields: {
//     title?: string;
//     name?: string;
//     coverImage?: { fields: { file: { url: string } } };
//     books?: Item[];
//   };
// }

// interface ItemGridProps {
//   items: Item[];
//   itemType: "lists" | "series";
//   maxDisplay?: number;
//   moreLink?: string;
//   moreLabel?: string;
//   title: string;
//   columns?: number;
// }

// export default function ItemGrid({
//   items,
//   itemType,
//   maxDisplay = 3,
//   moreLink,
//   moreLabel = "More",
//   title,
//   columns,
// }: ItemGridProps) {
//   const displayedItems = items.slice(0, maxDisplay);

//   const safeImageUrl = (url?: string) =>
//     url?.startsWith("//") ? `https:${url}` : url;

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4 text-[#593e2e]">{title}</h2>
//       {displayedItems.length === 0 ? (
//         <p className="text-gray-600 mt-2">No {itemType} available.</p>
//       ) : (
//         <>
//           <div className={`grid grid-cols-${columns} gap-6`}>
//             {displayedItems.map((item) => (
//              <Link
//   key={item.sys.id}
//   href={`/${itemType}/${item.sys.id}`}
//   className="group flex min-w-0 flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition"
// >
//   {/* ⬇️ NOVO: uvijek 3 slike koje se prilagođavaju širini kartice */}
//   <div className="w-full mb-2">
//     <div className="grid grid-cols-3 gap-2 w-full">
//       {Array.from({ length: 3 }, (_, i) => {
//         const b = (item.fields.books ?? [])[i];
//         const src = safeImageUrl(
//           b?.fields.coverImage?.fields.file?.url ??
//             item.fields.coverImage?.fields.file?.url ??
//             "/placeholder_book.png"
//         );
//         const alt =
//           b?.fields?.title ??
//           (itemType === "lists" ? item.fields.name : item.fields.title) ??
//           "Cover";

//         return (
//           <img
//             key={i}
//             src={src}
//             alt={alt}
//             className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
//             loading="lazy"
//           />
//         );
//       })}
//     </div>
//   </div>

//   <h3 className="text-center text-[15px] font-bold text-gray-900 mt-1 group-hover:text-[#8c6954] transition-colors duration-200">
//     {itemType === "lists" ? item.fields.name : item.fields.title}
//   </h3>
// </Link>

//             ))}
//           </div>
//           {moreLink && items.length > maxDisplay && (
//             <div className="flex justify-end mt-4">
//               <Link
//                 href={moreLink}
//                 className="text-sm text-[#593E2E] hover:underline"
//               >
//                 {moreLabel} {itemType}
//                 <span className="ml-1 text-lg leading-none">→</span>
//               </Link>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

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
  columns,
}: ItemGridProps) {
  const displayedItems = items.slice(0, maxDisplay);

  const safeImageUrl = (url?: string) =>
    url?.startsWith("//") ? `https:${url}` : url;

  return (
    <div>
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
                className="group flex min-w-0 flex-col items-center bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition"
              >
                {/* Gornji red: uvijek 3 SLota jednake veličine.
                    Ako postoji manje slika, ostatak su prazni slotovi (bez placeholdera). */}
                <div className="w-full mb-2">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {(() => {
                      const covers = (item.fields.books ?? []).slice(0, 3);

                      // 1) Prave slike (koliko ih ima, max 3)
                      const coverNodes = covers.map((b) => {
                        const src = safeImageUrl(
                          b?.fields.coverImage?.fields.file?.url
                        );
                        const alt =
                          b?.fields?.title ??
                          (itemType === "lists"
                            ? item.fields.name
                            : item.fields.title) ??
                          "Cover";

                        return (
                          <img
                            key={b.sys.id}
                            src={src}
                            alt={alt}
                            className="w-full aspect-[2/3] object-cover rounded-md shadow-md"
                            loading="lazy"
                          />
                        );
                      });

                      // 2) Prazni slotovi (da visina/izgled kartice ostane isti)
                      const emptyCount = Math.max(0, 3 - covers.length);
                      const emptyNodes = Array.from({ length: emptyCount }).map(
                        (_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="w-full aspect-[2/3] rounded-md"
                            aria-hidden="true"
                          />
                        )
                      );

                      return [...coverNodes, ...emptyNodes];
                    })()}
                  </div>
                </div>

                <h3 className="text-center text-[15px] font-bold text-gray-900 mt-1 group-hover:text-[#8c6954] transition-colors duration-200">
                  {itemType === "lists" ? item.fields.name : item.fields.title}
                </h3>
              </Link>
            ))}
          </div>

          {moreLink && items.length > maxDisplay && (
            <div className="flex justify-end mt-4">
              <Link
                href={moreLink}
                className="text-sm text-[#593E2E] hover:underline"
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
