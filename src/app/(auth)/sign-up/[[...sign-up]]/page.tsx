import { SignUp } from "@clerk/nextjs"

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function RegisterPage() {
  return (
    <section className="container grid items-center gap-8 pb-8 pt-6 md:py-8 max-w-lg flex-col justify-center">
      <SignUp />
    </section>
  )
}
