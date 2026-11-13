
import Image from "next/image";
import Link from "next/link";

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    imageUrl: string;
};

export default async function NewArrivals() {
    const res = await fetch("http://localhost:8000/new-arrivals", {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch new arrivals");
    }

    const books: Book[] = await res.json();

    return (
        <section className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="mb-6 border-l-4 border-blue-600 pl-3 text-2xl font-bold text-blue-950">
                New Arrivals
            </h2>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-6">
                {books.map((book) => (
                    <div
                        key={book._id}
                        className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
                    >
                        {book.imageUrl ? (
                            <div className="relative h-36 w-full overflow-hidden rounded-md">
                                <Image
                                    src={book.imageUrl}
                                    alt={book.title}
                                    fill
                                    sizes="(max-width: 640px) 50vw, 300px"
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        ) : (
                            <div className="flex h-36 w-full items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
                                No Image
                            </div>
                        )}

                        <h3 className="mt-3 truncate text-sm font-bold text-blue-950">
                            {book.title}
                        </h3>

                        <p className="mt-1 truncate text-xs text-gray-600">
                            {book.author}
                        </p>

                        <p className="text-xs text-gray-600">
                            {book.category}
                        </p>

                        <Link
                            href={`/books/${book._id}`}
                            className="mt-3 block rounded-md bg-blue-600 px-2 py-2 text-center text-xs font-semibold text-white hover:bg-blue-700"
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-7 text-center">
                <Link
                    href="/all-books"
                    className="inline-block rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    See All Books
                </Link>
            </div>
        </section>
    );
}
