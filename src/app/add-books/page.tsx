"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const categories = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Biography",
    "History",
    "Self-Help",
    "Children",
]

type FormValues = {
    title: string
    author: string
    category: string
    imageUrl: string
    description: string
    userName: string
    userEmail: string
}

// User name/email come pre-filled — the borrower adding the book on behalf
// of a user can leave them unchanged.
const initialValues: FormValues = {
    title: "",
    author: "",
    category: "",
    imageUrl: "",
    description: "",
    userName: "Manjun",
    userEmail: "manjun@gmail.com",
}

const requiredFields: (keyof FormValues)[] = [
    "title",
    "author",
    "category",
    "imageUrl",
    "description",
]

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
    return (
        <Label htmlFor={htmlFor} className="text-sm font-semibold text-blue-950">
            {children} <span className="text-red-500">*</span>
        </Label>
    )
}

function FieldError({ message }: { message: string }) {
    return <p className="text-xs font-medium text-red-500">{message}</p>
}

export default function AddBook() {
    const [values, setValues] = React.useState<FormValues>(initialValues)
    const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, boolean>>>({})
    const [added, setAdded] = React.useState<string | null>(null)

    function update(field: keyof FormValues, value: string) {
        setValues((current) => ({ ...current, [field]: value }))
        if (errors[field]) {
            setErrors((current) => ({ ...current, [field]: undefined }))
        }
    }


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // 1. প্রথমে validation check
        const missing = requiredFields.filter(
            (field) => !values[field].trim()
        );

        if (missing.length > 0) {
            setErrors(
                Object.fromEntries(
                    missing.map((field) => [field, true])
                ) as Partial<Record<keyof FormValues, boolean>>
            );
            return;
        }

        // 2. Validation ঠিক থাকলে backend-এ data পাঠাবে
        try {
            const token = await getTokenFromClient();

            if (!token) {
                console.log("JWT Token not found. Please login first.");
                return;
            }

            const res = await fetch("http://localhost:8000/add-books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });


            const responseData = await res.json();

            console.log(responseData);

            // 3. Data successfully save হলে form reset
            if (res.ok) {
                setAdded(`"${values.title.trim()}" was added to BookNook.`);
                setValues(initialValues);
                setErrors({});
            } else {
                setAdded(null);
                console.log("Book could not be added");
            }
        } catch (error) {
            console.log("Error adding book:", error);
        }
    }


    return (
        <main className="px-4 py-10 sm:px-6">
            <section className="mx-auto max-w-4xl">
                <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-[#e9f1fb] to-[#dfeaf8] p-6 shadow-sm md:p-8">
                    <div className="flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-white">
                            <PlusIcon className="size-4" />
                        </span>
                        <h1 className="text-2xl font-bold text-blue-950">Add a New Book</h1>
                    </div>

                    <form
                        noValidate
                        onSubmit={handleSubmit}
                        className="mt-6 grid gap-6 md:grid-cols-2 md:gap-x-10"
                    >
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-title">Book Title</RequiredLabel>
                                <Input
                                    id="book-title"
                                    placeholder="Enter book title"
                                    value={values.title}
                                    onChange={(event) => update("title", event.target.value)}
                                    aria-invalid={!!errors.title}
                                    className="h-10 bg-white"
                                />
                                {errors.title && <FieldError message="Book title is required." />}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-author">Author Name</RequiredLabel>
                                <Input
                                    id="book-author"
                                    placeholder="Enter author name"
                                    value={values.author}
                                    onChange={(event) => update("author", event.target.value)}
                                    aria-invalid={!!errors.author}
                                    className="h-10 bg-white"
                                />
                                {errors.author && <FieldError message="Author name is required." />}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-category">Category</RequiredLabel>
                                <Select
                                    value={values.category}
                                    onValueChange={(value) => update("category", String(value))}
                                >
                                    <SelectTrigger
                                        id="book-category"
                                        aria-invalid={!!errors.category}
                                        className="w-full bg-white"
                                        size="sm"
                                    >
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && <FieldError message="Category is required." />}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-image-url">Book Image URL</RequiredLabel>
                                <Input
                                    id="book-image-url"
                                    type="url"
                                    placeholder="https://..."
                                    value={values.imageUrl}
                                    onChange={(event) => update("imageUrl", event.target.value)}
                                    aria-invalid={!!errors.imageUrl}
                                    className="h-10 bg-white"
                                />
                                {errors.imageUrl && <FieldError message="Book image URL is required." />}
                            </div>
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-description">Short Description</RequiredLabel>
                                <Textarea
                                    id="book-description"
                                    placeholder="Write a short description..."
                                    value={values.description}
                                    onChange={(event) => update("description", event.target.value)}
                                    aria-invalid={!!errors.description}
                                    className="min-h-25 bg-white"
                                />
                                {errors.description && (
                                    <FieldError message="Short description is required." />
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="user-name" className="text-sm font-semibold text-blue-950">
                                    User Name
                                </Label>
                                <Input
                                    id="user-name"
                                    placeholder="Enter user name"
                                    value={values.userName}
                                    onChange={(event) => update("userName", event.target.value)}
                                    className="h-10 bg-white"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="user-email" className="text-sm font-semibold text-blue-950">
                                    User Email
                                </Label>
                                <Input
                                    id="user-email"
                                    type="email"
                                    placeholder="Enter user email"
                                    value={values.userEmail}
                                    onChange={(event) => update("userEmail", event.target.value)}
                                    className="h-10 bg-white"
                                />
                            </div>

                            <div className="mt-auto flex flex-col items-center gap-2.5">
                                <Button
                                    type="submit"
                                    className="h-10 rounded-md bg-blue-600 px-6 text-white hover:bg-blue-700"
                                >
                                    Add Book
                                </Button>
                                {added && <p className="text-sm font-medium text-emerald-600">{added}</p>}
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}
