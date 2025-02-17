"use client"
import * as z from "zod"
import { ResetPassSchema } from "@/Schemas"
import React, { useState, useTransition } from 'react'
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { resetPass } from "@/actions/ResetPass"
import { ErrorForm } from "@/components/FormError"
import { Button } from "@/components/ui/button"
import { SuccessForm } from "@/components/FormSuccess"

const page = () => {
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetPassSchema>>({
        resolver: zodResolver(ResetPassSchema),
        defaultValues: {
            email: ""
        }
    })

    const submit = (values: z.infer<typeof ResetPassSchema>) => {
        setSuccess(undefined)
        setError(undefined)

        startTransition(() => {
            resetPass(values).then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
        })
    }

  return (
    <CardWrapper headerLabel="Reset Your Password" backButtonLabel="Back To Login" backButtonHref="/auth/login">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField control={form.control} name="email" render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} disabled={isPending} type="email" placeholder="xing@example.com" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                </div>
                {error && <ErrorForm message={error}/>}
                {success && <SuccessForm message={success}/>}
                <Button variant={"outline"} className="w-full bg-black text-white" type="submit">Submit</Button>
            </form>
        </Form>
    </CardWrapper>
  )
}

export default page