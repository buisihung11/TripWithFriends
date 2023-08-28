import { getUserByClerkId } from "@/lib/auth"
import { db } from "@/lib/db"
import { EnumAttractionType } from "@prisma/client"
import * as z from "zod"

const attractionCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  imageUrl: z.string().url().nullable(),
  address: z.string().nullable(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  attractionType: z
    .string()
    .refine((x) =>
      Object.values(EnumAttractionType).includes(x as EnumAttractionType)
    ),
  goOnDate: z.string().datetime().nullable(),  
})

export async function POST(
  req: Request,
  { params }: { params: { journalId: string } }
) {
  try {
    const user = await getUserByClerkId()

    if (!user) {
      return new Response("Unauthorized", { status: 403 })
    }

    if (!params.journalId) {
      return new Response("Journal ID is required", { status: 422 })
    }

    const json = await req.json()
    const body = attractionCreateSchema.parse(json)

    const entry = await db.attraction.create({
      data: {
        ...body,
        createdByUserId: user.id,
        journalId: params.journalId,
        goOnDate: new Date(), // TODO: Get the first day of the trip from the journal from field
      },
    })

    return new Response(JSON.stringify(entry))
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.issues)
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    console.error(error)
    return new Response(null, { status: 500 })
  }
}
