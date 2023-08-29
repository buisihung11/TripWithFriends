import { Header } from "@/components/header"
import { Shell } from "@/components/ui/shell"

import { type Metadata } from "next"
import { notFound } from "next/navigation"

import AttractionItem from "@/components/attraction-item"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/db"
import { differenceInDays, format } from "date-fns"
import addDays from "date-fns/addDays"
import Link from "next/link"

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

  const createDayTabs = () => {
    const durationInDays =
      journal.toDate && journal.fromDate
        ? differenceInDays(journal.toDate, journal.fromDate)
        : 0

    const tabsTrigger = []
    for (let i = 0; i < durationInDays; i++) {
      // create curent day base on fromDate and i
      const currentDay = addDays(new Date(journal.fromDate as Date), i)
      const day = format(currentDay, "dd MMM")
      tabsTrigger.push(
        <TabsTrigger
          className="flex h-20 flex-col items-center gap-2"
          value={`${i}`}
        >
          Day {i + 1}
          <p className="text-xs text-muted-foreground">{day}</p>
        </TabsTrigger>
      )
    }

    return tabsTrigger
  }

  // TODO: filter by date
  const attractions = await db.attraction.findMany({
    where: {
      journalId: journal.id,
    },
  })

  return (
    <Shell className="grid-cols-1">
      <Header
        title={journal?.title || "Journal"}
        description={`${format(journal.fromDate as Date, "dd MMM")} - 
        ${format(journal.toDate as Date, "dd MMM")}`}
        className="items-center justify-between lg:flex"
        size="sm"
      >
        <Button variant="outline">
          <Icons.userPlus className="mr-2 h-4 w-4" />
          Invite friends
        </Button>
      </Header>
      <div className="grid w-full grid-cols-12 gap-2">
        <div className="col-span-12 grid lg:col-span-10">
          <ScrollArea className="w-full">
            <Tabs>
              <TabsList className="flex h-full w-full flex-nowrap">
                {createDayTabs()}
              </TabsList>
            </Tabs>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <div className="col-span-12 grid lg:col-span-2">
          <Button variant="outline" className="h-full">
            <Icons.add className="mr-2 h-4 w-4" />
            Add day
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {attractions.map((attraction) => (
          <div key={attraction.name} className="col-span-12  lg:col-span-6">
            <AttractionItem attraction={attraction} />
          </div>
        ))}
        <div className="col-span-12">
          {/* TODO: Pass selected Day to the Link as query param */}
          <Link href={`/journal/${journal.id}/create`}>
            <Button variant="outline" className="h-full w-full border-dashed">
              <Icons.add className="mr-2 h-4 w-4" />
              Add attraction
            </Button>
          </Link>
        </div>
      </div>
    </Shell>
  )
}
