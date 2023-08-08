"use client"
/* eslint-disable @next/next/no-img-element */
import { Journal } from "@/types"

import JournalCard from "@/components/journal-card"

interface JournalListProps {
  title: string
  journalEntries: Journal[]
}

export default function JournalList({
  title,
  journalEntries,
}: JournalListProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {journalEntries.map((journal) => (
          <JournalCard key={journal.id} journal={journal} />
        ))}
      </div>
    </div>
  )
}
