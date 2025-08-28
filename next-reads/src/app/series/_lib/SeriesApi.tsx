import contentfulClient from "../../../lib/contentfulClient";
import { TypeSeriesSkeleton } from "../../../content-types";


// Funkcija za dohvat svih serijala
export const getSeriesList = async () => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeSeriesSkeleton>({
      content_type: "series",
      select: ["fields", "sys.id"],
      include: 2, 
    });

    return data.items; 
  } catch (error) {
    console.error("Greška pri dohvaćanju serijala:", error);
    return [];
  }
};

// Funkcija koja dohvaća seriju kojoj pripada knjiga po ID-u knjige
export const getSeriesByBookId = async (bookId: string) => {
  try {
    const allSeries = await getSeriesList();

    const foundSeries = allSeries.find((series:any) =>
      series.fields.books?.some((bookRef: any) => bookRef.sys.id === bookId)
    );

    return foundSeries || null;
  } catch (error) {
    console.error("Greška pri pronalasku serije za knjigu:", error);
    return null;
  }
};

// Funkcija za dohvat serijala po njegovom ID-u
export const getSeriesById = async (seriesId: string) => {
  try {
    const entry = await contentfulClient.withoutUnresolvableLinks.getEntry<TypeSeriesSkeleton>(seriesId, {
      include: 2, // Povuci povezane reference poput knjiga i ostalih povezanih entiteta
    });
    return entry;
  } catch (error) {
    console.error(`Greška pri dohvaćanju serijala s ID-om ${seriesId}:`, error);
    return null;
  }
};
