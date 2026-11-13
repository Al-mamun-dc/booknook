
"use client";

import { useEffect, useState } from "react";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

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
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Fetch My Books
    async function fetchBooks() {
        try {
            const token = await getTokenFromClient();

            if (!token) {
                setMessage("Please login first!");
                return;
            }

            const res = await fetch("http://localhost:8000/my-books", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

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

        setUpdating(true);

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
        } finally {
            setUpdating(false);
        }
    }

    // Delete Book
    async function handleDelete() {
        if (!deleteBook) return;

        setDeleting(true);

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
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-lg font-semibold text-blue-950">
                    Loading books...
                </p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-10">
            <section className="mx-auto max-w-6xl">

                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-950 sm:text-4xl">
                        My Books
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage the books you have added.
                    </p>
                </div>

                {/* Message */}
                {message && (
                    <div className="mb-6 rounded-lg bg-green-100 p-3 text-sm font-medium text-green-700">
                        {message}
                    </div>
                )}

                {/* Books Grid */}
                {books.length === 0 ? (
                    <div className="rounded-xl bg-white p-10 text-center shadow-sm">
                        <p className="text-lg text-gray-500">
                            You have not added any books yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {books.map((book) => (
                            <div
                                key={book._id}
                                className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Book Image */}
                                <div className="flex h-52 w-full items-center justify-center overflow-hidden bg-gray-100">
                                    {book.imageUrl ? (
                                        <img
                                            src={book.imageUrl}
                                            alt={book.title}
                                            className="h-full w-full object-contain"
                                        />
                                    ) : (
                                        <div className="text-gray-400">
                                            No Image Available
                                        </div>
                                    )}
                                </div>

                                {/* Book Information */}
                                <div className="flex flex-1 flex-col p-5">

                                    <h2 className="line-clamp-1 text-xl font-bold text-blue-950">
                                        {book.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-600">
                                        <span className="font-semibold">
                                            Author:
                                        </span>{" "}
                                        {book.author}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                        <span className="font-semibold">
                                            Category:
                                        </span>{" "}
                                        {book.category}
                                    </p>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                                        {book.description}
                                    </p>

                                    {/* Buttons */}
                                    <div className="mt-auto flex gap-3 pt-5">

                                        <button
                                            onClick={() =>
                                                setEditBook({ ...book })
                                            }
                                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                setDeleteBook(book)
                                            }
                                            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}
            </section>

            {/* Edit Modal */}
            {editBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4">

                    <form
                        onSubmit={handleUpdate}
                        className="my-auto max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold text-blue-950">
                            Edit Book
                        </h2>

                        <input
                            required
                            value={editBook.title}
                            onChange={(e) =>
                                setEditBook({
                                    ...editBook,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Book Title"
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
                        />

                        <input
                            required
                            value={editBook.author}
                            onChange={(e) =>
                                setEditBook({
                                    ...editBook,
                                    author: e.target.value,
                                })
                            }
                            placeholder="Author"
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
                        />

                        <input
                            required
                            value={editBook.category}
                            onChange={(e) =>
                                setEditBook({
                                    ...editBook,
                                    category: e.target.value,
                                })
                            }
                            placeholder="Category"
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
                        />

                        <input
                            required
                            type="url"
                            value={editBook.imageUrl}
                            onChange={(e) =>
                                setEditBook({
                                    ...editBook,
                                    imageUrl: e.target.value,
                                })
                            }
                            placeholder="Image URL"
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
                        />

                        <textarea
                            required
                            value={editBook.description}
                            onChange={(e) =>
                                setEditBook({
                                    ...editBook,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Description"
                            rows={4}
                            className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-blue-500"
                        />

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                            <button
                                type="submit"
                                disabled={updating}
                                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {updating ? "Updating..." : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setEditBook(null)}
                                className="flex-1 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                        </div>
                    </form>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">

                        <h2 className="text-xl font-bold text-gray-900">
                            Delete Book?
                        </h2>

                        <p className="my-4 text-gray-600">
                            Are you sure you want to delete{" "}
                            <strong>{deleteBook.title}</strong>?
                        </p>

                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setDeleteBook(null)}
                                disabled={deleting}
                                className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Confirm Delete"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
