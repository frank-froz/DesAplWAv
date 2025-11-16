import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { findUserByEmail, validatePassword } from "@/lib/users"
import { isLockedOut, recordFailedAttempt, resetAttempts, getRemainingLockoutTime } from "@/lib/auth-attempts"
import { env } from "@/lib/env"

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: env.googleClientId,
            clientSecret: env.googleClientSecret,
        }),
        GitHubProvider({
            clientId: env.githubClientId,
            clientSecret: env.githubClientSecret,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email y contraseña son requeridos");
                }

                const identifier = credentials.email;

                if (isLockedOut(identifier)) {
                    const remainingMinutes = getRemainingLockoutTime(identifier);
                    throw new Error(`Cuenta bloqueada. Intenta de nuevo en ${remainingMinutes} minutos.`);
                }

                const user = findUserByEmail(credentials.email);
                if (!user) {
                    recordFailedAttempt(identifier);
                    throw new Error("Credenciales inválidas");
                }

                const isValid = await validatePassword(credentials.password, user.password);
                if (!isValid) {
                    recordFailedAttempt(identifier);
                    throw new Error("Credenciales inválidas");
                }

                resetAttempts(identifier);
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            }
        })
    ],
    pages: {
        signIn: '/signIn',
        error: '/signIn',
    },
    callbacks: {
        async jwt({ token, user }) {
            // Agregar rol al token JWT
            if (user) {
                token.role = (user as any).role || 'user';
            }
            return token;
        },
        async session({ session, token }) {
            // Agregar rol a la sesión
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };

