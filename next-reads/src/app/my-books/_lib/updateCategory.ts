import { NextResponse } from "next/server";
import { addBookToUserCategory } from "../../../lib/categoriesApi";

export async function POST(request: Request) {
  try {
    const { userId, bookId, category } = await request.json();
    if (!userId || !bookId || !category) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    await addBookToUserCategory(userId, bookId, category);
    return NextResponse.json({ message: "Category updated" }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
