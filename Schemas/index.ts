import * as z from "zod"

export const RegisterSchema  = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(4)
})

export const LoginSchema  = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    code: z.optional(z.string())
})

export const ResetPassSchema  = z.object({
    email: z.string().email(),
})

export const NewPasswordSchema  = z.object({
    password: z.string().min(8),
    confirmPass: z.string().min(8)
}).refine((data) => data.password === data.confirmPass, {
    path: ["Confirm Password"],
    message: "Password Does Not Match"
})