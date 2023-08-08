import { Journal, TripMate } from "@/types"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { format, parseISO } from "date-fns"

const TripMateAvatar = ({
  imageUrl,
  name,
}: {
  imageUrl: string
  name: string
}) => {
  return (
    <Avatar className="w-6 h-6 rounded-full overflow-hidden">
      <AvatarImage src={imageUrl} alt={`@{name}`} />
      <AvatarFallback className="text-xs">{name}</AvatarFallback>
    </Avatar>
  )
}

const TripMateList = ({ tripMates }: { tripMates: TripMate[] }) => {
  return (
    <div className="flex space-x-1 items-center">
      {tripMates.slice(0, 3).map((tripMate) => (
        <TripMateAvatar
          key={tripMate.id}
          imageUrl={tripMate.avatar}
          name={tripMate.name}
        />
      ))}
      {tripMates.length > 3 && (
        <p className="pl-1 text-xs font-light">+{tripMates.length - 3} more</p>
      )}
    </div>
  )
}

export default function JournalCard({ journal }: { journal: Journal }) {
  return (
    <div
      className="bg-transparent space-y-4 rounded-md p-2 border-solid border border-gray-100 dark:border-gray-800"
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
          <div className="text-sm text-sky-500">
            {format(parseISO(journal.from), "dd MMM")} -{" "}
            {format(parseISO(journal.to), "dd MMM")}
          </div>
          <TripMateList tripMates={journal.tripMates} />
        </div>
      </div>
    </div>
  )
}
