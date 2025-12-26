
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Hourglass, ShieldCheck, TrendingUp, Users, Shield, FileText, CheckCircle, Hospital } from 'lucide-react';

export default function InsurerPage() {
  
  return (
    <div className="grid gap-6">
       <Card>
        <CardHeader>
          <CardTitle>Policy Overview</CardTitle>
          <CardDescription>
            A high-level snapshot of insurer exposure, risk, and portfolio health.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Active Policies</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12,540</div>
                 <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Holders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">9,832</div>
                 <p className="text-xs text-muted-foreground">Individual & Family Floater</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sum Insured</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', notation: 'compact' }).format(6270000000)}
                </div>
                 <p className="text-xs text-muted-foreground">Across all active policies</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Holder Trust Score</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-primary">82</div>
                <p className="text-xs text-muted-foreground">Healthy portfolio risk</p>
            </CardContent>
        </Card>
      </div>

       <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Network Hospitals</CardTitle>
                <CardDescription>Breakdown of network vs. non-network hospitals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Network Hospitals</span>
                    </div>
                    <span className="font-bold text-lg">450</span>
                 </div>
                 <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Hospital className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Non-Network Hospitals</span>
                    </div>
                    <span className="font-bold text-lg">120</span>
                 </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Policies Expiring Soon</CardTitle>
                <CardDescription>Policies nearing their renewal date in the next 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Hourglass className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Expiring Policies</span>
                    </div>
                    <span className="font-bold text-lg">892</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Avg. Trust Score of Expiring</span>
                    </div>
                    <span className="font-bold text-lg">78</span>
                 </div>
            </CardContent>
        </Card>
       </div>
    </div>
  );
}
