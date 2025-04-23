"use server"

import * as z from "zod"
import { getTokenResetPassbyToken } from "@/data/resetPass"
import { NewPasswordSchema } from "@/Schemas"
import { Database } from "@/lib/db"
import { getUserByEmail } from "@/data/user"

export const newPass = async(values: z.infer<typeof NewPasswordSchema>, token: string | null) => {
    const validateFields = NewPasswordSchema.safeParse(values)
    if(!validateFields.success) return{error: "Invalid Fields"}

    const {password} = validateFields.data

    const tokenExist = await getTokenResetPassbyToken(token || "")
    if(!tokenExist) return{error: "Token Not Match"}

    const hasExpired = new Date(tokenExist.expires) < new Date()
    if(hasExpired) return{error: "Token Has Expired"}

    const userExist = await getUserByEmail(tokenExist.email)
    if(!userExist) return{error: "User Does Not Exist"}

    //
    const bcrypt = await import("bcryptjs")
    const hashedPass = await bcrypt.hash(password, 10)

    await Database.user.update({
        where: {id: userExist.id},
        data: {
            password: hashedPass
        }
    })

    await Database.resetPassToken.delete({
        where: {id: tokenExist.id}
    })

    return {success: "Password has Changed"}
}