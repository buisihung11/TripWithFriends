import * as z from "zod"

import { getUserByClerkId } from "@/lib/auth"
import { db } from "@/lib/db"

const entryCreateSchema = z.object({
  title: z.string(),
  imageUrl: z.string().url().nullable(),
  fromDate: z.string().datetime().nullable(),
  toDate: z.string().datetime().nullable(),
})

export async function POST(req: Request) {
  try {
    const user = await getUserByClerkId()

    if (!user) {
      return new Response("Unauthorized", { status: 403 })
    }

    const json = await req.json()
    const body = entryCreateSchema.parse(json)

    const entry = await db.journal.create({
      data: {
        ...body,
        userId: user?.id,
      },
    })

    return new Response(JSON.stringify(entry))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    console.error(error)
    return new Response(null, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserByClerkId()

    if (!user) {
      return new Response("Unauthorized", { status: 403 })
    }

    const entries = await db.journal.findMany({
      where: {
        userId: user?.id,
      },
    })

    return new Response(JSON.stringify(entries))
  } catch (error) {
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
