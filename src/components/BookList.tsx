
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    imageUrl: string;
    description: string;
};

export default function BookList({ books }: { books: Book[] }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");

    const categories = [
        "All Categories",
        ...new Set(books.map((book) => book.category).filter(Boolean)),
    ];

    const filteredBooks = books.filter((book) => {
        const matchSearch =
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            category === "All Categories" || book.category === category;

        return matchSearch && matchCategory;
    });

    return (
        <section>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                <input
                    type="text"
                    placeholder="Search books by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-blue-500"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 rounded-lg border border-gray-300 bg-white px-4 sm:w-56"
                >
                    {categories.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
            </div>

            <p className="mb-5 text-sm text-gray-500">
                Showing {filteredBooks.length} books
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {filteredBooks.map((book) => (
                    <div
                        key={book._id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex justify-center">
                            {book.imageUrl ? (
                                <Image
                                    src={book.imageUrl}
                                    alt={book.title}
                                    width={160}
                                    height={192}
                                    className="h-48 w-40 rounded-md object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-48 w-40 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
                                    No Image Available
                                </div>
                            )}
                        </div>

                        <div className="mt-3">
                            <h2 className="text-lg font-bold text-blue-950">
                                {book.title}
                            </h2>

                            <p className="text-sm text-gray-600">{book.category}</p>

                            <p className="mt-1 text-sm text-gray-500">
                                By {book.author}
                            </p>

                            <Link
                                href={`/books/${book._id}`}
                                className="mt-3 block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBooks.length === 0 && (
                <p className="py-12 text-center text-gray-500">
                    No books found.
                </p>
            )}
        </section>
    );
}
