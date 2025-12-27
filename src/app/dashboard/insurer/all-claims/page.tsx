
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockClaims, mockHolder, mockHospital } from '@/lib/data';
import type { Claim } from '@/lib/types';
import { Download, MoreHorizontal, FileWarning, Send, MessageSquarePlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';

function ApprovedClaimsTab() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const approvedClaims = mockClaims.filter(
    (c) => c.status === 'Approved' || c.status === 'Insurance Claim Guaranteed' || c.status === 'Settled'
  );

  const getApprovalType = (claim: Claim) => {
    return claim.timeline.some((t) => t.status === 'Insurance Claim Guaranteed')
      ? 'Guaranteed'
      : 'Manual';
  };

  const getSettlementStatus = (claim: Claim) => {
    return claim.status === 'Settled' ? 'Settled' : 'Pending Settlement';
  };

  const getApprovalTimestamp = (claim: Claim) => {
    if (!isClient) return '';
    const approvalEvent = claim.timeline.find(t => t.status === 'Approved' || t.status === 'Insurance Claim Guaranteed');
    return approvalEvent ? new Date(approvalEvent.timestamp).toLocaleString() : 'N/A';
  }

  const handleInitiateSettlement = (claimId: string) => {
    toast({
      title: 'Settlement Initiated',
      description: `Settlement process started for claim ${claimId}.`,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Claim ID</TableHead>
          <TableHead>Holder</TableHead>
          <TableHead>Hospital</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Approval Type</TableHead>
          <TableHead>Approved On</TableHead>
          <TableHead>Settlement Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {approvedClaims.length > 0 ? (
          approvedClaims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="font-medium">{claim.id}</TableCell>
              <TableCell>{mockHolder.name}</TableCell>
              <TableCell>{mockHospital.name}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(claim.claimAmount)}
              </TableCell>
              <TableCell>
                <Badge variant={getApprovalType(claim) === 'Guaranteed' ? 'default' : 'secondary'}>
                  {getApprovalType(claim)}
                </Badge>
              </TableCell>
              <TableCell>{getApprovalTimestamp(claim)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(
                  getSettlementStatus(claim) === 'Settled' ? 'text-green-600 border-green-400' : 'text-amber-600 border-amber-400'
                )}>
                  {getSettlementStatus(claim)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleInitiateSettlement(claim.id)} disabled={getSettlementStatus(claim) === 'Settled'}>
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 8.5a2.5 2.5 0 0 0-5 0V12h5v-3.5Z" /><path d="M8 12v3.5a2.5 2.5 0 1 0 5 0V12H8Z" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.9 4.9 1.4 1.4" /><path d="m17.7 17.7 1.4 1.4" /><path d="m2 12 h2" /><path d="m20 12 h2" /><path d="m4.9 19.1 1.4-1.4" /><path d="m17.7 6.3 1.4-1.4" /></svg>
                      Initiate Settlement
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Download Summary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
              No approved claims found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function RejectedPendingClaimsTab() {
  const { toast } = useToast();

  const relevantClaims = mockClaims.filter(
    (c) => c.status === 'Rejected' || c.status === 'Manual Review'
  );

  const getReason = (claim: Claim) => {
    if (claim.status === 'Rejected') {
      const rejectedEvent = claim.timeline.find(t => t.status === 'Rejected');
      return rejectedEvent?.description || 'Reason not specified.';
    }
    if (claim.status === 'Manual Review') {
      const manualReviewEvent = claim.timeline.find(t => t.status === 'Manual Review');
      return manualReviewEvent?.description || 'Pending review.';
    }
    return 'N/A';
  }

  const handleAction = (claimId: string, action: string) => {
    toast({
      title: `Action: ${action}`,
      description: `Action performed on claim ${claimId}.`,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Claim ID</TableHead>
          <TableHead>Holder</TableHead>
          <TableHead>Hospital</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reason / Notes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {relevantClaims.length > 0 ? (
          relevantClaims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="font-medium">{claim.id}</TableCell>
              <TableCell>{mockHolder.name}</TableCell>
              <TableCell>{mockHospital.name}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(claim.claimAmount)}
              </TableCell>
              <TableCell>
                <ClaimStatusBadge status={claim.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                {getReason(claim)}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" disabled={claim.status === 'Rejected'}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction(claim.id, 'Request Documents')}>
                      <FileWarning className="mr-2 h-4 w-4" />
                      Request Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction(claim.id, 'Send Reminder')}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reminder to Hospital
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction(claim.id, 'Add Remarks')}>
                      <MessageSquarePlus className="mr-2 h-4 w-4" />
                      Add/Edit Remarks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No rejected or pending claims found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


export default function AllClaimsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>
            View and manage all claims from one central location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="approved">
            <TabsList>
              <TabsTrigger value="approved">Approved & Settled</TabsTrigger>
              <TabsTrigger value="rejected_pending">Rejected & Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="approved" className="mt-4">
              <ApprovedClaimsTab />
            </TabsContent>
            <TabsContent value="rejected_pending" className="mt-4">
              <RejectedPendingClaimsTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
