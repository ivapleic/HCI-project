"use client";

import { useEffect, useState } from "react";
import {
  getWantToReadByUserId,
  getCurrentlyReadingBookByUserId,
  getReadBooksByUserId,
  getFavouritesByUserId,
} from "../my-books/_lib/MyBooksApi";
import BookshelfSection from "./_components/BookshelfSection/BookshelfSection";
import CombinedReadingSection from "./_components/CombinedReadingSection/CombinedReadingSection";

export type Category =
  | "wantToRead"
  | "currentlyReading"
  | "read"
  | "favourites";

export default function MyBooks() {
  const [wantToRead, setWantToRead] = useState<any[]>([]);
  const [currentlyReading, setCurrentlyReading] = useState<any[]>([]);
  const [readBooks, setReadBooks] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Dohvat userId iz localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setUserId(null);
      setLoading(false);
      return;
    }
    const userObj = JSON.parse(storedUser);
    setUserId(userObj.id);
  }, []);

  // Dohvat knjiga
  const fetchBooks = async (uid: string) => {
    setLoading(true);
    try {
      const [want, reading, read, favs] = await Promise.all([
        getWantToReadByUserId(uid),
        getCurrentlyReadingBookByUserId(uid),
        getReadBooksByUserId(uid),
        getFavouritesByUserId(uid),
      ]);

      if (Array.isArray(reading)) {
        setCurrentlyReading(reading);
      } else if (reading) {
        setCurrentlyReading([reading]);
      } else {
        setCurrentlyReading([]);
      }

      setWantToRead(want || []);
      setReadBooks(read || []);
      setFavourites(favs || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pokretanje fetchBooks kad se promjene userId
  useEffect(() => {
    if (userId) {
      fetchBooks(userId);
    }
  }, [userId]);

  // Funkcija za promjenu kategorije (premještanje knjige)
  const handleCategoryChange = async (
    bookId: string,
    oldCategory: Category,
    newCategory: Category
  ) => {
    if (!userId) return;
    
    const actionId = `${bookId}-${oldCategory}-${newCategory}`;
    setActionInProgress(actionId);

    // Optimističko ažuriranje UI-a - OVO JE JEDINO POTREBNO
    let movedBook: any;
    if (oldCategory === "wantToRead") {
      movedBook = wantToRead.find((b) => b.sys.id === bookId);
      setWantToRead((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (oldCategory === "currentlyReading") {
      movedBook = currentlyReading.find((b) => b.sys.id === bookId);
      setCurrentlyReading((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (oldCategory === "read") {
      movedBook = readBooks.find((b) => b.sys.id === bookId);
      setReadBooks((prev) => prev.filter((b) => b.sys.id !== bookId));
    }

    if (movedBook) {
      if (newCategory === "wantToRead") {
        setWantToRead((prev) => [...prev, movedBook]);
      } else if (newCategory === "currentlyReading") {
        setCurrentlyReading((prev) => {
          if (!prev.some((b) => b.sys.id === movedBook.sys.id)) {
            return [...prev, movedBook];
          }
          return prev;
        });
      } else if (newCategory === "read") {
        setReadBooks((prev) => [...prev, movedBook]);
      }
    }

    try {
      const res = await fetch("/api/my-books/moveCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId, oldCategory, newCategory }),
      });

      if (!res.ok) throw new Error("Failed to update category");
      
      // NE ponovno dohvaćati podatke - optimističko ažuriranje je dovoljno
      // Samo resetiraj actionInProgress nakon uspjeha
    } catch (error) {
      console.error("Backend error:", error);
      // Vrati na početno stanje u slučaju greške
      fetchBooks(userId);
    } finally {
      setActionInProgress(null);
    }
  };

  // Funkcija za uklanjanje iz kategorije
  const handleRemoveFromCategory = async (
    bookId: string,
    category: Category
  ) => {
    if (!userId) return;
    
    const actionId = `${bookId}-remove-${category}`;
    setActionInProgress(actionId);

    // Optimističko ažuriranje UI-a - OVO JE JEDINO POTREBNO
    if (category === "wantToRead") {
      setWantToRead((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (category === "currentlyReading") {
      setCurrentlyReading((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (category === "read") {
      setReadBooks((prev) => prev.filter((b) => b.sys.id !== bookId));
    } else if (category === "favourites") {
      setFavourites((prev) => prev.filter((b) => b.sys.id !== bookId));
    }

    try {
      const res = await fetch("/api/my-books/removeFromCategory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId, category }),
      });

      if (!res.ok) throw new Error("Failed to remove book from category");
      
      // NE ponovno dohvaćati podatke - optimističko ažuriranje je dovoljno
      // Samo resetiraj actionInProgress nakon uspjeha
    } catch (error) {
      console.error("Backend error:", error);
      // Vrati na početno stanje u slučaju greške
      fetchBooks(userId);
    } finally {
      setActionInProgress(null);
    }
  };

  if (!userId) {
    return (
      <div className="py-16 text-center text-lg text-red-600">
        No user ID found. Please log in.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-16 text-center text-lg text-gray-700">
        Loading your shelves…
      </div>
    );
  }

  if (
    wantToRead.length === 0 &&
    currentlyReading.length === 0 &&
    readBooks.length === 0
  ) {
    return (
      <div className="py-16 text-center text-lg text-gray-700">
        You have no books in your shelves yet.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <h1 className="text-3xl font-bold my-4 text-[#593E2E]">Bookshelves</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        <BookshelfSection
          title="Want To Read"
          books={wantToRead}
          type="wantToRead"
          badgeColor="#EEE3D2"
          badgeTextColor="#87715A"
          onCategoryChange={handleCategoryChange}
          onRemove={handleRemoveFromCategory}
          emptyMessage="Nothing here yet…"
          actionInProgress={actionInProgress}
        />

        <BookshelfSection
          title="Favourites"
          books={favourites}
          type="favourites"
          badgeColor="#D6E3F3"
          badgeTextColor="#6A7BA3"
          onCategoryChange={handleCategoryChange}
          onRemove={handleRemoveFromCategory}
          emptyMessage="No favourites yet."
          actionInProgress={actionInProgress}
        />

        <CombinedReadingSection
          currentlyReading={currentlyReading}
          readBooks={readBooks}
          onCategoryChange={handleCategoryChange}
          onRemove={handleRemoveFromCategory}
          actionInProgress={actionInProgress}
        />
      </div>
    </div>
  );
}