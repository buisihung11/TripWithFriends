import Link from "next/link"

import { getUserByClerkId } from "@/lib/auth"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Shell } from "@/components/ui/shell"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import JournalList from "@/components/journal/journal-list"

export default async function JournalPage() {
  const user = await getUserByClerkId()

  // THIS WILL BE EXCUTED ON THE SERVER
  const journals = await db.journal.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <Shell>
      <Header
        title="Dashboard"
        size="sm"
        className="items-center justify-between lg:flex"
      >
        <Link href="/journal/create">
          <Button variant="outline">
            <Icons.add className="mr-2 h-4 w-4" />
            Create new journal
          </Button>
        </Link>
      </Header>
      <JournalList title="Ongoing journal" journals={journals} />
    </Shell>
  )
}
