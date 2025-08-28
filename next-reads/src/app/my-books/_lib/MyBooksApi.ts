import contentfulClient from "../../../lib/contentfulClient";
import { TypeUserSkeleton } from "../../../content-types";



// Dohvat korisnika po ID-u
export const getUserById = async (userId: string) => {
  try {
    const entry = await contentfulClient.withoutUnresolvableLinks.getEntry<TypeUserSkeleton>(userId, {
      include: 3, // povećaj dubinu da pokriješ autore unutar knjiga
    });
    console.log("Fetched user with expanded references:", entry);
    return entry;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};


// Dohvat currently reading knjige (jedna referenca)
export const getCurrentlyReadingBookByUserId = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    console.log("Currently Reading user data:", user); // LOG za provjeru
    if (!user) return null;

    const book = user.fields.currentlyReading ?? null;
    console.log("Currently Reading book:", book);
    return book;
  } catch (error) {
    console.error("Error fetching currently reading book:", error);
    return null;
  }
};

export const getReadBooksByUserId = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    if (!user) return [];

    const books = user.fields.readBooks ?? [];
    console.log("Books in readBooks field:", books);

    return books;
  } catch (error) {
    console.error("Error fetching read books:", error);
    return [];
  }
};

// Dohvat polja favourites (niz referenci)
export const getFavouritesByUserId = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    console.log("Favourites user data:", user); // LOG za provjeru
    if (!user) return [];

    const favourites = user.fields.favourites ?? [];
    console.log("Favourites list:", favourites);
    return favourites;
  } catch (error) {
    console.error("Error fetching favourites:", error);
    return [];
  }
};

// Dohvat polja wantToRead (niz referenci)
export const getWantToReadByUserId = async (userId: string) => {
  try {
    const user = await getUserById(userId);
    console.log("Want To Read user data:", user); // LOG za provjeru
    if (!user) return [];

    const wantToRead = user.fields.wantToRead ?? [];
    console.log("Want To Read list:", wantToRead);
    return wantToRead;
  } catch (error) {
    console.error("Error fetching want to read books:", error);
    return [];
  }
};
