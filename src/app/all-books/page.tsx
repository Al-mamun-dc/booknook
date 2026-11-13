
import BookList from "@/components/BookList";


const AllBooksPage = async () => {

  

  const res = await fetch("http://localhost:8000/all-books", {
   cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await res.json();

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-950">
            Explore Our Books
          </h1>
          <p className="mt-2 text-gray-500">
            Discover your next favorite book from our collection.
          </p>
        </div>

        <BookList books={data} />
      </section>
    </main>
  );
};

export default AllBooksPage;
