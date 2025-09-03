import Link from "next/link";
import { getUserById } from "../_lib/UserApi";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserById(params.userId);

  if (!user) {
    return (
      <div className="w-full mt-2 sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px]">
        <div className="sm:bg-neutral-white sm:rounded-2xl sm:shadow-lg p-6 text-center">
          <p className="text-secondary-dark">User not found.</p>
        </div>
      </div>
    );
  }

  const profilePicUrl = user.fields.profilePicture?.fields?.file?.url
    ? `https:${user.fields.profilePicture.fields.file.url}`
    : null;

  // Preview knjiga - prikaz do 3 knjige iz kategorija
  const favourites = user.fields.favourites?.slice(0, 5) || [];
  const currentlyReading = user.fields.currentlyReading?.slice(0, 5) || [];
  const wantToRead = user.fields.wantToRead?.slice(0, 5) || [];

  const renderBookPreview = (book: any) => {
    if (!book || !book.fields) {
      return (
        <div key={book?.sys?.id || Math.random()} className="w-20 h-28 bg-neutral-light rounded-md" />
      );
    }

    const imgUrl = book.fields.coverImage?.fields?.file?.url
      ? `https:${book.fields.coverImage.fields.file.url}`
      : "/assets/book-placeholder.png";

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
    <div className="w-full mt-2 sm:mt-6 mb-0 sm:mb-20 px-0 md:px-20 md:mx-auto md:max-w-[1200px]">
      <div className="sm:bg-neutral-white sm:rounded-2xl sm:shadow-lg p-6">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-neutral text-center md:text-left">
          Your Profile
        </h2>

        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
          {/* Slika profila */}
          <div className="flex-shrink-0 mb-6 md:mb-0">
            {profilePicUrl ? (
              <img
                src={profilePicUrl}
                alt="Profile picture"
                width={160}
                height={160}
                className="rounded-md object-cover shadow-md"
              />
            ) : (
              <div className="w-40 h-40 bg-accent-pink rounded-md flex items-center justify-center text-4xl font-bold text-neutral">
                {user.fields.fullName!
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-neutral-dark">{user.fields.fullName}</h2>

            <p className="text-neutral-dark mb-2">
              <strong>Email:</strong> {user.fields.email}
            </p>
            <p className="text-neutral-dark mb-4">
              <strong>Account Status:</strong>{" "}
              {user.fields.accountStatus ? "Active" : "Inactive"}
            </p>
            <p className="text-neutral-dark mb-6">
              <strong>Joined on:</strong>{" "}
              {new Date(user.fields.joinedDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            {user.fields.favoriteGenres && user.fields.favoriteGenres.length > 0 && (
              <div className="mb-6">
                <strong className="block mb-2 text-neutral-dark">Favorite Genres:</strong>
                <div className="flex flex-wrap gap-3">
                  {user.fields.favoriteGenres.map((genre: any) => {
                    const genreTitle = genre.fields?.title || genre.fields?.name || "genre";
                    const genreIdOrSlug = genreTitle.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <Link
                        key={genre.sys?.id || genreTitle}
                        href={`/genres/${genreIdOrSlug}`}
                        className="text-neutral-dark px-3 py-1 bg-accent-pink rounded-full font-medium hover:bg-neutral-light transition lowercase"
                      >
                        {genreTitle.toLowerCase()}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {user.fields.bio && (
              <div className="whitespace-pre-line text-neutral-dark mb-8">
                <strong className="text-neutral-dark">About Me:</strong>
                <p className="mt-2">{user.fields.bio}</p>
              </div>
            )}

            {/* Preview knjiga iz kategorija */}
            <div className="space-y-6">
              {favourites.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Favourites</h3>
                  <div className="flex space-x-4 overflow-x-auto pb-2">{favourites.map(renderBookPreview)}</div>
                </div>
              )}

              {currentlyReading.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Currently Reading</h3>
                  <div className="flex space-x-4 overflow-x-auto pb-2">{currentlyReading.map(renderBookPreview)}</div>
                </div>
              )}

              {wantToRead.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-neutral-dark">Want To Read</h3>
                  <div className="flex space-x-4 overflow-x-auto pb-2">{wantToRead.map(renderBookPreview)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}