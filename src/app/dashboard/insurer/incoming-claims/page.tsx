
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
import { mockClaims, mockHolder, mockHospital } from '@/lib/data';
import type { Claim } from '@/lib/types';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';
import { cn } from '@/lib/utils';
import { ClaimReviewPanel } from '@/components/insurer/claim-review-panel';

export default function IncomingClaimsPage() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  // Filter for claims that need manual review
  const incomingClaims = mockClaims.filter(
    (c) => c.status === 'Manual Review' || c.status === 'Pending'
  );

  const handleSelectClaim = (claim: Claim) => {
    setSelectedClaim(claim);
  };
  
  const handleClosePanel = () => {
    setSelectedClaim(null);
  }

  const getSlaColor = (submissionDate: string) => {
    const hours = (new Date().getTime() - new Date(submissionDate).getTime()) / (1000 * 60 * 60);
    if (hours > 48) return 'text-destructive';
    if (hours > 24) return 'text-yellow-600';
    return 'text-green-600';
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <div className={cn("lg:col-span-2 transition-all duration-300", selectedClaim ? "lg:col-span-2" : "lg:col-span-3")}>
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Incoming Claims Queue</CardTitle>
            <CardDescription>
              Review and process claims requiring manual intervention.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Patient / Holder Score</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingClaims.length > 0 ? (
                  incomingClaims.map((claim) => (
                    <TableRow
                      key={claim.id}
                      onClick={() => handleSelectClaim(claim)}
                      className={cn(
                        "cursor-pointer",
                        selectedClaim?.id === claim.id && 'bg-accent'
                      )}
                    >
                      <TableCell className="font-medium">{claim.id}</TableCell>
                      <TableCell>{mockHospital.name}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                           <span className='font-semibold'>{mockHolder.name}</span>
                           <span className='text-xs text-muted-foreground'>({mockHolder.trustScore})</span>
                        </div>
                      </TableCell>
                       <TableCell>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(claim.claimAmount)}
                      </TableCell>
                       <TableCell className={cn("font-mono text-xs", getSlaColor(claim.submissionDate))}>
                        {Math.round((new Date().getTime() - new Date(claim.submissionDate).getTime()) / (1000 * 60 * 60))}h ago
                      </TableCell>
                      <TableCell>
                        <ClaimStatusBadge status={claim.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No incoming claims to review.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <div className={cn("lg:col-span-1 transition-all duration-300", selectedClaim ? "block" : "hidden")}>
          {selectedClaim && (
              <ClaimReviewPanel 
                claim={selectedClaim} 
                holder={mockHolder}
                hospital={mockHospital}
                onClose={handleClosePanel}
              />
          )}
      </div>
    </div>
  );
}
