/* eslint-disable @next/next/no-img-element */
import { Journal } from "@/types"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface JournalListProps {
  title: string
  journalEntries: Journal[]
}

const TripMateAvatar = ({
  imageUrl,
  name,
}: {
  imageUrl: string
  name: string
}) => {
  return (
    <Avatar className="w-6 h-6">
      <AvatarImage src={imageUrl} alt={`@{name}`} />
      <AvatarFallback className="text-xs">{name}</AvatarFallback>
    </Avatar>
  )
}

export default function JournalList({
  title,
  journalEntries,
}: JournalListProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* JOURNAL ENTRIES */}
        {journalEntries.map((journal) => (
          <div
            className="bg-transparent space-y-4 rounded p-2 border-solid border border-gray-50"
            key={journal.id}
          >
            <AspectRatio ratio={16 / 9} className="w-100 rounded-lg">
              <img
                className="w-full h-full object-cover rounded-lg"
                src={journal.image}
                alt={journal.title}
              />
            </AspectRatio>
            <div className="space-y-1">
              <h4 className="text-base font-semibold">{journal.title}</h4>
              <div className="flex justify-between items-center">
                <div className="text-xs text-sky-500">24 Jan - 12 Aug</div>
                <div className="flex space-x-1">
                  {journal.tripMates.map((tripMate) => (
                    <TripMateAvatar
                      key={tripMate.id}
                      imageUrl={tripMate.avatar}
                      name={tripMate.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
