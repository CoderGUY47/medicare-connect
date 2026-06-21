import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.BETTER_AUTH_URL || "https://medicare-connect-ten.vercel.app"),
    plugins: [
        jwtClient(),
    ]
})

export const { signIn, signUp, useSession, signOut } = authClient;