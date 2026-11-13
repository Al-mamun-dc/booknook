
"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "react-toastify";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface BorrowButtonProps {
    bookId: string;
    bookTitle: string;
    bookImage: string;
}

const BorrowButton = ({
    bookId,
    bookTitle,
    bookImage
}: BorrowButtonProps) => {

    const { data: session, isPending } = authClient.useSession();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = session?.user;

    const handleBorrow = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        if (!user?.email) {
            toast.error("Please login first!");
            return;
        }

        try {
            setLoading(true);

            const token = await getTokenFromClient();

            if (!token) {
                toast.error("Please login first!");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_URI_SERVER}/borrow-books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookId,
                    bookTitle,
                    bookImage,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Borrow failed!");
                return;
            }

            toast.success("Book borrowed successfully!");
            setOpen(false);

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (isPending) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <button
                onClick={() => {
                    if (!user) {
                        toast.error("Please login first!");
                        return;
                    }

                    setOpen(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
                📖 Borrow This Book
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

                    <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">

                        <h2 className="text-2xl font-bold text-blue-950 mb-2">
                            Borrow This Book
                        </h2>

                        <p className="text-gray-500 mb-6">
                            Confirm your information before borrowing.
                        </p>

                        <form onSubmit={handleBorrow}>

                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    Book Title
                                </label>

                                <input
                                    type="text"
                                    value={bookTitle}
                                    readOnly
                                    className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    User Name
                                </label>

                                <input
                                    type="text"
                                    value={user?.name || ""}
                                    readOnly
                                    className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block font-semibold text-gray-700 mb-2">
                                    User Email
                                </label>

                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    readOnly
                                    className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-gray-600"
                                />
                            </div>

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    disabled={loading}
                                    className="w-1/2 border border-gray-300 rounded-lg py-3 font-semibold hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg py-3 font-semibold"
                                >
                                    {loading ? "Borrowing..." : "Confirm Borrow"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}
        </>
    );
};

export default BorrowButton;
