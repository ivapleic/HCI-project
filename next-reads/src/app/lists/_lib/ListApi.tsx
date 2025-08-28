import contentfulClient from "../../../lib/contentfulClient";
import { Entry } from "contentful";
import { TypeAuthorSkeleton, TypeListSkeleton } from "../../../content-types";


// ✅ 1. Dohvaćanje svih lista
export const getLists = async (): Promise<
  Entry<TypeListSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]
> => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeListSkeleton>({
      content_type: "list",
    });
    // console.log(data.items);
    
    return data.items; 
  } catch (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
};

export const getListsByGenre = async (genreId: string) => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeListSkeleton>({
      content_type: "list",
      select: ["fields"],
    });

    // Filtriraj liste koje sadrže zadani žanr
    const filteredLists = data.items.filter((list) =>
      list.fields.genres?.some((genre: any) => genre.sys.id === genreId)
    );

    return filteredLists;
  } catch (error) {
    console.error(`Error fetching lists for genre ${genreId}:`, error);
    return [];
  }
};

const getTagIdByName = async (tagName: string) => {
  try {
    const response = await contentfulClient.getEntries({
      content_type: "tag",  // Pretpostavljamo da je "tag" tip sadržaja za tagove
      "fields.tagName": tagName,  // Pretraga po imenu taga
    });

    // Ako pronađeš tag, vrati njegov ID
    const tagId = response.items[0]?.sys.id;
    if (!tagId) {
      console.error(`Tag with name ${tagName} not found.`);
    }
    return tagId;
  } catch (error) {
    console.error(`Error fetching tag ID for ${tagName}:`, error);
    return null;
  }
};

// ✅ 4. Dohvatanje lista prema imenu taga, sada sa povezanim knjigama i žanrovima
export const getListsByTagName = async (tagName: string) => {
  try {
    // Prvo dobiješ ID taga na osnovu imena
    const tagId = await getTagIdByName(tagName);

    if (!tagId) {
      console.error(`No tag found for ${tagName}`);
      return [];
    }

    // Zatim pretražuješ liste prema ID-u taga
    const data = await contentfulClient.getEntries({
      content_type: "list",  // Tip sadržaja za liste
      "fields.tag.sys.id": tagId,  // Filtriranje po ID-u taga
      select: [
        "fields.name",
        "fields.description",
        "fields.genres", // Povezani žanrovi
        "fields.books", // Povezane knjige
        "sys.id",
      ],  // Selekcija svih potrebnih polja (naziv, opis, žanrovi, knjige)
      include: 3,  // Ovdje uključujemo povezane entitete (npr. knjige, žanrove)
    });

    return data.items;  // Vraćaš sve liste koje imaju povezani tag
  } catch (error) {
    console.error(`Error fetching lists for tag ${tagName}:`, error);
    return [];
  }
};

// ✅ Dohvati jednu listu po ID-u zajedno s povezanim knjigama i autorima
export const getListById = async (id: string) => {
  try {
    const entry = await contentfulClient.getEntry<TypeListSkeleton>(id, {
      include: 3, // Uključi povezane entitete (npr. knjige, autori unutar knjiga)
    });

    return entry;
  } catch (error) {
    console.error("Error fetching list by ID:", error);
    return null;
  }
};


// ✅ Dohvaćanje svih autora s njihovim knjigama (uključujući reference)
export const getAllAuthors = async (): Promise<
  Entry<TypeAuthorSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]
> => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeAuthorSkeleton>({
      content_type: "author",   
      include: 2,               
    });
    return data.items;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
};