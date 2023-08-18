import { Shell } from "@/components/ui/shell"
import { Header } from "@/components/header"

import "@uploadthing/react/styles.css"

import { type Metadata } from "next"
import { notFound, useRouter } from "next/navigation"

import { db } from "@/lib/db"
import { useToast } from "@/components/ui/use-toast"

export const metadata: Metadata = {
  title: "Detail journal",
  description: "Update your journal and invite your trip mates",
}

interface JournalDetailProps {
  params: { journalId: string }
}

export default async function JournalDetailPage({
  params,
}: JournalDetailProps) {
  const journal = await db.journal.findFirst({
    where: {
      id: params.journalId,
    },
  })

  if (!journal) {
    notFound()
  }

  return (
    <Shell>
      <Header
        title={`Trip to ${journal?.title}}`}
        description="Crete new trip and share with friends"
        size="sm"
      />
    </Shell>
  )
}
