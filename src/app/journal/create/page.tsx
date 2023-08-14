"use client"

import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { generateReactHelpers } from "@uploadthing/react/hooks"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn, isArrayOfFile } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Shell } from "@/components/ui/shell"
import { Header } from "@/components/header"
import { Zoom } from "@/components/zoom-image"

import "@uploadthing/react/styles.css"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileWithPreview, Journal } from "@/types"

import { useToast } from "@/components/ui/use-toast"
import { FileDialog } from "@/components/file-dialog"
import { Icons } from "@/components/icons"
import { OurFileRouter } from "@/app/api/uploadthing/core"

const createJournalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  from: z.date().nullable(),
  to: z.date().nullable(),
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
})

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export default function JournalPage() {
  const { toast } = useToast()
  const router = useRouter()

  const [files, setFiles] = useState<FileWithPreview[] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [isPending, startTransition] = useTransition()
  const { isUploading, startUpload } = useUploadThing("imageUploader")

  const form = useForm<z.infer<typeof createJournalSchema>>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: {
      title: "",
      from: null,
      to: null,
    },
  })

  const [fromDate, toDate] = form.watch(["from", "to"])
  const previews = form.watch("images") as FileWithPreview[] | null

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof createJournalSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
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

        const response = await fetch("/api/journal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            fromDate,
            toDate,
            imageUrl: images?.[0]?.url ?? null,
          }),
        })

        console.log(response)

        if (!response?.ok) {
          toast({
            title: "Something went wrong.",
            description: "Your entry was not saved. Please try again.",
            variant: "destructive",
          })
          return
        }

        const createdJournal = (await response.json()) as Journal
        console.log(createdJournal)
        toast({
          title: `Trip ${createdJournal.id} created successfully`,
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
        title="Create new trip"
        description="Crete new trip and share with friends"
        size="sm"
      />
      {/* CREATE JOURNAL FORM */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full max-w-2xl gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Trip to DK, Trip to Korea " {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col sm:flex-row items-start gap-4">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>From date</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>From date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-background"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>To date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>From date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-background"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormItem className="flex w-full flex-col">
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

          <Button disabled={isSubmitting} type="submit">
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
