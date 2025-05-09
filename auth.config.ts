import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [Google],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        if (user.id) {
          token.id = user.id;
        }

        if (user.role) {
          token.role = user.role;
        }
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;

      return session;
    },
  },
} satisfies NextAuthConfig;
