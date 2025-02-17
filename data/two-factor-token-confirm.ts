import { Database } from "@/lib/db";

export const getTwoFactorTokenConfirmByUserId = async(userId: string) => {
    try {
        const twoFactorTokenConfirm = await Database.twoFactorConfirmation.findUnique({
            where: {userId}
        })
        return twoFactorTokenConfirm
    } catch (error) {
        return null
    }
}