import { notFound } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs"

import { journalConfig } from "@/config/journal"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { MainNav } from "@/components/main-nav"
import { JournalNav } from "@/components/nav"
// import SiteFooter from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"

interface JournalLayoutProps {
  children?: React.ReactNode
}

export default async function JournalLayout({ children }: JournalLayoutProps) {
  const { userId } = auth()
  const user = await currentUser()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={journalConfig.mainNav} />
          <UserAccountNav
            user={{
              name: user?.firstName || "User",
              image: user?.imageUrl || "notfound",
              email: user?.emailAddresses[0]?.emailAddress || "notfound",
            }}
          />
        </div>
      </header>
      <div className="flex-1 items-start md:container md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6 lg:py-8">
            <JournalNav items={journalConfig.sidebarNav} />
          </div>
          <div className="absolute bottom-2 left-0">
            <ModeToggle />
          </div>
        </aside>
        <main className="mb-10  min-h-[95vh] w-full  overflow-hidden py-2 lg:py-6">
          {children}
        </main>
      </div>
      {/* <SiteFooter className="border-t" /> */}
    </div>
  )
}
