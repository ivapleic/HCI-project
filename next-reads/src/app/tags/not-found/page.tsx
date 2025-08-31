"use client";
import Link from "next/link";
import TagsList from "../../components/TagsList/TagsList";
import { useEffect, useState } from "react";
import { getAllTags } from "../_lib/TagsApi";

export default function NotFoundPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getAllTags();
       setTags(tagsData);
      } catch (error) {
        setTags([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);

  return (
    <div className="w-full px-4 md:px-20 mx-0 my-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Lijevi blok: Not found poruka */}
        <div className="relative md:col-span-2 flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-md p-8">
          <Link
            href="/lists"
            className="absolute top-8 left-8 inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to Lists
          </Link>
          <div className="flex flex-col items-center justify-center w-full">
            <h2 className="text-4xl font-bold text-[#593E2E] mb-4 mt-16">
              Tag Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The tag you searched for does not exist in our library.
            </p>
          </div>
        </div>

        {/* Desni blok: Lista žanrova */}
        <div>
          {loading ? (
            <div className="text-center text-lg">Loading tags...</div>
          ) : (
            <TagsList tags={tags} />
          )}
        </div>
      </div>
    </div>
  );
}
