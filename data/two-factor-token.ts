import { Database } from "@/lib/db";

export const getTwoFactorTokenByEmail = async(email: string) => {
    try {
        const twoFactorToken = await Database.twoFactorToken.findFirst({
            where: {email}
        })
        return twoFactorToken
    } catch (error) {
        return null
    }
}