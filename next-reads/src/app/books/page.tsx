import React, { Suspense } from "react";
import BooksList from "./BooksList";

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksList />
    </Suspense>
  );
}
