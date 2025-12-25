
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Shield,
  Users,
  FileText,
  Heart,
  User,
} from 'lucide-react';
import { mockHolder } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import Link from 'next/link';

export default function ProfilePage() {
  const { name, trustScore, policies, emergencyNominee } = mockHolder;
  const activePolicy = policies.find((p) => p.status === 'Active');

  return (
    <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {name}!</CardTitle>
            <CardDescription>
              Here's an overview of your Suraksha Kavach account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
              <TrustScoreGauge score={trustScore} />
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
           <Link href="/dashboard/personal-info" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Update Profile</span>
           </Link>
            <Link href="/dashboard/documents" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">View & Upload Documents</span>
           </Link>
            <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                <Heart className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Consent Preferences</span>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
