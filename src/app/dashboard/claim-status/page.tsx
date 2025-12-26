
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockClaims, mockHolder } from '@/lib/data';
import type { Claim } from '@/lib/types';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Hourglass, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
      case 'Manual Review':
        return <Hourglass className="h-5 w-5 text-blue-500" />;
      case 'Auto-Approved':
      case 'Approved':
      case 'Settled':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
};

export default function ClaimStatusPage() {
  const activeClaims = mockClaims.filter(
    (c) => c.status !== 'Settled' && c.status !== 'Rejected'
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Claim Status</CardTitle>
          <CardDescription>
            Track the real-time status of all ongoing insurance claims. This page is read-only.
          </CardDescription>
        </CardHeader>
      </Card>
      
      {activeClaims.length === 0 && (
         <Card>
            <CardContent className="pt-6">
                <Alert>
                    <Hourglass className="h-4 w-4" />
                    <AlertTitle>No Active Claims</AlertTitle>
                    <AlertDescription>
                        There are currently no claims being processed.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {activeClaims.map((claim) => (
          <Card key={claim.id}>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <CardTitle className="text-xl">Claim ID: {claim.id}</CardTitle>
                        <CardDescription>
                            For patient: {mockHolder.name} | Diagnosis: {claim.diagnosis}
                        </CardDescription>
                    </div>
                    <div className="flex-shrink-0">
                       <ClaimStatusBadge status={claim.status} />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-3">Claim Timeline</h4>
                         <div className="space-y-6">
                            {claim.timeline.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="bg-muted rounded-full p-2">
                                    {getTimelineIcon(event.status)}
                                    </div>
                                    {index < claim.timeline.length - 1 && (
                                    <div className="w-px h-full bg-border"></div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold">{event.status}</p>
                                    <p className="text-sm text-muted-foreground">{event.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                         <h4 className="font-semibold mb-3">Details</h4>
                         <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Claim Amount:</span>
                                <span className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(claim.claimAmount)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Submission Date:</span>
                                <span className="font-semibold">{new Date(claim.submissionDate).toLocaleDateString()}</span>
                            </div>
                         </div>
                         <div className="mt-6">
                             <Button asChild>
                                <Link href={`/dashboard/claims/${claim.id}`}>View Full Details</Link>
                             </Button>
                         </div>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
