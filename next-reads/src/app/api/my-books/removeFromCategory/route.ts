import { NextResponse } from "next/server";
import { removeBookFromCategory } from "../../../../lib/categoriesApi";

export async function POST(request: Request) {
  try {
    const { userId, bookId, category } = await request.json();

    if (!userId || !bookId || !category) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await removeBookFromCategory(userId, bookId, category);

    return NextResponse.json({ message: "Book removed from category" }, { status: 200 });
  } catch (error: any) {
    console.error("API error (removeFromCategory):", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
