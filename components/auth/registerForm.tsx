"use client"

import * as z from "zod"
import { RegisterSchema } from "@/Schemas"
import { register } from "@/actions/register"
import React, { useState, useTransition } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CardWrapper } from "./CardWrapper"
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../ui/form"
import { Input } from "../ui/input"
import { ErrorForm } from "../FormError"
import { SuccessForm } from "../FormSuccess"
import { Button } from "../ui/button"

const RegisterForm = () => {
    const [success, setSuccess] = useState<string | undefined>("")
    const [error, setError] = useState<string | undefined>("")
    const [isPending, startTransition]  = useTransition()

    const form = useForm<z.infer<typeof RegisterSchema>>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
        name: "",
        email: "",
        password: ""
      }
    })

    const submit = (values: z.infer<typeof RegisterSchema>) => {
      setError("")
      setSuccess("")
      startTransition(() => {
        register(values).then((data) => {
          setError(data.error)
          setSuccess(data.success)
        })
      })
    }

  return (
    <CardWrapper backButtonHref="/auth/login" backButtonLabel="Have any account?" headerLabel="Please Create New Account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
          <div className="space-y-4">
            <FormField control={form.control} name="name" render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="XING"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={form.control} name="email" render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} placeholder="XING@example.com" type="email"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
            <FormField control={form.control} name="password" render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} type="password"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>
          </div>
          {error && <ErrorForm message={error}/>}
          {success && <SuccessForm message={success}/>}
          <Button disabled={isPending} type="submit" className="w-full">Register</Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default RegisterForm