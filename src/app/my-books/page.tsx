
"use client";

import { useEffect, useState } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import Image from "next/image";

type Book = {
    _id: string;
    title: string;
    author: string;
    category: string;
    imageUrl: string;
    description: string;
    userName: string;
    userEmail: string;
};

export default function MyBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [deleteBook, setDeleteBook] = useState<Book | null>(null);
    const [message, setMessage] = useState("");

    // Fetch My Books
    async function fetchBooks() {
        try {
            const token = await getTokenFromClient();

            if (!token) {
                setMessage("Please login first!");
                return;
            }

            const res = await fetch(
                "http://localhost:8000/my-books",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to load books");
            }

            setBooks(data);

        } catch (error) {
            console.log("Error loading books:", error);
            setMessage("Failed to load books!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadBooks = async () => {
            await fetchBooks();
        };

        loadBooks();
    }, []);

    // Update Book
    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!editBook) return;

        try {
            const token = await getTokenFromClient();

            if (!token) {
                setMessage("Please login first!");
                return;
            }

            const res = await fetch(
                `http://localhost:8000/all-books/${editBook._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: editBook.title,
                        author: editBook.author,
                        category: editBook.category,
                        imageUrl: editBook.imageUrl,
                        description: editBook.description,
                    }),
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Update failed");
            }

            setBooks((previous) =>
                previous.map((book) =>
                    book._id === editBook._id ? editBook : book
                )
            );

            setEditBook(null);
            setMessage("Book updated successfully!");

            setTimeout(() => setMessage(""), 2500);

        } catch (error) {
            console.log("Error updating book:", error);
            setMessage("Failed to update book!");
        }
    }

    // Delete Book
    async function handleDelete() {
        if (!deleteBook) return;

        try {
            const token = await getTokenFromClient();

            if (!token) {
                setMessage("Please login first!");
                return;
            }

            const res = await fetch(
                `http://localhost:8000/all-books/${deleteBook._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Delete failed");
            }

            setBooks((previous) =>
                previous.filter((book) => book._id !== deleteBook._id)
            );

            setDeleteBook(null);
            setMessage("Book deleted successfully!");

            setTimeout(() => setMessage(""), 2500);

        } catch (error) {
            console.log("Error deleting book:", error);
            setMessage("Failed to delete book!");
        }
    }

    if (loading) {
        return <p className="py-20 text-center">Loading books...</p>;
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <section className="mx-auto max-w-6xl">
                <h1 className="mb-2 text-3xl font-bold text-blue-950">
                    My Books
                </h1>

                <p className="mb-8 text-gray-600">
                    Manage the books you have added.
                </p>

                {message && (
                    <p className="mb-5 rounded-md bg-green-100 p-3 text-green-700">
                        {message}
                    </p>
                )}

                {books.length === 0 ? (
                    <p className="rounded-lg bg-white p-8 text-center text-gray-500">
                        You have not added any books yet.
                    </p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="rounded-lg border bg-white p-4 shadow-sm"
                            >
                                {book.imageUrl ? (
                                    <Image
                                        src={book.imageUrl}
                                        alt={book.title}
                                        width={400}
                                        height={250}
                                        className="h-48 w-full rounded-md object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
                                        No Image
                                    </div>
                                )}

                                <h2 className="mt-3 text-xl font-bold text-blue-950">
                                    {book.title}
                                </h2>

                                <p className="text-sm text-gray-600">
                                    Author: {book.author}
                                </p>

                                <p className="text-sm text-gray-600">
                                    Category: {book.category}
                                </p>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => setEditBook({ ...book })}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => setDeleteBook(book)}
                                        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Edit Modal */}
            {editBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <form
                        onSubmit={handleUpdate}
                        className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-xl bg-white p-6"
                    >
                        <h2 className="text-2xl font-bold text-blue-950">
                            Edit Book
                        </h2>

                        <input
                            required
                            value={editBook.title}
                            onChange={(e) =>
                                setEditBook({ ...editBook, title: e.target.value })
                            }
                            placeholder="Book Title"
                            className="w-full rounded-md border p-3"
                        />

                        <input
                            required
                            value={editBook.author}
                            onChange={(e) =>
                                setEditBook({ ...editBook, author: e.target.value })
                            }
                            placeholder="Author"
                            className="w-full rounded-md border p-3"
                        />

                        <input
                            required
                            value={editBook.category}
                            onChange={(e) =>
                                setEditBook({ ...editBook, category: e.target.value })
                            }
                            placeholder="Category"
                            className="w-full rounded-md border p-3"
                        />

                        <input
                            required
                            value={editBook.imageUrl}
                            onChange={(e) =>
                                setEditBook({ ...editBook, imageUrl: e.target.value })
                            }
                            placeholder="Image URL"
                            className="w-full rounded-md border p-3"
                        />

                        <textarea
                            required
                            value={editBook.description}
                            onChange={(e) =>
                                setEditBook({ ...editBook, description: e.target.value })
                            }
                            placeholder="Description"
                            className="w-full rounded-md border p-3"
                            rows={4}
                        />

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-5 py-2 text-white"
                            >
                                Save Changes
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditBook(null)}
                                className="rounded-md border px-5 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            Delete Book?
                        </h2>

                        <p className="my-4 text-gray-600">
                            Are you sure you want to delete{" "}
                            <strong>{deleteBook.title}</strong>?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteBook(null)}
                                className="rounded-md border px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-white"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
