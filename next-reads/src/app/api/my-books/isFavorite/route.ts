import { NextResponse } from "next/server";
import { getUserBookCategories } from "@/lib/categoriesApi";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const bookId = searchParams.get("bookId");

  if (!userId || !bookId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const categories = await getUserBookCategories(userId, bookId);
    const isFavorite = categories.includes("favourites");
    return NextResponse.json({ isFavorite }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch favorite status" }, { status: 500 });
  }
}
