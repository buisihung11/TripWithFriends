import Link from "next/link"
import { Journal } from "@/types"

import { Button } from "@/components/ui/button"
import { Shell } from "@/components/ui/shell"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
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
      {
        id: "3",
        name: "Jane Doe",
        avatar: "https://source.unsplash.com/100x100/?face",
      },
    ],
  },
  {
    id: "3",
    title: "Trip to VietNam",
    from: "2021-01-24",
    to: "2021-08-12",
    description: "A trip to VietNam with my friends.",
    image: "https://source.unsplash.com/1600x900/?vietnam",
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
      {
        id: "3",
        name: "Jane Doe",
        avatar: "https://source.unsplash.com/100x100/?face",
      },
      {
        id: "4",
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
      <JournalList title="Ongoing journal" journalEntries={JOURNALS} />
    </Shell>
  )
}
