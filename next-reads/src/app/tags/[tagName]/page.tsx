"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getListsByTagName } from "../../lists/_lib/ListApi";
import { getAllTags } from "../_lib/TagsApi";
import ItemGrid from "../../components/ItemGrid/ItemGrid";
import Pagination from "../../components/Pagination/Pagination"; 

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
    <div className="w-full my-4 px-4 md:px-10 lg:px-20">
      {loading ? (
        <div className="text-center text-lg">Loading lists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Glavni dio - filtrirane liste */}
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border">
            <h1 className="text-xl sm:text-2xl md:text-3xl text-[#593E2E] font-bold tracking-tight text-left mb-6">
              Lists for tag: <span className="text-red-700">{tagName}</span>
            </h1>

            {displayedLists.length > 0 ? (
              <>
                <ItemGrid
                  items={displayedLists}
                  itemType="lists"
                  maxDisplay={itemsPerPage}
                  columns={2}
                  moreLink={`/tags/${tagName}`}
                  moreLabel="More lists with this genre"
                  title=""
                />
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

          {/* Desni div: Popis svih tagova */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md border">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
              Browse by Tags
            </h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-4">
              {tags.length > 0 ? (
                tags.map((tag: any) => (
                  <li key={tag.sys.id} className="border-b pb-2">
                    <Link href={`/tags/${tag.fields.tagName.toLowerCase()}`}>
                      <span className="text-gray-800 hover:text-blue-500 transition">
                        {tag.fields.tagName}
                      </span>
                    </Link>
                  </li>
                ))
              ) : (
                <p>No tags available.</p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagPage;
