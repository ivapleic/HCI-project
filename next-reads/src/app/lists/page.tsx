"use client";

import React, { useState, useEffect } from "react";
import { getLists } from "./_lib/ListApi";
import { getAllTags } from "../tags/_lib/TagsApi";
import ItemGrid from "../components/ItemGrid/ItemGrid";
import Pagination from "../components/Pagination/Pagination";
import TagList from "../components/TagsList/TagsList";

const ListsPage = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchListsAndTags = async () => {
      try {
        setLoading(true);
        const allTags = await getAllTags();
        setTags(allTags);
        const listsData = await getLists();
        setLists(listsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListsAndTags();
  }, []);

  const totalPages = Math.ceil(lists.length / itemsPerPage);
  const displayedLists = lists.slice(
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Glavni dio - paginirane liste */}
          <div className="md:col-span-8 bg-white p-6 rounded-lg shadow-md border">
            <h1 className="text-xl sm:text-2xl md:text-3xl text-[#593E2E] font-bold tracking-tight text-left mb-6">
              Lists
            </h1>
            <h3 className="text-xl text-[#593E2E] font-bold tracking-tight text-left mb-6 inline-block border-b-2 border-[#593E2E] pb-1">
              Most popular lists
            </h3>

            <ItemGrid
              items={displayedLists}
              itemType="lists"
              maxDisplay={itemsPerPage}
              columns={2}
              title=""
              moreLink="/lists"
              moreLabel="View all lists"
            />

            <Pagination
              totalItems={lists.length}
              itemsPerPage={itemsPerPage}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Desni div: Popis svih tagova */}
          <div className="md:col-span-4">
            <TagList tags={tags} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;
