import * as contentfulManagement from "contentful-management";

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const mgmtClient = contentfulManagement.createClient({
  accessToken: ACCESS_TOKEN,
});

// Dodavanje knjige u korisničku kategoriju (svi nizovi, uključuju currentlyReading)
export async function addBookToUserCategory(
  userId: string,
  bookId: string,
  category: string // može biti "" za uklanjanje iz favorite
) {
  const space = await mgmtClient.getSpace(SPACE_ID);
  const environment = await space.getEnvironment("master");
  const userEntry = await environment.getEntry(userId);
  if (!userEntry) throw new Error("User not found");

  const fieldMapping: Record<string, string> = {
    wantToRead: "wantToRead",
    currentlyReading: "currentlyReading",
    read: "readBooks",
    favourites: "favourites",
  };

  if (category === "") {
    // ukloni knjigu iz favourites niza
    const favourites = userEntry.fields["favourites"]?.["en-US"] ?? [];
    const updatedFavourites = favourites.filter((item: any) => item.sys.id !== bookId);
    userEntry.fields["favourites"] = { "en-US": updatedFavourites };
  } else {
    const contentfulField = fieldMapping[category];
    if (!contentfulField) throw new Error(`Invalid category: ${category}`);

    // Svi su sada nizovi (uključujući currentlyReading)
    const currentBooks: any[] = Array.isArray(userEntry.fields[contentfulField]?.["en-US"])
      ? userEntry.fields[contentfulField]["en-US"]
      : [];

    const alreadyExists = currentBooks.some(item => item.sys.id === bookId);
    if (!alreadyExists) {
      currentBooks.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: bookId,
        },
      });
    }
    userEntry.fields[contentfulField] = { "en-US": currentBooks };
  }

  const updated = await userEntry.update();
  await updated.publish();

  console.log(`Book ${bookId} updated in user ${userId}'s category ${category}`);
}

// Premještanje knjige iz stare u novu kategoriju (svi nizovi)
export async function moveBookBetweenCategories(
  userId: string,
  bookId: string,
  oldCategory: string | null,
  newCategory: string
) {
  const space = await mgmtClient.getSpace(SPACE_ID);
  const environment = await space.getEnvironment("master");
  const userEntry = await environment.getEntry(userId);
  if (!userEntry) throw new Error("User not found");

  const fieldMapping: Record<string, string> = {
    wantToRead: "wantToRead",
    currentlyReading: "currentlyReading",
    read: "readBooks",
    favourites: "favourites",
  };

  // Uklanjanje iz stare kategorije (ako postoji)
  if (oldCategory && fieldMapping[oldCategory]) {
    const oldField = fieldMapping[oldCategory];

    const oldBooks: any[] = Array.isArray(userEntry.fields[oldField]?.["en-US"])
      ? userEntry.fields[oldField]["en-US"]
      : [];

    userEntry.fields[oldField] = {
      "en-US": oldBooks.filter(item => item.sys.id !== bookId),
    };
  }

  // Dodavanje u novu kategoriju (svi nizovi)
  if (fieldMapping[newCategory]) {
    const newField = fieldMapping[newCategory];

    const newBooks: any[] = Array.isArray(userEntry.fields[newField]?.["en-US"])
      ? userEntry.fields[newField]["en-US"]
      : [];

    if (!newBooks.some(item => item.sys.id === bookId)) {
      newBooks.push({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: bookId,
        },
      });
    }

    userEntry.fields[newField] = {
      "en-US": newBooks,
    };
  }

  const updated = await userEntry.update();
  await updated.publish();

  console.log(`Book ${bookId} moved from ${oldCategory} to ${newCategory} for user ${userId}`);
}

// Uklanjanje knjige iz kategorije (niz)
export async function removeBookFromCategory(
  userId: string,
  bookId: string,
  category: string
) {
  const space = await mgmtClient.getSpace(SPACE_ID);
  const environment = await space.getEnvironment("master");
  const userEntry = await environment.getEntry(userId);
  if (!userEntry) throw new Error("User not found");

  const fieldMapping: Record<string, string> = {
    wantToRead: "wantToRead",
    currentlyReading: "currentlyReading",
    read: "readBooks",
    favourites: "favourites",
  };

  const contentfulField = fieldMapping[category];
  if (!contentfulField) throw new Error(`Invalid category: ${category}`);

  const currentBooks: any[] = Array.isArray(userEntry.fields[contentfulField]?.["en-US"])
    ? userEntry.fields[contentfulField]["en-US"]
    : [];

  const updatedBooks = currentBooks.filter(item => item.sys.id !== bookId);

  userEntry.fields[contentfulField] = { "en-US": updatedBooks };

  const updated = await userEntry.update();
  await updated.publish();

  console.log(`Book ${bookId} removed from category ${category} for user ${userId}`);
}
