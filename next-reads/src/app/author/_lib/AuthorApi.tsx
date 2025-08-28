// app/_lib/authorsApi.ts
import contentfulClient from "../../../lib/contentfulClient";
import { TypeAuthorSkeleton } from "../../../content-types";

// Dohvat autora po ID-u
export const getAuthorById = async (authorId: string) => {
  try {
    const entry = await contentfulClient.withoutUnresolvableLinks.getEntry<TypeAuthorSkeleton>(authorId);
    return entry;
  } catch (error) {
    console.error("Greška pri dohvaćanju autora po ID-u:", error);
    return null;
  }
};

// Dohvat knjiga prema autorovom ID-u
export const getBooksByAuthorId = async (authorId: string) => {
  try {
    const author = await getAuthorById(authorId);
    if (!author) return [];

    const bookRefs = author.fields.books ?? [];
    return bookRefs.map((ref: any) => ref); // ako su već resolved (što jesu s `withoutUnresolvableLinks`)
  } catch (error) {
    console.error("Greška pri dohvaćanju knjiga autora:", error);
    return [];
  }
};

// Pretpostavljamo da postoji content_type: "series" s poljem author (EntryLink na autora)
export const getSeriesByAuthorId = async (authorId: string) => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries({
      content_type: "series",
      select: ["fields"],
      "fields.author.sys.id": authorId,
    });

    return data.items;
  } catch (error) {
    console.error("Greška pri dohvaćanju serija autora:", error);
    return [];
  }
};
