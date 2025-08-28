"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/AuthContext";

const ProfileIcon = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user || !user.id) return null;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-[#E8DFD7] focus:outline-none focus:ring-2 focus:ring-[#593E2E]"
        aria-label="User menu"
      >
        <span className="text-[#593E2E] font-bold select-none">{initials}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-50 divide-y divide-gray-200">
          <Link
            href={`/profile/${user.id}`}
            className="block px-4 py-2 text-[#593E2E] hover:bg-[#F9F3EE] rounded-t-md"
            onClick={() => setDropdownOpen(false)}
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-[#593E2E] hover:bg-[#F9F3EE] rounded-b-md"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
