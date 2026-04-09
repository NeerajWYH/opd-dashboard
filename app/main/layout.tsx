"use client"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Settings,
  TestTube2,
  StethoscopeIcon,
  Ambulance,
  Percent,
  BrainCircuit,
  Apple,
  Dumbbell,
  ReceiptText,
  Wallet,
  Landmark,
} from "lucide-react"
import { usePathname } from "next/navigation"

const navMain = [
  {
    title: "Blood Test",
    url: "/main/bloodtest",
    icon: TestTube2,
  },
  {
    title: "Doctor Consultant",
    url: "/main/doctorconsultant",
    icon: StethoscopeIcon,
  },
  {
    title: "Multi Specialist",
    url: "/main/multispecialist",
    icon: StethoscopeIcon,
  },
  // {
  //   title: "Medical Evacuation",
  //   url: "/main/medicalevacuation",
  //   icon: Ambulance,
  // },
  // {
  //   title: "AI Products",
  //   url: "/main/aiproducts",
  //   icon: BrainCircuit,
  // },
  {
    title: "Dietitian",
    url: "/main/dietitian",
    icon: Apple,
  },
  {
    title: "Physio",
    url: "/main/physio",
    icon: Dumbbell,
  },
  {
    title: "Medicine Discounts",
    url: "/main/medicinediscounts",
    icon: Percent,
  },
  {
    title: "Gym Vouchers",
    url: "/main/gymvouchers",
    icon: ReceiptText,
  },
  // {
  //   title: "Health Wallet",
  //   url: "/main/healthwallet",
  //   icon: Wallet,
  // },
  // {
  //   title: "State Govt Apps",
  //   url: "/main/stategovtapps",
  //   icon: Landmark,
  // },
]

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                render={
                  <Link href="/main">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <LayoutDashboard className="size-4" />
                    </div>
                    <span className="font-semibold">OPD Dashboard</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navMain.map((item) => {
                  const isActive = usePathname() === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        render={
                          <Link
                            href={item.url}
                            className="flex items-center gap-2"
                            data-active={isActive}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        }
                        isActive={isActive}
                        tooltip={item.title}
                        className="h-10 px-3"
                      />
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link href="/main/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
        </header>
        <div className="flex flex-1 flex-col p-5 px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
