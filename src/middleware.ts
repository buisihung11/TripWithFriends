import { authMiddleware, redirectToSignIn } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/", "/api(.*)", "/api/cron"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
