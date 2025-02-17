import { Database } from "@/lib/db";

export const getTokenResetPassbyEmail = async(email: string) => {
    try {
        const token = await Database.resetPassToken.findFirst({
            where: {email}
        })
        return token
    } catch (error) {
        
    }
}

export const getTokenResetPassbyToken = async(token: string) => {
    try {
        const tokenResetPass = await Database.resetPassToken.findFirst({
            where: {token}
        })
        return tokenResetPass
    } catch (error) {
        
    }
}