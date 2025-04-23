"use client"

import * as z from "zod"
import { NewPasswordSchema } from "@/Schemas"
import React, { useState, useTransition } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSearchParams } from "next/navigation"
import { newPass } from "@/actions/NewPass"
import { Input } from "@/components/ui/input"
import { ErrorForm } from "@/components/FormError"
import { SuccessForm } from "@/components/FormSuccess"
import { Button } from "@/components/ui/button"

const Page = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [success, setSuccess] = useState<string | undefined>("")
    const [error, setError] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
      resolver: zodResolver(NewPasswordSchema),
      defaultValues: {
        password: "",
        confirmPass: ""
      }
    })

    const submit = (values: z.infer<typeof NewPasswordSchema>) => {
      setError("")
      setSuccess("")

      startTransition(() => {
        newPass(values, token).then((data) => {
          setSuccess(data.success)
          setError(data.error)
        })
      })
    }
  return (
    <CardWrapper backButtonHref="/auth/login" backButtonLabel="Back To Login" headerLabel="Change Your New Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div className="space-y-4">
            <FormField control={form.control} name="password" render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="password"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={form.control} name="confirmPass" render={({field}) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="password"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </div>
          {error && <ErrorForm message={error}/>}
          {success && <SuccessForm message={success}/>}
          <Button className="w-full" type="submit" variant={"outline"}>Submit</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default Page