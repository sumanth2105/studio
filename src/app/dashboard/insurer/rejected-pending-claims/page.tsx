
'use client';

import { useState } from 'react';
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
import { MoreHorizontal, FileWarning, Send, MessageSquarePlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';

export default function RejectedPendingClaimsPage() {
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
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Rejected & Pending Claims</CardTitle>
          <CardDescription>
            Review claims that have been rejected or require additional information for processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
