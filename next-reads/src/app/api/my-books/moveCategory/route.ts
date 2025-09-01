import { NextResponse } from "next/server";
import { moveBookBetweenCategories } from "../../../../lib/categoriesApi";

export async function POST(request: Request) {
  try {
    const { userId, bookId, oldCategory, newCategory } = await request.json();

    if (!userId || !bookId || !newCategory || oldCategory === undefined) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await moveBookBetweenCategories(userId, bookId, oldCategory, newCategory);

    return NextResponse.json({ message: "Category moved successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("API error (moveCategory):", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
