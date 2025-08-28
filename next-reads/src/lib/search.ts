import type { NextApiRequest, NextApiResponse } from "next";
import { searchBooksAuthorsSeriesLists, SearchResultItem } from "../app/search/_lib/SearchApi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResultItem[] | { error: string }>
) {
  const { q = "", limit = "3" } = req.query;

  if (typeof q !== "string") {
    res.status(400).json({ error: "Invalid query parameter" });
    return;
  }

  const limitNum = parseInt(limit as string, 10) || 3;

  if (!q.trim()) {
    res.status(200).json([]);
    return;
  }

  try {
    const results = await searchBooksAuthorsSeriesLists(q, limitNum);
    res.status(200).json(results);
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ error: "Server error" });
  }
}
