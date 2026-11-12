<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BookNook

Next.js 16 (App Router, `src/` layout) + React 19 + Tailwind v4. No tests, no CI; there is only an initial commit — most of `src/` is uncommitted but intentional user work. Do not delete or reorganize it.

The app itself is a placeholder: `src/app/page.tsx` is an empty scaffold. The real content is the shadcn component library under `src/components/ui/` — there is no other app logic to hunt for.

## Commands

- `npm run dev` — dev server (Turbopack). `npm run build` — prod build (also Turbopack).
- Typecheck: `npx tsc --noEmit` (no script). Typegen types live under `.next/types`; they only exist after a dev server or build has run, so run one first for a complete typecheck.
- Lint: `npm run lint` (ESLint 9 flat config with `eslint-config-next`). That's the whole check suite — run lint + typecheck before finishing.

## Required reading before writing Next code

- `next.config.ts` enables `cacheComponents: true`, `partialPrefetching: true`, and `reactCompiler: true`. Cache semantics are strict: async data access needs explicit caching directives/`Suspense` per the docs in `node_modules/next/dist/docs/` (see Caching / Fetching Data guides).
- React Compiler is on: don't reflexively add `useMemo`/`useCallback`/`React.memo`; prefer plain code and let the compiler memoize.

## Tailwind v4 (CSS-first)

- There is no `tailwind.config`. Theme tokens, colors (oklch CSS vars), radii, and the dark variant (`@custom-variant dark`, class-based) are all defined in `src/app/globals.css` via `@theme inline`. Edit tokens there, not in a config file.
- Tailwind is wired through the `turbopack.rules` loader in `next.config.ts`, not PostCSS — don't "fix" the config by adding a postcss config.

## shadcn/ui — this is the Base UI variant

- `components.json` uses style `base-nova`: components in `src/components/ui/*` are built on **`@base-ui/react`** (Base UI), not Radix. Never import Radix primitives or Radix-based shadcn snippets — the APIs differ.
- Treat `src/components/ui/*` as a CLI-generated library (regenerate via `npx shadcn` rather than hand-editing where possible); app code goes in `src/components/`, `src/hooks/`, `src/lib/`.
- Aliases: `@/*` → `src/*` (`@/components`, `@/components/ui`, `@/hooks`, `@/lib`), per `components.json` and `tsconfig.json`.
