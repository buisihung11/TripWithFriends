import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import Image from "next/image"
import { Attraction } from "@prisma/client"

interface AttractionItemProps {
  attraction: Attraction
}

export default function AttractionItem({ attraction }: AttractionItemProps) {
  return (
    <Card className=" flex flex-row items-center gap-2 p-2">
      <div className=" text-center">
        <Image
          className="mx-auto"
          src={`/images/icons/${
            attraction?.attractionType?.toLowerCase() || "other"
          }.png`}
          alt="icon"
          width={32}
          height={32}
        />
        {/* <p className="truncate text-xs text-slate-500">
        {attraction?.type}
      </p> */}
      </div>
      <div className="flex-auto">
        <h4 className="truncate text-lg font-semibold tracking-tight">
          {attraction.name}
        </h4>
        <p className="text-sm text-slate-500">{attraction.description}</p>
      </div>
      <div className="">
        <Button
          variant="outline"
          size="icon"
          className="flex flex-col items-center rounded-full p-1"
        >
          <Icons.heart
            className={cn(
              attraction.liked && "fill-fuchsia-600 stroke-fuchsia-500"
            )}
          />
          <p
            className={cn(
              "block text-[10px]/[12px]",
              attraction.liked && "text-fuchsia-600"
            )}
          >
            {attraction.likedCount}
          </p>
        </Button>
      </div>
    </Card>
  )
}
