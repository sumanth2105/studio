
'use client';

import Link from 'next/link';
import {
  HeartPulse,
  Hospital,
  Shield,
  Files,
  User,
  ShieldCheck,
  UploadCloud,
  LogOut,
  Heart,
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
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { UserRole } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    // In a real app, this would come from an auth context.
    // For now, we'll use localStorage.
    const role = localStorage.getItem('userRole') as UserRole;
    setUserRole(role || 'holder');
  }, []);

  const getIsActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const renderSidebarContent = () => {
    if (!userRole) return null;

    switch (userRole) {
      case 'holder':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard')}>
                <Link href="/dashboard">
                  <User />
                  Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={getIsActive('/dashboard/trust-score')}
              >
                <Link href="/dashboard/trust-score">
                  <Shield />
                  Trust Score
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={getIsActive('/dashboard/health-records')}
              >
                <Link href="/dashboard/health-records">
                  <HeartPulse />
                  Health Records
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={getIsActive('/dashboard/my-claims')}
              >
                <Link href="/dashboard/my-claims">
                  <Files />
                  My Claims
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={getIsActive('/dashboard/personal-info')}
              >
                <Link href="/dashboard/personal-info">
                  <User />
                  Personal Info
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={getIsActive('/dashboard/documents')}
              >
                <Link href="/dashboard/documents">
                  <UploadCloud />
                  Documents
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={getIsActive('/dashboard/consent')}
              >
                <Link href="/dashboard/consent">
                  <Heart />
                  Consent
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      case 'hospital':
        return (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={getIsActive('/dashboard/hospital')}
            >
              <Link href="/dashboard/hospital">
                <Hospital />
                Hospital Portal
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      case 'insurer':
        return (
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={getIsActive('/dashboard/insurer')}
            >
              <Link href="/dashboard/insurer">
                <ShieldCheck />
                Insurer Portal
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      default:
        return null;
    }
  };

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
            <h1 className="text-xl font-bold font-headline text-primary">
              Suraksha Kavach
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>{renderSidebarContent()}</SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="outline" asChild>
            <Link href="/login">
              <LogOut className="mr-2" /> Switch Role
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
