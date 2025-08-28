import contentfulClient from "./contentfulClient";
import { Entry } from "contentful";

import {
  TypeGenreSkeleton,
  TypeListSkeleton,
} from "../content-types";

export const getGenreList = async (): Promise<Entry<TypeGenreSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]> => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeGenreSkeleton>({
      content_type: "genre",
      select: ["fields"],
    });

    return data.items; // Return the full Entry object
  } catch (error) {
    console.error("Error fetching genre list:", error);
    return []; // Return empty array on error
  }
};

export const getGenreById = async (genreId: string) => {
  try {
    const data =
      await contentfulClient.withoutUnresolvableLinks.getEntries<TypeGenreSkeleton>(
        {
          content_type: "genre",
          "sys.id": genreId,
          select: ["fields"],
        }
      );

    if (data.items.length > 0) {
      return data.items[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching genre by ID:", error);
    return null;
  }
};

export const getListsByGenre = async (genreId: string) => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeListSkeleton>({
      content_type: "list",
      select: ["fields"],
    });

    console.log("All data items:", data.items);  

    // ZASTO OVO NE RADI???

      // const filteredItems = data.items.filter((item) => 
      //   item.fields.Genres.filter((genre: any) => genre.sys.id === genreId) 
     // );
    

    // console.log("Filtered Lists:", filteredItems);  
    return data.items; 
  } catch (error) {
    console.error("Error fetching lists by genre:", error);
    return [];  
  }
};

 // Funkcija za dohvat autora na temelju ID-a
export const GetAuthorById = async (authorId: string) => {
  try {
    const data = await contentfulClient.getEntry(authorId);
    return data.fields; // Vraća podatke o autoru
  } catch (error) {
    console.error("Error fetching author:", error);
    return null;
  }
};


