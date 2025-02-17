"use server"

import * as z from "zod"
import { ResetPassSchema } from "@/Schemas"
import { getUserByEmail } from "@/data/user"
import { generateTokenResetPass } from "@/lib/token"
import { sendTokenResetPass } from "@/lib/mail"

export const resetPass = async(value: z.infer<typeof ResetPassSchema>) => {
    const validateField = ResetPassSchema.safeParse(value)
    if(!validateField.success) return{error: "Invalid Fields"}

    const {email} = validateField.data
    const userExist = await getUserByEmail(email)
    if(!userExist) return{error: "User Does Not Exist"}

    const tokenResetPass = await generateTokenResetPass(email)
    await sendTokenResetPass(tokenResetPass.email, tokenResetPass.token)
    return{success: "Email has sent"}
}