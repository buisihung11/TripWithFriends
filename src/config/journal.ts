import { JournalConfig } from "@/types"

export const journalConfig: JournalConfig = {
  mainNav: [
    {
      title: "Journal",
      href: "/journal",
    },
    {
      title: "Billing",
      href: "/journal/billing",
    },
    {
      title: "Settings",
      href: "/journal/settings",
    },
  ],
  sidebarNav: [
    {
      title: "Journal",
      href: "/journal",
      icon: "post",
    },
    {
      title: "Billing",
      href: "/journal/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/journal/settings",
      icon: "settings",
    },
  ],
}
