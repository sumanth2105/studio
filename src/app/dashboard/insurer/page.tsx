import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimsTable } from '@/components/dashboard/claims-table';
import { mockClaims } from '@/lib/data';
import type { Claim } from '@/lib/types';
import { DollarSign, Hourglass, ShieldCheck, TrendingUp } from 'lucide-react';

export default function InsurerPage() {
  const manualReviewClaims = mockClaims.filter(
    (c) => c.status === 'Manual Review'
  );
  const approvedClaims = mockClaims.filter((c) =>
    ['Approved', 'Auto-Approved'].includes(c.status)
  );
  const totalClaimValue = mockClaims.reduce((acc, c) => acc + c.claimAmount, 0);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Claim Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalClaimValue)}
                </div>
                <p className="text-xs text-muted-foreground">in the last 30 days</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Claims for Review</CardTitle>
                <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{manualReviewClaims.length}</div>
                <p className="text-xs text-muted-foreground">awaiting manual approval</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Approval Rate</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">92.5%</div>
                <p className="text-xs text-muted-foreground">based on Trust Scores</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Flags</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">3</div>
                <p className="text-xs text-muted-foreground">cases flagged in last 7 days</p>
            </CardContent>
        </Card>
      </div>


      <Tabs defaultValue="review">
        <TabsList>
          <TabsTrigger value="review">Manual Review</TabsTrigger>
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="approved">Approved & Settled</TabsTrigger>
        </TabsList>
        <TabsContent value="review" className="mt-4">
          <ClaimsTable
            claims={manualReviewClaims}
            title="Claims for Manual Review"
            description="These claims require manual verification due to various flags."
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <ClaimsTable
            claims={mockClaims}
            title="All Submitted Claims"
            description="A complete list of all claims in the system."
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <ClaimsTable
            claims={approvedClaims}
            title="Approved & Settled Claims"
            description="Claims that have been successfully processed and settled."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
