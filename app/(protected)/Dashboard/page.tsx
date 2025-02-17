"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const Page = () => {
    const { data: session } = useSession()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut({ redirect: false })
        router.push("/auth/login")
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {session ? (
                <p>Welcome, {session.user?.name}!</p>
            ) : (
                <p>Loading...</p>
            )}
            <span onClick={handleSignOut}>
                <Button variant="outline">Sign Out</Button>
            </span>
        </div>
    )
}

export default Page
