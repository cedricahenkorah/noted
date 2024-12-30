"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function SignIn(formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  try {
    await signIn("credentials", {
      ...data,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error(error.cause?.err?.message);
    }
    throw error;
  }
}
