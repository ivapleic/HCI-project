import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeAuthorFields {
    fullName: EntryFieldTypes.Symbol;
    bio?: EntryFieldTypes.Text;
    profileImage?: EntryFieldTypes.AssetLink;
    nationality?: EntryFieldTypes.Symbol;
    books?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeBooksSkeleton>>;
    dateOfBirth?: EntryFieldTypes.Symbol;
}

export type TypeAuthorSkeleton = EntrySkeletonType<TypeAuthorFields, "author">;
export type TypeAuthor<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeAuthorSkeleton, Modifiers, Locales>;

export interface TypeBooksFields {
    title: EntryFieldTypes.Symbol;
    coverImage?: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
    rating?: EntryFieldTypes.Number;
    author?: EntryFieldTypes.EntryLink<TypeAuthorSkeleton>;
    language: EntryFieldTypes.Symbol;
    isbn: EntryFieldTypes.Symbol;
    publicationYear?: EntryFieldTypes.Integer;
    genre: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGenreSkeleton>>;
}

export type TypeBooksSkeleton = EntrySkeletonType<TypeBooksFields, "books">;
export type TypeBooks<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBooksSkeleton, Modifiers, Locales>;

export interface TypeGenreFields {
    name: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
      coverImage: EntryFieldTypes.AssetLink;  

}

export type TypeGenreSkeleton = EntrySkeletonType<TypeGenreFields, "genre">;
export type TypeGenre<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeGenreSkeleton, Modifiers, Locales>;

export interface TypeListFields {
    name: EntryFieldTypes.Symbol;
    description?: EntryFieldTypes.RichText;
    genres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGenreSkeleton>>;
    tag?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTagSkeleton>>;
    books?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeBooksSkeleton>>;
}

export type TypeListSkeleton = EntrySkeletonType<TypeListFields, "list">;
export type TypeList<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeListSkeleton, Modifiers, Locales>;

export interface TypeUserFields {
  fullName: EntryFieldTypes.Symbol;
  email: EntryFieldTypes.Symbol;
  password: EntryFieldTypes.Symbol;
  profilePicture?: EntryFieldTypes.AssetLink;
  bio?: EntryFieldTypes.Text;
  favoriteGenres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGenreSkeleton>>;
  joinedDate: EntryFieldTypes.Date;
  accountStatus: EntryFieldTypes.Boolean;
  favourites?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeBooksSkeleton>>;
  wantToRead?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeBooksSkeleton>>;
  readBooks?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeBooksSkeleton>>;
  currentlyReading?: EntryFieldTypes.EntryLink<TypeBooksSkeleton>;
}

export type TypeUserSkeleton = EntrySkeletonType<TypeUserFields, "user">;
export type TypeUser<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeUserSkeleton, Modifiers, Locales>;

export interface TypeTagFields {
    tagName: EntryFieldTypes.Symbol;

}

export type TypeTagSkeleton = EntrySkeletonType<TypeTagFields, "tag">;
export type TypeTag<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeTagSkeleton, Modifiers, Locales>;

export interface TypeSeriesFields {
  title: EntryFieldTypes.Symbol;
  author: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAuthorSkeleton>>;
  books: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeBooksSkeleton>>;
  description?: EntryFieldTypes.RichText;
  coverImage?: EntryFieldTypes.AssetLink;
  genres?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGenreSkeleton>>;
}

export type TypeSeriesSkeleton = EntrySkeletonType<TypeSeriesFields, "series">;
export type TypeSeries<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeSeriesSkeleton, Modifiers, Locales>;