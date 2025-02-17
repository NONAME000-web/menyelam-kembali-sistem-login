"use client"
import * as z from "zod"
import { LoginSchema } from "@/Schemas"
import { login } from "@/actions/login"
import React, { useState, useTransition } from 'react'
import { CardWrapper } from "./CardWrapper"
import { Form, FormControl, FormLabel, FormField, FormMessage, FormItem } from "../ui/form"
import { useForm } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ErrorForm } from "../FormError"
import { SuccessForm } from "../FormSuccess"
import Link from "next/link"

const LoginForm = () => {
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [isPending, startTransition] = useTransition()
    const [showTwoFactor, setShow] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        }
    })

    const Submit = (value: z.infer<typeof LoginSchema>) => {
      setError(undefined)
      setSuccess(undefined)

      startTransition(() => {
          login(value).then((data) => {
              if(data && "error" in data && data.error){
                setError(typeof data.error === "string" ? data.error : "Something Wrong")
                setShow(false)
              }
              if(data && "success" in data && data.success){
                setError(typeof data.success === "string" ? data.success : "Login success")
              }
              if(data?.twoFactor) setShow(true)
          })
      })
    }
  return (
      <CardWrapper headerLabel='Welcome In My Website' backButtonLabel='Have not any account yet?' backButtonHref='/auth/register' showSocial>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(Submit)} className="space-y-6">
            <div className="space-y-4">
              {showTwoFactor && (
                  <FormField control={form.control} name="code" render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="123456"/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}/>
              )}
              {!showTwoFactor && (
                <>
                  <FormField control={form.control} name="email" render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled={isPending} placeholder="example.com"/>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="password" render={({field}) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" disabled={isPending}/>
                      </FormControl>
                      <Button variant={"link"} size={"sm"} className="px-0">
                        <Link href={"/auth/reset"}>Forgot Password?</Link>
                      </Button>
                      <FormMessage/>
                    </FormItem>
                  )}/>
                </>
              )}
            </div>
            {error && <ErrorForm message={error}/>}
            {success && <SuccessForm message={success}/>}
            <Button className="w-full" type="submit" disabled={isPending}>
              {showTwoFactor? "Submit" : "Login"}
            </Button>
          </form>
        </Form>
      </CardWrapper>
  )
}

export default LoginForm