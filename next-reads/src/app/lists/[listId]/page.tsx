"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getListById } from "../../lists/_lib/ListApi";
import { getAllTags } from "../../tags/_lib/TagsApi";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import BookCard from "../../components/BookCard/BookCard";
import TagList from "../../components/TagsList/TagsList";
import Pagination from "../../components/Pagination/Pagination";

const ListDetailPage = () => {
  const { listId } = useParams();
  const [list, setList] = useState<any>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchListAndTags = async () => {
      try {
        setLoading(true);
        const fetchedList = await getListById(listId as string);
        const allTags = await getAllTags();

        if (fetchedList) {
          setList(fetchedList);
          setPage(1); // resetiraj paginaciju kod promjene liste
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
  const totalItems = list.fields.books?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const displayedBooks = list.fields.books?.slice(startIndex, startIndex + itemsPerPage) || [];

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
  <div
      id="page-top"
      className="
        w-full
        mt-2
        sm:mt-6
        mb-0
        sm:mb-20
        px-0
        md:px-20
        md:mx-auto
        md:max-w-[1200px]
        flex
        justify-center
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10 w-full max-w-[1200px] mx-auto">
        {/* Glavni sadržaj - zauzima 2/3 na desktopu */}
        <div className="md:col-span-2 p-6 border-b border-[#D8D8D8] sm:border-none md:bg-white md:rounded-lg md:shadow-md">
          <h2 className="text-3xl font-bold text-[#593E2E] mb-2">{list.fields.name}</h2>

          {/* Opis liste */}
          <div className="mb-5 prose max-w-none">
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
            <Pagination
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          )}
        </div>

        {/* Desni sidebar s tagovima */}
        <div>
          <TagList tags={tags} />
        </div>
      </div>
    </div>
  );
};

export default ListDetailPage;
