
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Heart,
  User,
  Shield,
  Users,
  Copy,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Badge } from '@/components/ui/badge';
import { useUserContext } from '@/context/user-context';

export default function DashboardPage() {
    const { holder, isLoading } = useUserContext();

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }
    
    if (!holder) {
        return <div>Could not load user data.</div>
    }

    const { name, trustScore, policies, emergencyNominee, id: patientId } = holder;
    const activePolicy = policies.find((p) => p.status === 'Active');

  return (
    <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              Here's an overview of your Suraksha Kavach account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg space-y-4">
              <TrustScoreGauge score={trustScore} />
              <div className="text-center">
                 <p className="text-xs text-muted-foreground">Your Patient ID</p>
                 <Badge variant="secondary" className="text-lg font-mono tracking-wider cursor-pointer" title="Copy ID" onClick={() => navigator.clipboard.writeText(patientId)}>
                    {patientId}
                    <Copy className="ml-2 h-3 w-3"/>
                 </Badge>
              </div>
            </div>
            {activePolicy && (
              <div className="space-y-4 rounded-lg p-6 bg-primary/5">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary"/>
                    <h3 className="text-md font-semibold text-primary">Active Policy</h3>
                </div>
                <p className="font-bold text-lg text-foreground">{activePolicy.provider}</p>
                <div className="text-sm text-muted-foreground">
                  <p>Policy No: {activePolicy.policyNumber}</p>
                  <p>Coverage: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(activePolicy.coverage)}</p>
                </div>
              </div>
            )}
             <div className="space-y-4 rounded-lg p-6 bg-accent/5">
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-accent"/>
                    <h3 className="text-md font-semibold text-accent">Emergency Nominee</h3>
                </div>
                <p className="font-bold text-lg text-foreground">{emergencyNominee.name}</p>
                <p className="text-sm text-muted-foreground">{emergencyNominee.mobile}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
         <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>Manage your profile, documents, and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
           <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <User className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>Update your personal details, contact information, and more.</p>
                    <Button asChild>
                        <Link href="/dashboard/personal-info">Update Profile</Link>
                    </Button>
                </CardContent>
           </Card>
           <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <FileText className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Documents</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>View, upload, and manage your verification documents.</p>
                    <Button asChild>
                        <Link href="/dashboard/documents">Manage Documents</Link>
                    </Button>
                </CardContent>
           </Card>
           <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <Heart className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Consent Preferences</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>Control how your data is shared with hospitals and insurers.</p>
                     <Button asChild>
                        <Link href="/dashboard/consent">Manage Consent</Link>
                    </Button>
                </CardContent>
           </Card>
        </CardContent>
      </Card>
    </div>
  );
}
