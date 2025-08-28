import contentfulClient from "../../../lib/contentfulClient";
import { TypeUserSkeleton } from "../../../content-types";

// Dohvat korisnika po ID-u
export const getUserById = async (userId: string) => {
  try {
    const entry = await contentfulClient.withoutUnresolvableLinks.getEntry<TypeUserSkeleton>(userId);
    return entry;
  } catch (error) {
    console.error("Greška pri dohvaćanju korisnika po ID-u:", error);
    return null;
  }
};

// Dohvat korisnikovih omiljenih žanrova iz povezanih entiteta (ako želiš dodatno razraditi)
export const getUserFavoriteGenres = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) return [];

    const genreRefs = user.fields.favoriteGenres ?? [];
    return genreRefs.map((ref: any) => ref); // jer bez unresolved linkova, već su riješeni
  } catch (error) {
    console.error("Greška pri dohvaćanju omiljenih žanrova korisnika:", error);
    return [];
  }
};
