
'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function HospitalRedirectPage() {
  useEffect(() => {
    // Redirect to the new main page for the hospital portal
    redirect('/dashboard/hospital-profile');
  }, []);

  return null;
}
