import { auth } from "@clerk/nextjs"

import { db } from "./db"

export const getUserByClerkId = async () => {
  const { userId } = auth()
  if (userId) {
    try {
      const user = await db.user.findUniqueOrThrow({
        where: {
          clerkId: userId as string,
        },
      })

      return user
    } catch (error) {
      console.error(error)
      throw new Error("User not found")
    }
  }
}
