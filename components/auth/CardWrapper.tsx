"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import React from "react"
import { Header } from "@/components/auth/Header"
import { Social } from "@/components/auth/Social"
import { BackButton } from "@/components/auth/BackButton"

interface cardWrapper{
    children: React.ReactNode,
    headerLabel: string,
    backButtonLabel: string,
    backButtonHref: string,
    showSocial?: boolean
}

export const CardWrapper = ({children, headerLabel, backButtonLabel, backButtonHref, showSocial}: cardWrapper) => {
    return(
        <Card className="w-[400px] shadow-sm">
            <CardHeader>
                <Header label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && 
                (<CardFooter>
                    <Social/>
                </CardFooter>)
            }
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel}/>
            </CardFooter>
        </Card>
    )
}

