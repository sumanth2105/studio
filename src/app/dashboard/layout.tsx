
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
  FileSearch,
  FilePlus,
  History,
  Users,
  Building,
  BarChart,
  ShieldAlert,
  FileX,
  FileClock,
  ClipboardCheck,
  Inbox,
  LayoutGrid,
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
    if (path === '/dashboard' || path === '/dashboard/insurer') {
      return pathname === path;
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
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/hospital-profile')}>
                <Link href="/dashboard/hospital-profile">
                  <Building />
                  Hospital Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/verify-patient')}>
                <Link href="/dashboard/verify-patient">
                  <FileSearch />
                  Verify Patient
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/new-claim')}>
                <Link href="/dashboard/new-claim">
                  <FilePlus />
                  New Claim
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/claim-status')}>
                <Link href="/dashboard/claim-status">
                  <ShieldCheck />
                  Claim Status
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/claim-history')}>
                <Link href="/dashboard/claim-history">
                  <History />
                  Claim History
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/employee-security')}>
                <Link href="/dashboard/employee-security">
                  <Users />
                  Employee & Security
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        );
      case 'insurer':
        return (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer')}>
                <Link href="/dashboard/insurer">
                  <LayoutGrid />
                  Policy Overview
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer/incoming-claims')}>
                <Link href="/dashboard/insurer/incoming-claims">
                  <Inbox />
                  Incoming Claims
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer/hospital-verification')}>
                <Link href="/dashboard/insurer/hospital-verification">
                  <Hospital />
                  Hospital Verification
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer/approved-claims')}>
                <Link href="/dashboard/insurer/approved-claims">
                  <ClipboardCheck />
                  Approved Claims
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer/rejected-pending-claims')}>
                <Link href="/dashboard/insurer/rejected-pending-claims">
                  <FileClock />
                  Rejected / Pending
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer/fraud-risk-alerts')}>
                <Link href="/dashboard/insurer/fraud-risk-alerts">
                  <ShieldAlert />
                  Fraud / Risk Alerts
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={getIsActive('/dashboard/insurer/reports')}>
                <Link href="/dashboard/insurer/reports">
                  <BarChart />
                  Reports & Analytics
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
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
