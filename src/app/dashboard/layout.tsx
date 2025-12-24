import Link from 'next/link';
import {
  HeartPulse,
  Hospital,
  LayoutDashboard,
  ShieldCheck,
  User,
  Files,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m12 10 4 2-4 2-4-2 4-2z" />
            </svg>
            <h1 className="text-xl font-bold font-headline text-primary">Suraksha Kavach</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {/* Holder Section */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/dashboard">
                  <LayoutDashboard />
                  Holder Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Hospital Section */}
             <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/hospital">
                  <Hospital />
                  Hospital Portal
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Insurer Section */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/insurer">
                  <ShieldCheck />
                  Insurer Portal
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className='p-4'>
            <Button variant="outline" asChild>
                <Link href="/">
                    <User className="mr-2"/> Switch Role
                </Link>
            </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
