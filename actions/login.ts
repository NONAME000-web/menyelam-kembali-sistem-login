"use server"

import * as z from "zod"
import { getUserByEmail } from "@/data/user"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { Database } from "@/lib/db"
import { LoginSchema } from "@/Schemas"
import { AuthError } from "next-auth"
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token"
import { getTwoFactorTokenConfirmByUserId } from "@/data/two-factor-token-confirm"
import { generateTwoFactorToken } from "@/lib/token"
import { sendTwoFactorCode } from "@/lib/mail"

export const login = async(values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values)
    if(!validateFields.success) return{error: "Invalid Fields"}

    const {email, password, code} = validateFields.data
    const userExist = await getUserByEmail(email)
    if(!userExist || !userExist.email || !userExist.password) return{error: "User Does Not Exist"}

    if(userExist.isTwoFactorAuthentication && userExist.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(userExist.email)
            if(!twoFactorToken) return{error: "Code Invalid"}

            if(twoFactorToken.token !== code) return {error: "Code Does Not Match"}
            const hasExpired = new Date(twoFactorToken.expires) < new Date()
            if(hasExpired) return{error: "Code has expired"}

            await Database.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            })

            const tokenConfirmExist = await getTwoFactorTokenConfirmByUserId(userExist.id)
            if(tokenConfirmExist){
                await Database.twoFactorConfirmation.delete({
                    where: {userId: tokenConfirmExist.userId}
                })
            }

            await Database.twoFactorConfirmation.create({
                data: {
                    userId: userExist.id
                }
            })
        }else{
            const generateCode = await generateTwoFactorToken(userExist.email)
            await sendTwoFactorCode(generateCode.email, generateCode.token)
            return {twoFactor: true}
        }
    }

    try{
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    }catch(err){
        if(err instanceof AuthError){
            switch (err.type) {
                case "CredentialsSignin":
                    return{error: "Invalid Account"}
            
                default:
                    return{error: err}
            }
        }
        throw err
    }
}