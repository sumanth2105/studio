
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockVerificationRequests } from '@/lib/data';
import type { VerificationRequest, VerificationRequestStatus } from '@/lib/types';
import { MoreHorizontal, CheckCircle, ShieldAlert, FileWarning } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const statusStyles: Record<VerificationRequestStatus, string> = {
  'Pending Verification': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Additional Documents Required': 'bg-blue-100 text-blue-800 border-blue-200',
  'Verified': 'bg-green-100 text-green-800 border-green-200',
  'Rejected': 'bg-red-100 text-red-800 border-red-200',
};

export default function HospitalVerificationPage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<VerificationRequest[]>(mockVerificationRequests);

  const handleAction = (requestId: string, action: string) => {
    // In a real app, this would trigger an API call.
    console.log(`Performing action: ${action} on request: ${requestId}`);
    toast({
        title: `Action: ${action}`,
        description: `Request ${requestId} has been updated.`,
    });

    // For demo purposes, we can update the status locally.
    if (action === 'Verify') {
        setRequests(reqs => reqs.filter(r => r.id !== requestId));
    }
     if (action === 'Request Documents') {
        setRequests(reqs => reqs.map(r => r.id === requestId ? { ...r, status: 'Additional Documents Required' } : r));
    }
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Verification Requests</CardTitle>
          <CardDescription>
            Review and approve hospitals waiting to join the network. Monitor
            compliance and trustworthiness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trust Score</TableHead>
                <TableHead>Trust Score Analysis</TableHead>
                <TableHead>Claims</TableHead>
                <TableHead>Dispute %</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-medium">{req.name}</div>
                      <div className="text-sm text-muted-foreground">{req.registrationId}</div>
                    </TableCell>
                    <TableCell>{new Date(req.dateOfRequest).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn('font-semibold', statusStyles[req.status])}>
                            {req.status}
                        </Badge>
                    </TableCell>
                     <TableCell>
                        <span className={cn(
                            "font-semibold",
                            req.trustScore > 90 ? 'text-green-600' : req.trustScore > 80 ? 'text-yellow-600' : 'text-red-600'
                        )}>
                            {req.trustScore}
                        </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">{req.trustScoreAnalysis}</TableCell>
                    <TableCell>{req.claimsCount}</TableCell>
                     <TableCell>{(req.disputeRatio * 100).toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction(req.id, 'Verify')}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500"/> Verify Hospital
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction(req.id, 'Request Documents')}>
                                <FileWarning className="mr-2 h-4 w-4 text-blue-500" /> Request Documents
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleAction(req.id, 'Flag for Audit')}>
                                <ShieldAlert className="mr-2 h-4 w-4"/> Flag for Audit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No pending hospital verification requests.
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
