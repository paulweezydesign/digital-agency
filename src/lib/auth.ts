import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In production, validate against your database
        // This is a simple demo implementation
        if (
          credentials?.email === "admin@digitalagency.com" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@digitalagency.com",
            role: "admin",
          };
        }
        if (
          credentials?.email === "operator@digitalagency.com" &&
          credentials?.password === "operator123"
        ) {
          return {
            id: "2",
            name: "Agent Operator",
            email: "operator@digitalagency.com",
            role: "agent-operator",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "client";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
