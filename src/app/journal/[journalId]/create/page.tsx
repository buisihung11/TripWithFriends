"use client"

import { OurFileRouter } from "@/app/api/uploadthing/core"
import { FileDialog } from "@/components/file-dialog"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Shell } from "@/components/ui/shell"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

import { Zoom } from "@/components/zoom-image"
import { cn, isArrayOfFile } from "@/lib/utils"
import { FileWithPreview } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Attraction, EnumAttractionType } from "@prisma/client"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const createAttractionSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  address: z.string().nullable(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  attractionType: z
    .nativeEnum(EnumAttractionType)
    .default(EnumAttractionType.OTHERS),
})

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

interface CreateAttractionProps {
  params: { journalId: string }
}

export default function CreateAttractionPage({
  params,
}: CreateAttractionProps) {
  const { toast } = useToast()
  const router = useRouter()

  const [files, setFiles] = useState<FileWithPreview[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isPending, startTransition] = useTransition()
  const { isUploading, startUpload } = useUploadThing("imageUploader")

  // TODO: get the selectedDay from the query params

  const form = useForm<z.infer<typeof createAttractionSchema>>({
    resolver: zodResolver(createAttractionSchema),
    defaultValues: {
      name: "",
      attractionType: EnumAttractionType.OTHERS,
      link: "",
      description: "",
      address: "",
    },
  })
  const previews = form.watch("images") as FileWithPreview[] | null
  const selectedAttractionType = form.watch("attractionType")

  const onSubmit = async (data: z.infer<typeof createAttractionSchema>) => {
    console.log(data)
    startTransition(async () => {
      try {
        setIsSubmitting(true)

        // await checkProductAction({
        //   name: data.name,
        // })

        const images = isArrayOfFile(data.images)
          ? await startUpload(data.images).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.fileKey,
                name: image.fileKey.split("_")[1] ?? image.fileKey,
                url: image.fileUrl,
              }))
              return formattedImages ?? null
            })
          : null

        const response = await fetch(
          `/api/journal/${params.journalId}/attractions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: data.name,
              attractionType: data.attractionType,
              link: data.link,
              description: data.description,
              address: data.address,
              imageUrl: images?.[0]?.url ?? null,
              goOnDate: new Date(),
            }),
          }
        )

        console.log(response)

        if (!response?.ok) {
          toast({
            title: "Something went wrong.",
            description: "Your entry was not saved. Please try again.",
            variant: "destructive",
          })
          return
        }

        const createdAttraction = (await response.json()) as Attraction
        console.log(createdAttraction)
        toast({
          title: `Attraction ${createdAttraction.name} created successfully`,
        })

        form.reset()
        setFiles(null)
        router.refresh()
      } catch (err) {
        console.log(err)
        toast({
          title: "Something went wrong",
          variant: "destructive",
        })
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <Shell>
      <Header
        title="Create new attraction"
        description="Create new attraction for your trip"
        size="sm"
      />

      {/* CREATE ATTRACTION FORM */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-2xl grid-cols-12 flex-col gap-4"
        >
          <FormItem className="col-span-12">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Effiel Tower" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>

          <FormItem className="col-span-12">
            <FormLabel>Category</FormLabel>
            <ScrollArea className="w-full">
              <div className="flex w-full flex-nowrap gap-2">
                {Object.values(EnumAttractionType).map((type) => (
                  <Card
                    key={type.toLowerCase()}
                    className={cn(
                      "w-20 px-1 py-2 text-center",
                      selectedAttractionType === type && "border-primary"
                    )}
                    onClick={() => {
                      form.setValue("attractionType", type)
                    }}
                  >
                    <Image
                      src={`/images/icons/${type.toLowerCase()}.png`}
                      width={40}
                      height={40}
                      alt={type}
                      className="mx-auto mb-1"
                    />
                    <p className="text-xs capitalize">{type.toLowerCase()}</p>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </FormItem>

          <FormItem className="col-span-12 flex w-full flex-col">
            <FormLabel>Images</FormLabel>
            {previews?.length ? (
              <div className="flex items-center gap-2">
                {previews.map((file: any) => (
                  <Zoom key={file.name}>
                    <Image
                      src={file.preview}
                      alt={file.name}
                      className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                      width={80}
                      height={80}
                    />
                  </Zoom>
                ))}
              </div>
            ) : null}
            <FormControl>
              <FileDialog
                setValue={form.setValue}
                name="images"
                maxFiles={1}
                maxSize={1024 * 1024 * 4}
                files={files}
                setFiles={setFiles}
                isUploading={isUploading}
                disabled={isPending}
              />
            </FormControl>
          </FormItem>

          <FormItem className="col-span-12">
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter link here" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>

          <FormItem className="col-span-12">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Street" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>

          <FormItem className="col-span-12">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Some description for this place"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>

          <Button className="col-span-12" disabled={isSubmitting} type="submit">
            {isSubmitting && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </Shell>
  )
}
