import contentfulClient from "../../../lib/contentfulClient";
import { Entry } from "contentful";
import { TypeTagSkeleton } from "../../../content-types";

// ✅ 1. Dohvaćanje svih tagova
export const getAllTags = async (): Promise<Entry<TypeTagSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>[]> => {
  try {
    const data = await contentfulClient.withoutUnresolvableLinks.getEntries<TypeTagSkeleton>({
      content_type: "tag", 
      select: ["fields.tagName", "sys.id"],  
    });

    return data.items;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
};
