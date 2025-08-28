"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getListById } from "../../lists/_lib/ListApi";
import { getAllTags } from "../../tags/_lib/TagsApi";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import BookCard from "../../components/BookCard/BookCard";

const ListDetailPage = () => {
  const { listId } = useParams();
  const [list, setList] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchListAndTags = async () => {
      try {
        setLoading(true);
        const fetchedList = await getListById(listId as string);
        const allTags = await getAllTags();

        if (fetchedList) {
          setList(fetchedList);
          setPage(1); // Reset paging on new list
        }
        setTags(allTags);
      } catch (error) {
        console.error("Error fetching list or tags:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListAndTags();
  }, [listId]);

  if (loading) {
    return <div className="text-center text-lg mt-12">Loading list details...</div>;
  }

  if (!list) {
    return <div className="text-center text-red-500 mt-12">List not found.</div>;
  }

  // Pagination calculations
  const totalPages = list.fields.books
    ? Math.ceil(list.fields.books.length / itemsPerPage)
    : 0;

  const startIndex = (page - 1) * itemsPerPage;
  const displayedBooks = list.fields.books?.slice(startIndex, startIndex + itemsPerPage) || [];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="md:max-w-[1200px] md:mx-auto p-4 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Glavni sadržaj */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-3xl font-bold text-[#593E2E] mb-6">{list.fields.name}</h2>

          {/* Opis liste */}
          <div className="mb-10 prose max-w-none">
            {list.fields.description ? documentToReactComponents(list.fields.description) : null}
          </div>

          {/* Knjige u listi - paginacija */}
          <div className="space-y-6">
            {displayedBooks.map((book: any) => (
              <BookCard
                key={book.sys.id}
                book={{
                  id: book.sys.id,
                  title: book.fields.title,
                  coverImageUrl: book.fields.coverImage?.fields.file.url,
                  authorName: book.fields.author?.fields.fullName,
                  authorId: book.fields.author?.sys.id,
                  description: book.fields.description,
                }}
              />
            ))}
          </div>

          {/* Paginacija kontrola */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md ${
                  page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-[#593E2E] text-white hover:bg-[#8C6954]"
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md ${
                    page === i + 1 ? "bg-[#593E2E] text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-md ${
                  page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-[#593E2E] text-white hover:bg-[#8C6954]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Desni sidebar s tagovima */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md border">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Browse by Tags</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
            {tags.length > 0 ? (
              tags.map((tag: any) => (
                <li key={tag.sys.id} className="border-b pb-2">
                  <Link
                    href={`/tags/${tag.fields.tagName.toLowerCase()}`}
                    className="text-gray-800 hover:text-blue-500 transition"
                  >
                    {tag.fields.tagName}
                  </Link>
                </li>
              ))
            ) : (
              <p>No tags available.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ListDetailPage;
