import {Resend} from "resend"

const resend = new Resend(process.env.RESEND_CREDENTIAL)

export const sendTwoFactorCode = async(email: string, token: string) => {
    await resend.emails.send({
        from: "Website Login <onboarding@resend.dev>",
        to: email,
        subject: "Token Two Factor For Authenticator",
        html: `<p>Here The Code ${token}</p>`
    })
}

export const sendTokenResetPass = async(email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/resetPass?token=${token}`
    await resend.emails.send({
        from: "Website Login <onboarding@resend.dev>",
        to: email,
        subject: "Token Two Factor For Authenticator",
        html: `<p>Click <a href="${confirmLink}">Here</a> to Verify Your Email</p>`
    })
}