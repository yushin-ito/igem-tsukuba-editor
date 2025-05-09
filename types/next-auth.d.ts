/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { type Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: Role;
  }
}

declare module "next-auth" {
  interface User {
    role?: Role;
  }

  interface Session {
    user: {
      id: UserId;
      role: Role;
    } & DefaultSession["user"];
  }
}
