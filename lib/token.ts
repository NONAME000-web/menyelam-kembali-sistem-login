import crypto from "crypto"
import {v4 as uuidv4} from "uuid"
import { Database } from "./db"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getTokenResetPassbyEmail } from "@/data/resetPass"

export const generateTwoFactorToken = async(email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const tokenExist = await getTwoFactorTokenByEmail(email)
    
    if(tokenExist){
        await Database.twoFactorToken.delete({
            where: {id: tokenExist.id}
        })
    }

    const twoFactorToken = await Database.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return twoFactorToken
}

export const generateTokenResetPass = async(email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    const tokenExist = await getTokenResetPassbyEmail(email)

    if(tokenExist){
        await Database.resetPassToken.delete({
            where: {id: tokenExist.id}
        })
    }

    const resetPassTokenNew = await Database.resetPassToken.create({
        data: {
            token,
            expires,
            email
        }
    })
    return resetPassTokenNew
}