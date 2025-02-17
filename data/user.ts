import { Database } from "@/lib/db";

export const getUserById = async(id: string | undefined) => {
    try{
        const user = await Database.user.findUnique({
            where: {id}
        })
        return user
    }catch{
        return null
    }
}

export const getUserByEmail = async(email: string) => {
    try{
        const user = await Database.user.findUnique({
            where: {email}
        })
        return user
    }catch{
        return null
    }
}