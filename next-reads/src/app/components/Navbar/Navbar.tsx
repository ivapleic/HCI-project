"use client";

import { useState, useRef,useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../Logo/Logo";
import { cn } from "../../../lib/utils";
import { useClickOutside } from "../../../hooks/useClickOutside";
import SearchBar from "../SearchBar/SearchBar";
import MegaMenu from "../MegaMenu/MegaMenu";
import { useAuth } from "../../../lib/AuthContext";
import ProfileIcon from "../UserIcon/UserIcon";
import { getUserById } from "@/app/my-books/_lib/MyBooksApi";

export function Navbar() {
  const pathname = usePathname();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBrowseDropdownOpen, setIsBrowseDropdownOpen] = useState(false);
  const megaMenuRef = useRef(null);
  const browseBooksRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{left: number, width: number} | null>(null);
  const [userObject, setUserObject] = useState<any>(null); 


  useClickOutside(megaMenuRef, () => setIsMegaMenuOpen(false));

  const linkStyles =
    "px-3 py-2 text-sm whitespace-nowrap font-medium rounded hover:text-[#593E2E] transition-colors";

  const { user, isLoggedIn } = useAuth();

// Fetch user data when component mounts or user changes
  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        try {
          const userData = await getUserById(user.id);
          setUserObject(userData);
          console.log("User object in Navbar:", userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [user?.id]); 

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(prev => !prev);
  };

  useEffect(() => {
    if (isMegaMenuOpen && browseBooksRef.current) {
      const rect = browseBooksRef.current.getBoundingClientRect();
      setDropdownPos({ left: rect.left + rect.width / 2, width: rect.width });
    }
  }, [isMegaMenuOpen]);


  return (
    <nav className="border-b border-gray-300 bg-white sticky top-0 z-50">

      {/* MOBILE NAV */}
      <div className="flex flex-col min-[851px]:hidden">
        <div className="flex items-center justify-between px-3 py-2">
          <button
            aria-label="Open search"
            className="p-2"
            onClick={() => setIsSearchOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z"
              />
            </svg>
          </button>

          <Link href="/" className="mx-auto">
            <Logo className="text-2xl" />
          </Link>

          {isLoggedIn ? (
            <ProfileIcon />
          ) : (
            <Link
              href="/auth/login"
              className="bg-[#593E2E] text-white px-3 py-1.5 rounded-md text-sm font-medium"
            >
              Login
            </Link>
          )}
        </div>

        {isSearchOpen && (
          <div className="px-4 pb-2">
            <SearchBar />
          </div>
        )}

        <div className="border-t border-gray-200 bg-white">
          <ul className="flex flex-row items-center justify-center gap-1 py-1 overflow-x-auto">
            {/* Home je uvijek prikazan */}
            <li>
              <Link
                href="/"
                className={cn(
                  linkStyles,
                  pathname === "/"
                    ? "text-[#593E2E] font-bold"
                    : "text-gray-800"
                )}
              >
                Home
              </Link>
            </li>

            {/* Browse Books uvijek prikazan, link ovisno o login statusu */}
            <li>
              <button
                type="button"
                className={cn(
                  linkStyles,
                  pathname === "/browse-books"
                    ? "text-[#593E2E] font-bold"
                    : "text-gray-800"
                )}
                onClick={() => setIsBrowseDropdownOpen((v) => !v)}
              >
                Browse Books
                <svg
                  className="inline ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </li>

            {/* My Books vidljivo samo ako je logiran */}
            {isLoggedIn && (
              <li>
                <Link
                  href="/my-books"
                  className={cn(
                    linkStyles,
                    pathname === "/my-books"
                      ? "text-[#593E2E] font-bold"
                      : "text-gray-800"
                  )}
                >
                  My Books
                </Link>
              </li>
            )}
          </ul>

          {isBrowseDropdownOpen && (
            <div className="flex flex-col bg-white border-t border-b border-gray-100">
              <Link
                href="/genres"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsBrowseDropdownOpen(false)}
              >
                Genres
              </Link>
              <Link
                href="/lists"
                className="px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setIsBrowseDropdownOpen(false)}
              >
                Lists
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="hidden min-[851px]:flex items-center
       justify-between px-4 sm:px-8 lg:px-17 py-6 relative">

    <Link href="/">
      <Logo className="text-2xl" />
    </Link>

    <ul className="flex gap-x-4 items-center">
      {/* Home uvijek */}
      <li>
        <Link href="/">
          <span
            className={cn(linkStyles, {
              "text-[#593E2E] border-b-2 border-[#593E2E]": pathname === "/",
              "text-gray-800": pathname !== "/"
            })}
          >
            Home
          </span>
        </Link>
      </li>

      {/* Browse Books - koristi ref */}
      <div
        ref={browseBooksRef}
        onClick={() => setIsMegaMenuOpen((v) => !v)}
        className="cursor-pointer"
      >
        <span
          className={cn(linkStyles, {
            "text-[#593E2E] border-b-2 border-[#593E2E]": pathname === "/browse-books",
            "text-gray-800": pathname !== "/browse-books"
          })}
        >
          Browse Books
        </span>
      </div>

      {/* MegaMenu & Strelica */}
          {isMegaMenuOpen && dropdownPos && (
            <>
              {/* Strelica - SAD odmah ispod navbara */}
              <div
                style={{
                  position: "fixed",
                  left: `${dropdownPos.left}px`,
                  top: `68px`,
                  zIndex: 60,
                  pointerEvents: "none"
                }}
              >
                <svg width="32" height="20" viewBox="0 0 32 20">
                  <polygon points="16,0 32,20 0,20" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                </svg>
              </div>
              {/* MegaMenu panel bliže vrhu */}
              <div
                style={{
                  position: "fixed",
                  left: `${dropdownPos.left}px`,
                  top: `88px`,
                  transform: "translateX(-50%)",
                  zIndex: 50,
                  minWidth: 320,
                  width: 700,
                }}
                className="pointer-events-auto"
              >
             
<MegaMenu
  isOpen={isMegaMenuOpen}
  onClose={() => setIsMegaMenuOpen(false)}
  customWidth="w-full"
  userFavoriteGenres={
    userObject?.fields?.favoriteGenres?.map((genre: any) => 
      genre.fields.name
    ) || []
  } 
/>
              </div>
            </>
          )}


      {/* My Books */}
      {isLoggedIn && (
        <li>
          <Link href="/my-books">
            <span
              className={cn(linkStyles, {
                "text-[#593E2E] border-b-2 border-[#593E2E]": pathname === "/my-books",
                "text-gray-800": pathname !== "/my-books"
              })}
            >
              My Books
            </span>
          </Link>
        </li>
      )}
    </ul>

    <div className="flex items-center gap-x-4">
      <div className="w-100">
        <SearchBar />
      </div>
      {isLoggedIn ? (
        <ProfileIcon />
      ) : (
        <Link
          href="/auth/login"
          className="bg-[#593E2E] text-white px-4 py-2 rounded-md hover:bg-[#8C6954] text-sm md:text-xs lg:text-sm"
        >
          Login
        </Link>
      )}
    </div>
  </div>
    </nav>
  );
}
