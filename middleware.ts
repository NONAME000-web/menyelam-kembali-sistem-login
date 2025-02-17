import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, PublicRoute } from "./routes";

const {auth} = NextAuth(authConfig)

export default auth((req) => {
    const {nextUrl} = req 
    const isLoggedIn = !!req.auth

    const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = PublicRoute.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if(isAPIAuthRoute) return
    //
    if(isAuthRoute){
        if(isLoggedIn) return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))

        return
    }
    //
    if(!isLoggedIn && !isPublicRoute) return Response.redirect(new URL("/auth/login", nextUrl))
    //
    return
})

export const config = {
    matcher: ['/((?!.+\\.[\\W]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}