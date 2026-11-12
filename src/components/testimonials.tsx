import { UsersIcon } from "lucide-react"

import { cn } from "cn"

const testimonials = [
  {
    quote:
      '"BookNook is amazing! I love how easy it is to find and borrow books. Highly recommended!"',
    name: "Sarah Johnson",
    role: "Regular User",
    initials: "SJ",
    tint: "from-teal-100 to-cyan-200",
  },
  {
    quote:
      '"A perfect place for book lovers. The collection is great and the borrowing process is so simple."',
    name: "David Smith",
    role: "Book Reader",
    initials: "DS",
    tint: "from-orange-300 to-amber-200",
  },
  {
    quote:
      '"BookNook has my favorite books here. It\'s truly a reader\'s paradise!"',
    name: "Emily Davis",
    role: "Student",
    initials: "ED",
    tint: "from-orange-200 to-sky-400",
  },
]

function TestimonialCard({
  quote,
  name,
  role,
  initials,
  tint,
}: (typeof testimonials)[number]) {
  return (
    <figure className="flex gap-2.5 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm">
      <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3">
        <blockquote className="text-sm font-medium leading-snug text-slate-700 md:text-base">
          {quote}
        </blockquote>

        <figcaption className="mt-4">
          <span className="block text-sm font-bold text-blue-600">
            — {name}
          </span>
          <span className="text-xs text-slate-500">{role}</span>
        </figcaption>
      </div>

      {/* Placeholder portrait; swap in a photo once real assets exist. */}
      <div
        aria-hidden
        className={cn(
          "flex w-20 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-sm font-bold text-blue-950/70 sm:w-28",
          tint
        )}
      >
        {initials}
      </div>
    </figure>
  )
}

export function Testimonials({ className }: { className?: string }) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-start gap-3">
          <UsersIcon className="size-9 text-blue-600" strokeWidth={2.25} />
          <div>
            <h2 className="text-2xl font-bold text-blue-950 md:text-3xl">
              What Readers Say
            </h2>
            <p className="text-sm text-slate-500 md:text-base">
              Real readers. Real stories.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
