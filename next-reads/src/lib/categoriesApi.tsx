import * as contentfulManagement from "contentful-management";

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const mgmtClient = contentfulManagement.createClient({
  accessToken: ACCESS_TOKEN,
});

export async function addBookToUserCategory(
  userId: string,
  bookId: string,
  category: string // može biti "" za uklanjanje
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
    // ukloni knjigu iz favorite niza
    const favourites = userEntry.fields["favourites"]?.["en-US"] ?? [];
    const updatedFavourites = favourites.filter((item: any) => item.sys.id !== bookId);
    userEntry.fields["favourites"] = { "en-US": updatedFavourites };
  } else {
    const contentfulField = fieldMapping[category];
    if (!contentfulField) throw new Error(`Invalid category: ${category}`);

    if (category === "currentlyReading") {
      userEntry.fields[contentfulField] = {
        "en-US": {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: bookId,
          },
        },
      };
    } else {
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
  }

  const updated = await userEntry.update();
  await updated.publish();

  console.log(`Book ${bookId} updated in user ${userId}'s category ${category}`);
}


export async function getUserBookCategories (
  userId: string,
  bookId: string
): Promise<string[]> {
  try {
    const space = await mgmtClient.getSpace(SPACE_ID);
    const environment = await space.getEnvironment("master");
    const userEntry = await environment.getEntry(userId);
    if (!userEntry) throw new Error("User not found");

    const categories: string[] = [];

    // Mapiranje polja u Contentfulu
    const fieldMapping: Record<string, string> = {
      wantToRead: "wantToRead",
      currentlyReading: "currentlyReading",
      read: "readBooks",
      favourites: "favourites",
    };

    // Prođi svako polje i vidi je li bookId unutra
    for (const [key, contentfulField] of Object.entries(fieldMapping)) {
      const fieldValue = userEntry.fields[contentfulField]?.["en-US"];

      if (!fieldValue) continue;

      if (Array.isArray(fieldValue)) {
        // polja tipa niz linkova
        if (fieldValue.some((item: any) => item.sys.id === bookId)) {
          categories.push(key);
        }
      } else if (fieldValue.sys?.id === bookId) {
        // polje tipa pojedinačni link
        categories.push(key);
      }
    }

    return categories;
  } catch (error) {
    console.error("Error fetching user book categories:", error);
    return [];
  }
}
