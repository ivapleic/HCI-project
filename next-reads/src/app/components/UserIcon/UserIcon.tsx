"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/AuthContext";

// helper za inicijale
function getInitials(fullName?: string, email?: string, fallback: string = "?") {
  let source = (fullName || "").trim();

  // fallback na dio e-pošte prije @ (npr. "ivan.horvat")
  if (!source && email) {
    source = email.split("@")[0].replace(/[._-]+/g, " ");
  }
  if (!source) return fallback;

  const parts = source.split(/\s+/).filter(Boolean);

  // više riječi → prvo slovo prve i zadnje
  if (parts.length > 1) {
    const first = parts[0];
    const last = parts[parts.length - 1];
    const a = [...first].find((ch) => /\p{L}/u.test(ch)) || "";
    const b = [...last].find((ch) => /\p{L}/u.test(ch)) || "";
    const res = (a + b).toUpperCase();
    return res || fallback;
  }

  // jedna riječ → prva 2 slova (podržava dijakritiku)
  const single = parts[0];
  const letters = [...single].filter((ch) => /\p{L}/u.test(ch));
  const res = letters.slice(0, 2).join("").toUpperCase();
  return res || fallback;
}

const ProfileIcon = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  // ⬇️ OVDJE se računaju inicijali
  const initials = getInitials(user.fullName, (user as any).email);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-[#E8DFD7] focus:outline-none focus:ring-2 focus:ring-[#593E2E]"
        aria-label="User menu"
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
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
