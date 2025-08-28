import contentfulClient from "../../../lib/contentfulClient";
import { Entry } from "contentful";
import { TypeGenreSkeleton, TypeListSkeleton, TypeBooksSkeleton } from "../../../content-types";

// ✅ 1. Dohvaćanje svih žanrova
export const getGenreList = async (): Promise<
  Entry<TypeGenreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]
> => {
  try {
    const data =
      await contentfulClient.withoutUnresolvableLinks.getEntries<TypeGenreSkeleton>({
        content_type: "genre",
        select: ["fields"],
      });

    return data.items; 
  } catch (error) {
    console.error("Error fetching genre list:", error);
    return [];
  }
};

// ✅ 2. Dohvaćanje jednog žanra prema ID-u
export const getGenreById = async (genreId: string) => {
  try {
    const data =
      await contentfulClient.withoutUnresolvableLinks.getEntries<TypeGenreSkeleton>({
        content_type: "genre",
        "sys.id": genreId,
        select: ["fields"],
      });

    return data.items.length > 0 ? data.items[0] : null;
  } catch (error) {
    console.error("Error fetching genre by ID:", error);
    return null;
  }
};

// ✅ 3. Dohvaćanje svih lista koje sadrže određeni žanr
export const getListsByGenre = async (genreId: string) => {
  try {
    const data =
      await contentfulClient.withoutUnresolvableLinks.getEntries<TypeListSkeleton>({
        content_type: "list",
        select: ["fields"],
      });

    // 🔹 Filtriranje samo onih listi koje imaju traženi žanr
    const filteredLists = data.items.filter((item) =>
      item.fields.genres?.some((genre: any) => genre.sys.id === genreId)
    );

    return filteredLists;
  } catch (error) {
    console.error("Error fetching lists by genre:", error);
    return [];
  }
};

export const getBooks = async (): Promise<Entry<TypeBooksSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]> => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeBooksSkeleton>({
      content_type: "books", // Specifikacija tipa sadržaja za knjige
      select: ["fields"], // Dohvaća samo polja koja nas zanimaju
    });

    return data.items;
  } catch (error) {
    console.error("Error fetching books:", error);
    return []; // Ako dođe do greške, vraća praznu listu
  }
};



