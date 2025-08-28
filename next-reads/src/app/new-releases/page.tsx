import React, { Suspense } from "react";
import NewReleasesList from "./NewReleases";

export default function NewReleasesPage() {
  return (
    <Suspense fallback={<div>Loading new releases...</div>}>
      <NewReleasesList />
    </Suspense>
  );
}
