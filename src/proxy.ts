import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    const user = session?.user;

    if (!user) {
        const loginUrl = new URL('/login', request.url);

        loginUrl.searchParams.set(
            'redirect',
            request.nextUrl.pathname + request.nextUrl.search
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/add-books',
        '/all-books',
        '/books/:path*',
        '/my-books/:path*',
        '/my-borrows'
    ],
};