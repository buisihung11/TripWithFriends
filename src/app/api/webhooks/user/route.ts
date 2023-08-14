import { IncomingHttpHeaders } from "http"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import type { User } from "@clerk/nextjs/api"
import { Webhook, WebhookRequiredHeaders } from "svix"

import { db } from "@/lib/db"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET as string

type UnwantedKeys =
  | "emailAddresses"
  | "firstName"
  | "lastName"
  | "primaryEmailAddressId"
  | "primaryPhoneNumberId"
  | "phoneNumbers"
interface UserInterface extends Omit<User, UnwantedKeys> {
  email_addresses: {
    email_address: string
    id: string
  }[]
  primary_email_address_id: string
  first_name: string
  last_name: string
  image_url: string
  primary_phone_number_id: string
  phone_numbers: {
    phone_number: string
    id: string
  }[]
}

async function handler(request: Request) {
  const payload = await request.json()
  const headersList = headers()
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  }
  const wh = new Webhook(webhookSecret)
  let evt: Event | null = null

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event
  } catch (error) {
    console.log("Server API error: ", error)
    return NextResponse.json(
      {
        error: "Invalid webhook signature",
      },
      { status: 400 }
    )
  }
  const { id } = evt.data

  console.log("START CREATE USER WITH EVENT", evt.data)
  // Handle the webhook
  const eventType: EventType = evt.type
  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      first_name,
      last_name,
      email_addresses,
      image_url,
      primary_email_address_id,
    } = evt.data

    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id
    })

    if (!emailObject) {
      return NextResponse.json(
        {
          error: "No email address found",
        },
        { status: 400 }
      )
    }

    await db.$transaction([
      db.user.upsert({
        where: { clerkId: id },
        update: {
          name: `${first_name || ""} ${last_name || ""}`,
          email: emailObject.email_address,
          image: image_url,
        },
        create: {
          clerkId: id,
          name: `${first_name || ""} ${last_name || ""}`,
          email: emailObject.email_address,
          image: image_url,
        },
      }),
    ])
  }
  console.log(`User ${id} was ${eventType}`)
  return NextResponse.json({ success: true }, { status: 201 })
}

type EventType = "user.created" | "user.updated" | "*"

type Event = {
  data: UserInterface
  object: "event"
  type: EventType
}

export const GET = handler
export const POST = handler
export const PUT = handler
