"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { FC, ReactNode } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

type MenuLink = {
  name: string;
  href: string;
  icon: ReactNode;
  description: string;
};

type MegaMenuProps = {
  isOpen: boolean;
  customWidth?: string;
  onClose?: () => void;
  userFavoriteGenres?: string[];
};

const megaMenuLinks: MenuLink[] = [
  {
    name: "Genres",
    href: "/genres",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path d="M6 4a2 2 0 012-2h8a2 2 0 012 2v16l-7-5-7 5V4z" />
      </svg>
    ),
    description: "Discover books by your favorite genres.",
  },
  {
    name: "Lists",
    href: "/lists",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <circle cx="6" cy="6" r="2" />
        <path d="M10 6h10M6 12a2 2 0 100-4M10 12h10M6 18a2 2 0 100-4M10 18h10" />
      </svg>
    ),
    description: "Curated book lists for every mood.",
  },
];

const defaultGenres: string[] = [
  "Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Thriller",
  "Non-fiction",
  "Biography",
];

const MegaMenu: FC<MegaMenuProps> = ({
  isOpen,
  customWidth,
  onClose,
  userFavoriteGenres,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    if (isOpen && onClose) {
      onClose();
    }
  });

  if (!isOpen) return null;

  const baseWidth =
    customWidth ??
    "w-[96vw] max-w-[630px] sm:max-w-[690px] md:max-w-[740px] lg:max-w-[740px]";

  const handleInnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Determine which genres to display
  const displayGenres =
    userFavoriteGenres && userFavoriteGenres.length > 0
      ? userFavoriteGenres
      : defaultGenres;

  const genresTitle =
    userFavoriteGenres && userFavoriteGenres.length > 0
      ? "Your favorite genres"
      : "Popular genres";

  return (
    <div
      ref={menuRef}
      onClick={handleInnerClick}
      className={`
        relative bg-white shadow-lg border border-gray-200
        z-30 rounded-xl transition-all
        max-h-[76vh] overflow-y-auto
        ${baseWidth}
        p-0
      `}
      style={{ minWidth: "320px" }}
    >
      {/* Arrow */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-5 pointer-events-none z-50">
        <svg width="32" height="20" viewBox="0 0 32 20">
          <polygon
            points="16,0 32,20 0,20"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row">
        {/* Left Column */}
        <div className="bg-[#f9f3ee] w-full sm:w-[46%] lg:w-[44%] rounded-l-xl flex-shrink-0 sm:border-r border-gray-200 px-5 py-5">
          <h4 className="font-semibold text-lg mb-4 text-[#593E2E]">Browse</h4>
          <ul>
            {megaMenuLinks.map((link) => (
              <li
                key={link.href}
                onClick={onClose}
                className="group flex gap-4 items-start rounded-xl cursor-pointer hover:bg-white/60 transition-colors px-1.5 py-2 mb-0.5"
              >
                <span className=" p-2 flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e1d6ce] group-hover:bg-[#593E2E] group-hover:border-[#593E2E] transition-all duration-150">
                  <span className="text-[#593E2E] group-hover:text-white transition-colors duration-150">
                    {link.icon}
                  </span>
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={link.href}>
                    <span className="block text-base font-semibold text-gray-800 group-hover:text-[#593E2E] transition-colors mb-0.5">
                      {link.name}
                    </span>
                  </Link>
                  <div className="text-sm text-gray-500">
                    {link.description}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="flex-1 px-5 py-5">
          <h4 className="font-semibold text-lg mb-4 text-[#593E2E]">
            {genresTitle}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            {displayGenres.map((genre) => (
              <Link
                key={genre}
                href={`/genres/${genre.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={onClose}
                className="block text-[#484848] text-lg leading-snug font-[500] hover:text-[#593E2E] transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
