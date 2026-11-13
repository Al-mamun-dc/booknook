
"use client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface BorrowedBook {
    _id: string;
    bookId: string;
    bookTitle: string;
    bookImage: string;
    userEmail: string;
    borrowDate: string;
    returnDate: string;
}

const MyBorrowsPage = () => {

    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();

    const [books, setBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [returningId, setReturningId] = useState<string | null>(null);

    const user = session?.user;

    useEffect(() => {

        if (isPending) return;

        if (!user?.email) {
            router.push("/signin");
            return;
        }

        const fetchBooks = async () => {
            try {
                const token = await getTokenFromClient();

                if (!token) {
                    router.push("/signin");
                    return;
                }

                const res = await fetch(
                   `${process.env.NEXT_PUBLIC_URI_SERVER}/my-borrows`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch borrowed books");
                }

                const data = await res.json();

                setBooks(data);

            } catch (error) {
                console.log(error);
                toast.error("Could not load borrowed books!");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();

    }, [user?.email, isPending, router]);

    const handleReturn = async (id: string) => {

        if (!user?.email) return;

        try {
            setReturningId(id);

            const token = await getTokenFromClient();

            if (!token) {
                router.push("/signin");
                return;
            }

            const res = await fetch(
               `${process.env.NEXT_PUBLIC_URI_SERVER}/return-book/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Return failed!");
                return;
            }

            setBooks((previousBooks) =>
                previousBooks.filter((book) => book._id !== id)
            );

            toast.success("Book returned successfully!");

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");

        } finally {
            setReturningId(null);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (isPending || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold text-blue-900">
                    Loading borrowed books...
                </p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-8">

            <section className="max-w-6xl mx-auto">

                <div className="text-center mb-10">

                    <h1 className="text-3xl font-bold text-blue-950">
                        My Borrowed Books
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your borrowed books and return them when finished.
                    </p>

                </div>

                <div className="bg-white rounded-xl shadow-md border border-blue-100 overflow-hidden">

                    {books.length === 0 ? (

                        <div className="py-16 text-center">

                            <h2 className="text-xl font-semibold text-gray-700">
                                No Borrowed Books Found
                            </h2>

                            <p className="text-gray-500 mt-2">
                                You  haven&apos;t borrowed any books yet.
                            </p>

                            <Link href="/all-books"
                                onClick={() => router.push("/books")}
                                className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            >
                                Explore Books
                            </Link>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left">

                                <thead className="bg-blue-950 text-white">

                                    <tr>
                                        <th className="px-6 py-4">Image</th>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Borrow Date</th>
                                        <th className="px-6 py-4">Return Date</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {books.map((book) => (

                                        <tr
                                            key={book._id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4">

                                                <img
                                                    src={book.bookImage}
                                                    alt={book.bookTitle}
                                                    className="w-14 h-16 object-cover rounded-md"
                                                />

                                            </td>

                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                {book.bookTitle}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                {formatDate(book.borrowDate)}
                                            </td>

                                            <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                                {formatDate(book.returnDate)}
                                            </td>

                                            <td className="px-6 py-4">

                                                <button
                                                    onClick={() => handleReturn(book._id)}
                                                    disabled={returningId === book._id}
                                                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                                                >
                                                    {returningId === book._id
                                                        ? "Returning..."
                                                        : "Return Book"}
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </section>

        </main>
    );
};

export default MyBorrowsPage;
