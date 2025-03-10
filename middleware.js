import arcjet, { createMiddleware, detectBot, shield } from "@arcjet/next";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/hooks/getdatafromToken";

const isProtectedRoute = (req) => {
  const protectedRoutes = ["/dashboard", "/account", "/transaction"];
  return protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
};

// Create Arcjet middleware
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "GO_HTTP",
      ],
    }),
  ],
});

// Custom middleware for authentication using token
async function authMiddleware(req) {
  const userId = await getDataFromToken(req);

  if (userId?.error && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Chain middlewares - ArcJet runs first, then custom auth
export default createMiddleware(aj, authMiddleware);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
