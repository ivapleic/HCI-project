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
  const [searchError, setSearchError] = useState<string>(""); // ⬅️ NEW
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

  // helper: robustan slug (bez dijakritike, razmaka, velikih slova)
  const toSlug = (s: string) =>
    (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Search po TAG-u: exact slug → partial → poruka
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
    router.push(`/tags/${encodeURIComponent(name)}`); // ⬅️ URL = IME TAGA
    return;
  }

  // partial match
  const partial = tags.find((t: any) =>
    norm(t?.fields?.name || t?.fields?.tagName || "").includes(qNorm)
  );
  if (partial) {
    const name = partial.fields?.name || partial.fields?.tagName || "";
    router.push(`/tags/${encodeURIComponent(name)}`); // ⬅️ URL = IME TAGA
    return;
  }

  // nema taga → not found stranica
  router.push("/tags/not-found");
};

  return (
    <div className="w-full my-4 sm:px-10 mx-0 lg:px-20">
      {loading ? (
        <div className="text-center text-lg">Loading lists...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Glavni dio - paginirane liste */}
          <div className="md:col-span-8 sm:bg-white p-6 sm:rounded-lg sm:shadow-md">
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#593E2E] font-bold tracking-tight text-left mb-4">
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
                className="flex-1 p-2 border-white bg-[#F9F3EE] rounded-md focus:outline-none focus:ring-2 focus:ring-[#593E2E]"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 hover:cursor-pointer bg-[#593E2E] text-white rounded-md hover:bg-[#8C6954] w-full sm:w-auto text-sm sm:text-base"
              >
                Search
              </button>
            </div>

            {searchError && (
              <p className="text-sm text-red-600 mb-4">{searchError}</p>
            )}

             <p className="text-sm md:text-3xl text-[#593E2E] font-bold tracking-tight text-left my-4">
              Popular lists
            </p>

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

          {/* Desni div: Popis svih tagova (uvijek kompletan popis) */}
          <div className="md:col-span-4">
            <TagList tags={tags} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;
