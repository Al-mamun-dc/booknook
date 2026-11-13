
const ExtraSections = () => {
    return (
        <>
            {/* How Borrowing Works */}
            <section className="bg-blue-50 px-4 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 text-center">
                        <p className="mb-2 font-semibold uppercase tracking-wider text-blue-600">
                            Simple Process
                        </p>
                        <h2 className="text-3xl font-bold text-blue-950">
                            How Borrowing Works
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Borrow your favorite books in just three simple steps.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl bg-white p-7 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                                🔍
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-blue-950">
                                01. Discover Books
                            </h3>
                            <p className="text-sm leading-6 text-gray-600">
                                Explore our collection and find the books you love.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-7 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                                📚
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-blue-950">
                                02. Borrow a Book
                            </h3>
                            <p className="text-sm leading-6 text-gray-600">
                                Select your favorite book and confirm your borrowing request.
                            </p>
                        </div>

                        <div className="rounded-xl bg-white p-7 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                                ❤️
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-blue-950">
                                03. Enjoy Reading
                            </h3>
                            <p className="text-sm leading-6 text-gray-600">
                                Enjoy your reading journey and return the book on time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Explore Top Categories */}
            <section className="bg-white px-4 py-16">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-10 text-center">
                        <p className="mb-2 font-semibold uppercase tracking-wider text-blue-600">
                            Find Your Interest
                        </p>
                        <h2 className="text-3xl font-bold text-blue-950">
                            Explore Top Categories
                        </h2>
                        <p className="mt-3 text-gray-600">
                            Discover something new from our popular book categories.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5">
                        {[
                            { name: "Fiction", icon: "📖" },
                            { name: "Mystery", icon: "🔎" },
                            { name: "Fantasy", icon: "🧙" },
                            { name: "Romance", icon: "❤️" },
                            { name: "Science Fiction", icon: "🚀" },
                            { name: "Biography", icon: "👤" },
                            { name: "History", icon: "🏛️" },
                            { name: "Self-Help", icon: "🌱" },
                            { name: "Non-Fiction", icon: "📚" },
                            { name: "Children", icon: "🧸" },
                        ].map((category) => (
                            <div
                                key={category.name}
                                className="rounded-xl border border-gray-200 p-6 text-center transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"
                            >
                                <div className="mb-3 text-4xl">
                                    {category.icon}
                                </div>
                                <h3 className="font-semibold text-blue-950">
                                    {category.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ExtraSections;
