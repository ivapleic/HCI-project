import Link from "next/link";
import { getUserById } from "../_lib/UserApi";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserById(params.userId);

  if (!user) {
    return <div className="p-8 text-red-600">User not found.</div>;
  }

  const profilePicUrl = user.fields.profilePicture?.fields?.file?.url
    ? `https:${user.fields.profilePicture.fields.file.url}`
    : null;

  // Preview knjiga - prikaz do 3 knjige iz kategorija
  const favourites = user.fields.favourites?.slice(0, 3) || [];
  const currentlyReading = user.fields.currentlyReading ? [user.fields.currentlyReading] : [];
  const wantToRead = user.fields.wantToRead?.slice(0, 3) || [];

  const renderBookPreview = (book: any) => {
    const imgUrl = book.fields.coverImage?.fields?.file?.url
      ? `https:${book.fields.coverImage.fields.file.url}`
      : "/placeholder_book.png";
    return (
      <Link key={book.sys.id} href={`/books/${book.sys.id}`}>
        <img
          src={imgUrl}
          alt={book.fields.title}
          className="w-20 h-28 object-cover rounded-md shadow cursor-pointer"
        />
      </Link>
    );
  };

  return (
    <div className="p-8 flex flex-col md:flex-row justify-center bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full px-6 py-8">
        <h1 className="text-4xl font-extrabold mb-10 text-[#593E2E] text-center md:text-left">
          Your Profile
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
          {/* Slika profila */}
          <div className="flex-shrink-0 mb-6 md:mb-0">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt="Profile picture"
                width={160}
                height={160}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-300 rounded-md flex items-center justify-center text-6xl font-bold text-gray-600">
                {user.fields.fullName!
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <h2 className="text-3xl font-bold mb-6">{user.fields.fullName}</h2>

            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {user.fields.email}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Account Status:</strong>{" "}
              {user.fields.accountStatus ? "Active" : "Inactive"}
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Joined on:</strong>{" "}
              {new Date(user.fields.joinedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {user.fields.favoriteGenres && user.fields.favoriteGenres.length > 0 && (
              <div className="mb-6">
                <strong className="block mb-2 text-gray-900">Favorite Genres:</strong>
                <div className="flex flex-wrap gap-3">
                  {user.fields.favoriteGenres.map((genre: any) => {
                    const genreTitle = genre.fields?.title || genre.fields?.name || "genre";
                    const genreIdOrSlug = genreTitle.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link
                        key={genre.sys?.id || genreTitle}
                        href={`/genres/${genreIdOrSlug}`}
                        className="text-[#593E2E] px-3 py-1 bg-[#E8DFD7] rounded-full font-medium hover:bg-[#cdbda7] transition lowercase"
                      >
                        {genreTitle.toLowerCase()}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {user.fields.bio && (
              <div className="whitespace-pre-line text-gray-800 mb-8">
                <strong>About Me:</strong>
                <p className="mt-2">{user.fields.bio}</p>
              </div>
            )}

            {/* Preview knjiga iz kategorija */}
            <div className="space-y-6">
              {favourites.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#593E2E]">Favourites</h3>
                  <div className="flex space-x-4">{favourites.map(renderBookPreview)}</div>
                </div>
              )}

              {currentlyReading.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#593E2E]">Currently Reading</h3>
                  <div className="flex space-x-4">{currentlyReading.map(renderBookPreview)}</div>
                </div>
              )}

              {wantToRead.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#593E2E]">Want To Read</h3>
                  <div className="flex space-x-4">{wantToRead.map(renderBookPreview)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
