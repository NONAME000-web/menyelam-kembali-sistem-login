import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Database } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorTokenConfirmByUserId } from "./data/two-factor-token-confirm";
// import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const { handlers: { GET, POST }, auth, signIn, signOut } = 
NextAuth({ 
    pages: { 
        signIn: "/auth/login", 
        error: "/auth/error", 
    },
    events: {
        async linkAccount({ user }) {
            await Database.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({user, account}) {
            if(account?.provider !== "credentials") return true

            const existingUser = await getUserById(user.id)

            // Kode yang di bawah ini untuk email verified dan Two Authentication
            
            if(existingUser?.isTwoFactorAuthentication && user.id){
                const twoFactorConfirmation = await getTwoFactorTokenConfirmByUserId(user.id)
                if(!twoFactorConfirmation) return false
                //
                await Database.twoFactorConfirmation.delete({
                    where: {id: twoFactorConfirmation.id}
                })
            }
            // sampai ini
            
            return true
        },
        async session({ token, session }) 
        {
            // console.log({sessionToken: token})
            if(token.sub && session.user) session.user.id = token.sub
            //
            return session
        },
        async jwt({ token }) 
        {
            if(!token.sub) return token
            //
            const existingUser = await getUserById(token.sub)
            //
            if(!existingUser) return token
            //
            return token
        }
    }, 
    ...authConfig, 
    adapter: PrismaAdapter(Database), 
    session: {strategy: "jwt"}, 
})
