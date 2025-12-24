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
  Shield,
  User,
  Users,
} from 'lucide-react';
import { mockClaims, mockHolder } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { ClaimsTable } from '@/components/dashboard/claims-table';

export default function HolderDashboardPage() {
  const { name, trustScore, policies, emergencyNominee } = mockHolder;
  const activePolicy = policies.find((p) => p.status === 'Active');

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your profile and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
             <div className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg cursor-pointer">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Update Profile</span>
             </div>
              <div className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg cursor-pointer">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">View Documents</span>
             </div>
              <div className="flex items-center gap-4 p-3 hover:bg-muted rounded-lg cursor-pointer">
                <Heart className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Consent Preferences</span>
             </div>
          </CardContent>
        </Card>
      </div>
      
      <ClaimsTable
        claims={mockClaims}
        title="Recent Claims"
        description="A summary of your recent insurance claims."
      />
    </div>
  );
}
