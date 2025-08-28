import contentfulClient from "../../../lib/contentfulClient";

export interface SearchResultItemBase {
  id: string;
  type: "book" | "author";
  title: string;
  href: string;
}

export interface BookSearchResultItem extends SearchResultItemBase {
  type: "book";
  imageUrl?: string;
  description?: string;
  year?: number;
  authorName?: string; // <-- novo polje
  authorId?: string;   // <-- novo polje
}

export interface AuthorSearchResultItem extends SearchResultItemBase {
  type: "author";
  profileImageUrl?: string;
}

export type SearchResultItem = BookSearchResultItem | AuthorSearchResultItem;

export async function searchBooksAuthorsSeriesLists(
  query: string,
  limit = 5
): Promise<SearchResultItem[]> {
  console.log("Pozvana funkcija searchBooksAuthorsSeriesLists sa query:", query);

  if (!query.trim()) return [];

  const booksRes = await contentfulClient.getEntries({
    content_type: "books",
    "fields.title[match]": query,
    limit,
    include: 2,
  });
  console.log("Rezultati pretraživanja knjiga:", booksRes.items);

  const authorsRes = await contentfulClient.getEntries({
    content_type: "author",
    "fields.fullName[match]": query,
    limit,
  });
  console.log("Rezultati pretraživanja autora:", authorsRes.items);

  const results: SearchResultItem[] = [];

  // Obradi knjige
  booksRes.items.forEach((item) => {
    const title = item.fields?.title;

    let authorName: string | undefined = undefined;
    let authorId: string | undefined = undefined;

    const authorField = item.fields?.author;
    if (
      authorField &&
      typeof authorField === "object" &&
      "fields" in authorField &&
      typeof (authorField as any).fields.fullName === "string"
    ) {
      authorName = (authorField as any).fields.fullName;
      authorId = (authorField as any).sys.id;
    }

    let imageUrl: string | undefined = undefined;
    const coverImage = item.fields?.coverImage;
    if (
      coverImage &&
      typeof coverImage === "object" &&
      "fields" in coverImage &&
      (coverImage as any).fields.file?.url
    ) {
      imageUrl = "https:" + (coverImage as any).fields.file.url;
    }

    if (typeof title !== "string" || !title.trim()) return;

    results.push({
      id: item.sys.id,
      type: "book",
      title,
      authorName,   // <-- novo polje
      authorId,     // <-- novo polje
      imageUrl,
      description:
        typeof item.fields.description === "string"
          ? item.fields.description
          : undefined,
      href: `/books/${item.sys.id}`,
    });
  });

  // Obradi autore
  authorsRes.items.forEach((item) => {
    const fullName = item.fields?.fullName;
    let profileImageUrl: string | undefined = undefined;
    const profileImage = item.fields?.profileImage;
    if (
      profileImage &&
      typeof profileImage === "object" &&
      "fields" in profileImage &&
      (profileImage as any).fields.file?.url
    ) {
      profileImageUrl = "https:" + (profileImage as any).fields.file.url;
    }

    if (typeof fullName !== "string" || !fullName.trim()) return;

    results.push({
      id: item.sys.id,
      type: "author",
      title: fullName,
      profileImageUrl,
      href: `/author/${item.sys.id}`,
    });
  });

  console.log("Spojeni rezultati za query:", results);

  return results.slice(0, limit);
}
