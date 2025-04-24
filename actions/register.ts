"use server"

import * as z from "zod"
import { Database } from "@/lib/db"
import { RegisterSchema } from "@/Schemas"
import { getUserByEmail } from "@/data/user"
import bcrypt from "bcryptjs"

export const register = async(values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values)

    if(!validateFields.success) return {error: "Invalid Fields"}

    const {email, password, name} = validateFields.data
    //
    const hashedPass = await bcrypt.hash(password, 10)

    const userExist = await getUserByEmail(email)
    if(userExist) return {error: "Email already used"}

    await Database.user.create({
        data: {
            email,
            name,
            password: hashedPass
        }
    })

    return{success: "User Has Created"}
}