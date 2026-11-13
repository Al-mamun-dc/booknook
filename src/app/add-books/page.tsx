
"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "react-toastify"

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
import { authClient } from "@/lib/auth-client"

const categories = [
    "Fiction",
    "Science",
    "History",
    "Kids",
    "Others",
]

type FormValues = {
    title: string
    author: string
    category: string
    imageUrl: string
    description: string
    totalCopies: string
}

const initialValues: FormValues = {
    title: "",
    author: "",
    category: "",
    imageUrl: "",
    description: "",
    totalCopies: "",
}

const requiredFields: (keyof FormValues)[] = [
    "title",
    "author",
    "category",
    "description",
    "imageUrl",
]

function RequiredLabel({
    htmlFor,
    children,
}: {
    htmlFor: string
    children: React.ReactNode
}) {
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

    // Better Auth session
    const { data: session } = authClient.useSession()

    const userName = session?.user?.name || ""
    const userEmail = session?.user?.email || ""

    const [values, setValues] = React.useState<FormValues>(initialValues)

    const [errors, setErrors] = React.useState<
        Partial<Record<keyof FormValues, boolean>>
    >({})

    const [loading, setLoading] = React.useState(false)

    function update(field: keyof FormValues, value: string) {
        setValues((current) => ({
            ...current,
            [field]: value,
        }))

        if (errors[field]) {
            setErrors((current) => ({
                ...current,
                [field]: undefined,
            }))
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // 1. Validation
        const missing = requiredFields.filter(
            (field) => !values[field].trim()
        )

        const newErrors: Partial<
            Record<keyof FormValues, boolean>
        > = {}

        missing.forEach((field) => {
            newErrors[field] = true
        })

        if (
            !values.totalCopies ||
            !Number.isInteger(Number(values.totalCopies)) ||
            Number(values.totalCopies) < 1
        ) {
            newErrors.totalCopies = true
        }

        if (!userName || !userEmail) {
            toast.error("Please login first!")
            return
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            toast.error("Please fill in all required fields correctly!")
            return
        }

        try {
            setLoading(true)

            // 2. Get JWT token
            const token = await getTokenFromClient()

            if (!token) {
                toast.error("Please login first!")
                return
            }

            // 3. Prepare book data
            const bookData = {
                ...values,
                userName,
                userEmail,
                totalCopies: Number(values.totalCopies),
                availableCopies: Number(values.totalCopies),
                createdAt: new Date().toISOString(),
            }

            // 4. Save book in MongoDB through backend
            const res = await fetch(`${process.env.NEXT_PUBLIC_URI_SERVER}/add-books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bookData),
            })

            const responseData = await res.json()

            if (!res.ok) {
                throw new Error(
                    responseData.message || "Book could not be added!"
                )
            }

            // 5. Success toast
            toast.success("Book added successfully!")

            // Reset form
            setValues(initialValues)
            setErrors({})

        } catch (error) {
            console.log("Error adding book:", error)

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Something went wrong!"
            )

        } finally {
            setLoading(false)
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

                        <h1 className="text-2xl font-bold text-blue-950">
                            Add a New Book
                        </h1>
                    </div>

                    <form
                        noValidate
                        onSubmit={handleSubmit}
                        className="mt-6 grid gap-6 md:grid-cols-2 md:gap-x-10"
                    >

                        <div className="space-y-5">

                            {/* Book Title */}
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-title">
                                    Book Title
                                </RequiredLabel>

                                <Input
                                    id="book-title"
                                    placeholder="Enter book title"
                                    value={values.title}
                                    onChange={(e) =>
                                        update("title", e.target.value)
                                    }
                                    aria-invalid={!!errors.title}
                                    className="h-10 bg-white"
                                />

                                {errors.title && (
                                    <FieldError message="Book title is required." />
                                )}
                            </div>

                            {/* Author Name */}
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-author">
                                    Author Name
                                </RequiredLabel>

                                <Input
                                    id="book-author"
                                    placeholder="Enter author name"
                                    value={values.author}
                                    onChange={(e) =>
                                        update("author", e.target.value)
                                    }
                                    aria-invalid={!!errors.author}
                                    className="h-10 bg-white"
                                />

                                {errors.author && (
                                    <FieldError message="Author name is required." />
                                )}
                            </div>

                            {/* Category */}
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-category">
                                    Category
                                </RequiredLabel>

                                <Select
                                    value={values.category}
                                    onValueChange={(value) =>
                                        update("category", value ?? "")
                                    }
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
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {errors.category && (
                                    <FieldError message="Category is required." />
                                )}
                            </div>

                            {/* Book Image URL */}
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-image">
                                    Book Image URL
                                </RequiredLabel>

                                <Input
                                    id="book-image"
                                    type="url"
                                    placeholder="Paste book image URL"
                                    value={values.imageUrl}
                                    onChange={(e) =>
                                        update("imageUrl", e.target.value)
                                    }
                                    aria-invalid={!!errors.imageUrl}
                                    className="h-10 bg-white"
                                />

                                {errors.imageUrl && (
                                    <FieldError message="Please enter a book image URL." />
                                )}
                            </div>

                            {/* Total Copies */}
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="total-copies">
                                    Total Copies
                                </RequiredLabel>

                                <Input
                                    id="total-copies"
                                    type="number"
                                    min="1"
                                    step="1"
                                    placeholder="Enter total copies"
                                    value={values.totalCopies}
                                    onChange={(e) =>
                                        update("totalCopies", e.target.value)
                                    }
                                    aria-invalid={!!errors.totalCopies}
                                    className="h-10 bg-white"
                                />

                                {errors.totalCopies && (
                                    <FieldError message="Enter at least 1 copy." />
                                )}
                            </div>

                        </div>

                        <div className="flex flex-col gap-5">

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <RequiredLabel htmlFor="book-description">
                                    Short Description
                                </RequiredLabel>

                                <Textarea
                                    id="book-description"
                                    placeholder="Write a short description..."
                                    value={values.description}
                                    onChange={(e) =>
                                        update("description", e.target.value)
                                    }
                                    aria-invalid={!!errors.description}
                                    className="min-h-25 bg-white"
                                />

                                {errors.description && (
                                    <FieldError message="Short description is required." />
                                )}
                            </div>

                            {/* User Name */}
                            <div className="flex flex-col gap-1.5">
                                <Label
                                    htmlFor="user-name"
                                    className="text-sm font-semibold text-blue-950"
                                >
                                    User Name
                                </Label>

                                <Input
                                    id="user-name"
                                    value={userName}
                                    readOnly
                                    className="h-10 bg-gray-100"
                                />
                            </div>

                            {/* User Email */}
                            <div className="flex flex-col gap-1.5">
                                <Label
                                    htmlFor="user-email"
                                    className="text-sm font-semibold text-blue-950"
                                >
                                    User Email
                                </Label>

                                <Input
                                    id="user-email"
                                    type="email"
                                    value={userEmail}
                                    readOnly
                                    className="h-10 bg-gray-100"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-auto flex flex-col items-center gap-2.5">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-10 rounded-md bg-blue-600 px-6 text-white hover:bg-blue-700"
                                >
                                    {loading ? "Adding Book..." : "Add Book"}
                                </Button>
                            </div>

                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}
