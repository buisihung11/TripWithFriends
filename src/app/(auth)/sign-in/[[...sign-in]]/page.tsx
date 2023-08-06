import { SignIn } from "@clerk/nextjs"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account",
}

export default function LoginPage() {
  return (
    <section className="container grid items-center gap-8 pb-8 pt-6 md:py-8 max-w-lg flex-col justify-center">
      <SignIn />
    </section>
  )
}
