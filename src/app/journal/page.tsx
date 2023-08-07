import { Journal } from "@/types"

import { Shell } from "@/components/ui/shell"
import { Header } from "@/components/header"
import JournalList from "@/components/journal/journal-list"

const JOURNALS: Journal[] = [
  {
    id: "1",
    title: "Trip to Japan",
    from: "2021-01-24",
    to: "2021-08-12",
    description: "A trip to Japan with my friends.",
    image: "https://source.unsplash.com/1600x900/?japan",
    tripMates: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://source.unsplash.com/100x100/?face",
      },
      {
        id: "2",
        name: "Jane Doe",
        avatar: "https://source.unsplash.com/100x100/?face",
      },
    ],
  },
  {
    id: "2",
    title: "Trip to DK",
    from: "2021-01-24",
    to: "2021-08-12",
    description: "A trip to Japan with my friends.",
    image: "https://source.unsplash.com/1600x900/?denmark",
    tripMates: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://source.unsplash.com/100x100/?face",
      },
      {
        id: "2",
        name: "Jane Doe",
        avatar: "https://source.unsplash.com/100x100/?face",
      },
    ],
  },
]

export default function JournalPage() {
  return (
    <Shell>
      <Header
        title="Dashboard"
        // description="A collection of thoughts, ideas, and experiences."
        size="sm"
      />
      {/* LIST OF JOURNAL ENTRIES */}
      <JournalList title="Ongoing journal" journalEntries={JOURNALS} />
    </Shell>
  )
}
