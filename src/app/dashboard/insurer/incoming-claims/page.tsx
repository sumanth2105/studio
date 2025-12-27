
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
import { intervalToDuration } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function IncomingClaimsPage() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const router = useRouter();

  // Filter for claims that need manual review or are auto-approved
  const incomingClaims = mockClaims.filter(
    (c) => c.status === 'Manual Review' || c.status === 'Insurance Claim Guaranteed'
  );

  const handleSelectClaim = (claim: Claim) => {
    setSelectedClaim(claim);
  };

  const handleRowClick = (claim: Claim) => {
    router.push(`/dashboard/insurer/claims/${claim.id}`);
  };

  const handleClosePanel = () => {
    setSelectedClaim(null);
  };

  const getSlaColor = (submissionDate: string) => {
    const days =
      (new Date().getTime() - new Date(submissionDate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days > 2) return 'text-destructive';
    if (days > 1) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatSlaDuration = (submissionDate: string) => {
    const duration = intervalToDuration({
      start: new Date(submissionDate),
      end: new Date(),
    });

    let formatted = '';
    if (duration.years && duration.years > 0) formatted += `${duration.years}y `;
    if (duration.months && duration.months > 0)
      formatted += `${duration.months}m `;
    if (duration.days && duration.days > 0) formatted += `${duration.days}d `;

    if (formatted === '') {
      const hours = Math.round(
        (new Date().getTime() - new Date(submissionDate).getTime()) /
          (1000 * 60 * 60)
      );
      if (hours > 0) return `${hours}h ago`;
      const minutes = Math.round(
        (new Date().getTime() - new Date(submissionDate).getTime()) / (1000 * 60)
      );
      return `${minutes}m ago`;
    }

    return `${formatted.trim()} ago`;
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Incoming Claims Queue</CardTitle>
          <CardDescription>
            Review and process claims requiring manual intervention or
            verification.
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
                    onClick={() => handleRowClick(claim)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium text-primary hover:underline">
                      {claim.id}
                    </TableCell>
                    <TableCell>{mockHospital.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{mockHolder.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({mockHolder.trustScore})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(claim.claimAmount)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-mono text-xs',
                        getSlaColor(claim.submissionDate)
                      )}
                    >
                      {formatSlaDuration(claim.submissionDate)}
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
  );
}
