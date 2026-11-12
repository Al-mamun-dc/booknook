
import BorrowButton from '@/components/BorrowButton';

import { getTokenFromServer } from '@/lib/getTokenFromServer';

import Image from 'next/image';
import React from 'react';

const BooksDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const token= await getTokenFromServer()
    const res = await fetch(`http://localhost:8000/all-books/${id}`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    const data = await res.json();

    return (
        <div className="max-w-5xl mx-auto px-5 py-12">

            <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Book Image */}
                    <div className="flex justify-center">
                        <Image
                            src={data.imageUrl}
                            alt={data.title}
                            width={350}
                            height={350}
                            className="w-72 h-80 object-cover rounded-lg shadow-md"
                        />
                    </div>

                    {/* Book Information */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#0b3265] mb-2">
                            {data.title}
                        </h1>

                        <h2 className="text-xl font-semibold text-gray-700 mb-3">
                            Author: {data.author}
                        </h2>

                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm">
                            {data.category}
                        </span>

                        <p className="text-gray-600 mt-5 leading-7">
                            {data.Description}
                        </p>

                        <div className="flex items-center gap-2 mt-6 mb-4">
                            <h3 className="font-bold text-gray-800">
                                Total Copies:
                            </h3>

                            <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-md font-bold">
                                {data.totalCopies}
                            </span>
                        </div>

                        {/* Who Added This Book */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800">
                                Added By:
                            </h3>

                            <p className="text-gray-600 mt-1">
                                {data.addedBy || data.userName || 'Unknown'}
                            </p>
                        </div>

                        <BorrowButton
                            bookId={data._id}
                            bookTitle={data.title}
                            bookImage={data.imageUrl}
                        />
                    </div>

                </div>

                {/* Description */}
                <div className="mt-10 border-t pt-7">
                    <h2 className="text-2xl font-bold text-[#0b3265] mb-3">
                        Description
                    </h2>

                    <p className="text-gray-700 leading-8">
                        {data.description}
                    </p>
                </div>

            </div>

        </div>
    );
};

export default BooksDetailsPage;
