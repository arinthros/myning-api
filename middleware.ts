import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const authenticatedRoutes: Array<string> = [
  '/players',
  '/players/[id]',
]

const unauthenticatedRoutes = [
  '/login',
  '/register'
]

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  // If it's the root path, just render it
  if (path === "/") {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!session && authenticatedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  } else if (session && unauthenticatedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/players", req.url));
  }
  return NextResponse.next();
}
