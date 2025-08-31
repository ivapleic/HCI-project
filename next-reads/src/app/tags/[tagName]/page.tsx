"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getListsByTagName } from "../../lists/_lib/ListApi";
import { getAllTags } from "../_lib/TagsApi";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import Pagination from "../../components/Pagination/Pagination"; 
import TagList from "../../components/TagsList/TagsList";

const TagPage = () => {
  const { tagName } = useParams();
  const [filteredLists, setFilteredLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchListsAndTags = async () => {
      try {
        setLoading(true);
        const allTags = await getAllTags();
        setTags(allTags);

        const tag = Array.isArray(tagName) ? tagName[0] : tagName;

        if (tag) {
          const taggedLists = await getListsByTagName(tag);
          setFilteredLists(taggedLists);
          setPage(1);
        } else {
          setFilteredLists([]);
          console.error("No valid tag provided");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListsAndTags();
  }, [tagName]);

  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);

  const displayedLists = filteredLists.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  return (
    <div className="w-full mb-0 sm:mb-6 my-4 mx-0 md:px-10 lg:px-20">
      {loading ? (
        <div className="text-center text-lg">Loading lists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Glavni dio - filtrirane liste */}
          <div className="md:col-span-2 sm:bg-white p-6 mb-0 sm:rounded-lg sm:shadow-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#593E2E] font-bold tracking-tight text-left mb-6">
              Lists for tag: <span className="text-red-700">{tagName}</span>
            </h2>

          {displayedLists.length > 0 ? (
  <>
    {/* XS/SM: 2 po redu */}
    <div className="block sm:hidden">
      <ItemGrid
        items={displayedLists}
        itemType="lists"
        maxDisplay={itemsPerPage}
        columns={2}
        moreLink={`/tags/${tagName}`}
        moreLabel="More lists with this genre"
        title=""
      />
    </div>

    {/* MD+: 3 po redu */}
    <div className="hidden sm:block">
      <ItemGrid
        items={displayedLists}
        itemType="lists"
        maxDisplay={itemsPerPage}
        columns={2}
        moreLink={`/tags/${tagName}`}
        moreLabel="More lists with this genre"
        title=""
      />
    </div>

    <Pagination
      totalItems={filteredLists.length}
      itemsPerPage={itemsPerPage}
      currentPage={page}
      onPageChange={handlePageChange}
    />
  </>
) : (
  <p className="text-gray-600">No lists available for this tag.</p>
)}
    </div>

        {/* Desni sidebar s tagovima */}
               <div>
                 <TagList tags={tags} />
               </div>
        </div>
      )}
    </div>
  );
};

export default TagPage;
