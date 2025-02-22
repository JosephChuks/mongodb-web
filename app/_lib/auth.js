import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    Credentials({
      async authorize(credentials, req) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (!username || !password) {
          throw new Error("Username and password are required.");
        }

        if (process.env.ENABLE_AUTH_API === "yes") {
          const formData = new FormData();
          formData.append("username", username);
          formData.append("password", password);

          const res = await fetch(process.env.AUTH_API, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!data.success) {
            if (process.env.NODE_ENV === "development") {
              console.log("Auth API request failed:", data.message);
            }
            throw new Error("Invalid credentials.");
          }
        }

        return {
          username,
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user }) {
      if (user) {
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      } else if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authOptions);
