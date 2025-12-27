
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
import { Download, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ApprovedClaimsPage() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const approvedClaims = mockClaims.filter(
    (c) => c.status === 'Approved' || c.status === 'Auto-Approved' || c.status === 'Settled'
  );

  const getApprovalType = (claim: Claim) => {
    return claim.timeline.some((t) => t.status === 'Auto-Approved')
      ? 'Auto-Approved'
      : 'Manual';
  };

  const getSettlementStatus = (claim: Claim) => {
    return claim.status === 'Settled' ? 'Settled' : 'Pending Settlement';
  };
  
  const getApprovalTimestamp = (claim: Claim) => {
      if (!isClient) return '';
      const approvalEvent = claim.timeline.find(t => t.status === 'Approved' || t.status === 'Auto-approved');
      return approvalEvent ? new Date(approvalEvent.timestamp).toLocaleString() : 'N/A';
  }

  const handleInitiateSettlement = (claimId: string) => {
    toast({
      title: 'Settlement Initiated',
      description: `Settlement process started for claim ${claimId}.`,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Approved Claims</CardTitle>
          <CardDescription>
            View and track the settlement status of all approved claims.
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
                        <Badge variant={getApprovalType(claim) === 'Auto-Approved' ? 'default' : 'secondary'}>
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
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 8.5a2.5 2.5 0 0 0-5 0V12h5v-3.5Z"/><path d="M8 12v3.5a2.5 2.5 0 1 0 5 0V12H8Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="m2 12 h2"/><path d="m20 12 h2"/><path d="m4.9 19.1 1.4-1.4"/><path d="m17.7 6.3 1.4-1.4"/></svg>
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
        </CardContent>
      </Card>
    </div>
  );
}
