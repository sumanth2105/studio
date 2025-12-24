'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { mockHolder, mockInsurer, mockHospital } from '@/lib/data';
import type { UserRole } from '@/lib/types';
import { UserNav } from './user-nav';
import { useEffect, useState } from 'react';

export function Header() {
  const { isMobile } = useSidebar();
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as UserRole | null;
    setUserRole(role || 'holder');
  }, []);
  
  const user = userRole === 'holder' ? mockHolder : userRole === 'insurer' ? mockInsurer : mockHolder;

  const roleName: Record<UserRole, string> = {
    holder: 'Holder Portal',
    hospital: 'Hospital Portal',
    insurer: 'Insurer Portal',
  }

  if (!userRole) {
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
            <div className="flex items-center gap-2">
                {isMobile && <SidebarTrigger />}
            </div>
        </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <div className="flex items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <h1 className="text-lg font-semibold tracking-tight">{roleName[userRole]}</h1>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  );
}
