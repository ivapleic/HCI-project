import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./categoryDropdown.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface CategoryDropdownProps {
  bookId: string;
  variant?: "full" | "icon";
  className?: string;
}

const categories = [
  { id: "wantToRead", label: "Want To Read" },
  { id: "currentlyReading", label: "Currently Reading" },
  { id: "read", label: "Read" },
];

export default function CategoryDropdown({
  bookId,
  variant = "full",
  className,
}: CategoryDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  function toggleDropdown() {
    setDropdownOpen((open) => !open);
  }
    useEffect(() => {
    // Primjer: dohvat statusa iz localStorage ili API
    const checkFavoriteStatus = async () => {
      try {
        const userJson = localStorage.getItem("user");
        if (!userJson) return;

        const userObj = JSON.parse(userJson);

        // Poziv api endpointa da vidi da li je knjiga favorita za tog usera (pretpostavka)
        const res = await fetch(`/api/my-books/isFavorite?userId=${userObj.id}&bookId=${bookId}`);
        if (!res.ok) {
          setFavorite(false);
          return;
        }
        const data = await res.json();
        setFavorite(data.isFavorite);
      } catch (err) {
        console.error("Failed to fetch favorite status", err);
      }
    };

    checkFavoriteStatus();
  }, [bookId]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleFavorite = async () => {
    const newFavorite = !favorite;
    setFavorite(newFavorite);

    const userJson = localStorage.getItem("user");
    if (!userJson) {
      toast.error("User not logged in", {
        position: "bottom-left",
        autoClose: 2000,
      });
      return;
    }
    const userObj = JSON.parse(userJson);

    try {
      const res = await fetch("/api/my-books/updateCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userObj.id,
          bookId,
          category: newFavorite ? "favourites" : "", // "" može značiti ukloni kategoriju
        }),
      });
      if (!res.ok) throw new Error("Failed to update favorite category");

      toast.success(
        `Book ${newFavorite ? "added to" : "removed from"} favorites!`,
        {
          position: "bottom-left",
          autoClose: 2000,
        }
      );
    } catch (error) {
      toast.error("Failed to update favorite category", {
        position: "bottom-left",
        autoClose: 2000,
      });
      setFavorite(!newFavorite);
    }
  };

  async function handleSelect(categoryId: string) {
    setDropdownOpen(false);
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    setSelectedCategory(category);

    const userJson = localStorage.getItem("user");
    if (!userJson) {
      console.error("User not logged in");
      return;
    }
    const userObj = JSON.parse(userJson);

    try {
      const res = await fetch("/api/my-books/updateCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userObj.id,
          bookId,
          category: categoryId,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to update category. Status: ${res.status}, Message: ${errorText}`
        );
      }
      toast.success(`Book added to "${category.label}" category!`, {
        position: "bottom-left",
        autoClose: 2000,
      });
      console.log(
        `Book ${bookId} added to category ${categoryId} for user ${userObj.id}`
      );
    } catch (error: any) {
      toast.error("Failed to update category", {
        position: "bottom-left",
        autoClose: 2000,
      });
      console.error("Failed to update user category:", error.message ?? error);
    }
  }

  return (
    <>
      {variant === "icon" ? (
        <div
          ref={dropdownRef}
          className={`${
            className ?? ""
          } relative text-left flex items-center space-x-2`}
        >
          <button
            onClick={toggleFavorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
            className="text-red-600 hover:text-red-700 focus:outline-none cursor-pointer"
          >
            {favorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>

          <button
            onClick={toggleDropdown}
            className="bg-[#155449] hover:bg-[#12463a] transition text-white font-semibold py-1 px-3 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#599C66] shadow text-sm"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="Open categories menu"
            title="Add to category"
          >
            +
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-1 w-max bg-white border border-gray-200 rounded-md shadow-lg z-20 text-sm text-[#155449]">
              {categories.map(({ id, label }) => (
                <li
                  key={id}
                  onClick={() => handleSelect(id)}
                  className="px-3 py-2 cursor-pointer hover:bg-[#eaf3f0] rounded-md"
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div
          ref={dropdownRef}
          className={`${className ?? ""} relative inline-block text-left mt-2`}
          style={{ minWidth: "180px" }}
        >
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFavorite}
              aria-label={
                favorite ? "Remove from favorites" : "Add to favorites"
              }
              title={favorite ? "Remove from favorites" : "Add to favorites"}
              className="text-red-600 hover:text-red-700 focus:outline-none"
            >
              {favorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
            </button>
            <button
              onClick={toggleDropdown}
              className="bg-[#155449] hover:bg-[#12463a] transition text-white font-semibold py-2 px-6 rounded-md flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#155449] shadow text-sm"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span className="max-w-[140px] truncate">
                {selectedCategory.label}
              </span>
              <svg
                className="ml-2 w-5 h-5"
                aria-hidden="true"
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
          </div>

          {dropdownOpen && (
            <ul
              className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 text-sm text-[#155449]"
              style={{ width: "100%", minWidth: "180px" }}
            >
              {categories.map(({ id, label }) => (
                <li
                  key={id}
                  onClick={() => handleSelect(id)}
                  className="px-4 py-3 cursor-pointer hover:bg-[#eaf3f0] rounded-md"
                >
                  {label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ToastContainer
        toastClassName="my-toast"
        progressClassName="my-toast-progress"
        className="my-toast-container"
        position="bottom-left"
        autoClose={5000}
        hideProgressBar
        closeButton={true}
        pauseOnHover={false}
      />
    </>
  );
}
