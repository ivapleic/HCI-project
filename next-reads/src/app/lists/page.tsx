"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string>("");
  const router = useRouter();

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

  // Search po TAG-u: exact (po imenu) → partial → /tags/not-found
  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;

    const norm = (s: string) =>
      (s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    const qNorm = norm(q);

    // exact match po imenu (name ili tagName)
    const exact = tags.find(
      (t: any) => norm(t?.fields?.name || t?.fields?.tagName || "") === qNorm
    );
    if (exact) {
      const name = exact.fields?.name || exact.fields?.tagName || "";
      router.push(`/tags/${encodeURIComponent(name)}`);
      return;
    }

    // partial match
    const partial = tags.find((t: any) =>
      norm(t?.fields?.name || t?.fields?.tagName || "").includes(qNorm)
    );
    if (partial) {
      const name = partial.fields?.name || partial.fields?.tagName || "";
      router.push(`/tags/${encodeURIComponent(name)}`);
      return;
    }

    // nema taga → not found stranica
    router.push("/tags/not-found");
  };

  return (
    <div
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
      "
    >
      {loading ? (
        <div className="text-center text-lg">Loading lists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-6 w-full">
          {/* Glavni dio - paginirane liste (span 2) */}
          <div className="md:col-span-2 sm:bg-neutral-white p-6 mb-0 sm:rounded-lg sm:shadow-md border-b border-[#D8D8D8] sm:border-none">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-neutral-dark font-bold tracking-tight text-left mb-4">
              Lists
            </h2>

            {/* SEARCH: "Search lists by tag..." */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Search lists by tag..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (searchError) setSearchError("");
                }}
                className="flex-1 p-2 border-neutral-white bg-neutral-white sm:bg-accent-pink rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-dark"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 hover:cursor-pointer bg-neutral-dark text-neutral-white rounded-md hover:bg-neutral w-full sm:w-auto text-sm sm:text-base"
              >
                Search
              </button>
            </div>

            {searchError && (
              <p className="text-sm text-secondary-dark mb-4">{searchError}</p>
            )}

            {displayedLists.length > 0 ? (
              <>
                {/* XS–LG: 2 po redu */}
                <div className="block lg:hidden">
                  <ItemGrid
                    items={displayedLists}
                    itemType="lists"
                    maxDisplay={itemsPerPage}
                    columns={2}
                    moreLink="/lists"
                    moreLabel="View all lists"
                    title=""
                  />
                </div>

                {/* LG+: 3 po redu */}
                <div className="hidden lg:block">
                  <ItemGrid
                    items={displayedLists}
                    itemType="lists"
                    maxDisplay={itemsPerPage}
                    columns={3}
                    moreLink="/lists"
                    moreLabel="View all lists"
                    title=""
                  />
                </div>

                <Pagination
                  totalItems={lists.length} // <- ukupno lista, ne displayed
                  itemsPerPage={itemsPerPage}
                  currentPage={page}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <p className="text-neutral">No lists available for this tag.</p>
            )}
          </div>

          {/* Desni sidebar (span 1) */}
          <div className="md:col-span-1">
            <TagList tags={tags} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;