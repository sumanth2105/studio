
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  DollarSign,
  HeartPulse,
  HospitalIcon,
  User,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  FileDown,
  Lightbulb,
  ThumbsDown,
  ThumbsUp,
  CircleHelp,
} from 'lucide-react';
import { mockClaims, mockHolder, mockHospital } from '@/lib/data';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';
import { ClaimExplanation } from '@/components/dashboard/claim-explanation';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Claim } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

const VerificationIndicator = ({
  status,
  text,
}: {
  status: 'passed' | 'attention' | 'failed';
  text: string;
}) => {
  const icons = {
    passed: <CheckCircle className="h-5 w-5 text-green-500" />,
    attention: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    failed: <XCircle className="h-5 w-5 text-destructive" />,
  };
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{text}</span>
      {icons[status]}
    </div>
  );
};

export default function ClaimReviewPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const { id } = params;
  const claim = mockClaims.find((c) => c.id === id);

  if (!claim || !['Manual Review', 'Insurance Claim Guaranteed'].includes(claim.status)) {
    notFound();
  }

  const holder = mockHolder;
  const hospital = mockHospital;
  const policy = holder.policies.find((p) => p.id === claim.policyId);

  const claimType =
    claim.status === 'Insurance Claim Guaranteed'
      ? 'Emergency Guaranteed Claim'
      : 'Manual Review';

  const handleDecision = (decision: 'Approved' | 'Rejected' | 'Pending') => {
    toast({
      title: `Claim ${decision}`,
      description: `Claim ${claim.id} has been marked as ${decision}.`,
    });
  };

  return (
    <div className="grid gap-6">
      {/* 1. Claim Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Claim Review: {claim.id}</CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mr-2">
                  {claimType}
                </Badge>
                Submitted on {new Date(claim.submissionDate).toLocaleString()}
              </CardDescription>
            </div>
            <ClaimStatusBadge status={claim.status} />
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-semibold">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                }).format(claim.claimAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">SLA</p>
              <p className="font-semibold">2 days remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* 4. Auto-Approval Explanation (If Applicable) */}
          {claim.status === 'Insurance Claim Guaranteed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-primary" />
                  Guaranteed Claim Explanation
                </CardTitle>
                <CardDescription>
                  This claim was automatically guaranteed by the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ClaimExplanation
                  claim={claim}
                  holder={holder}
                  hospital={hospital}
                />
              </CardContent>
              <CardFooter className="gap-2">
                <Button>
                  <CheckCircle className="mr-2" /> Verify Guaranteed Approval
                </Button>
                <Button variant="outline">
                  <AlertTriangle className="mr-2" /> Move to Manual Investigation
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* 5. Medical Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Documents Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claim.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-primary hover:underline cursor-pointer">
                        {doc.name}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 6. Billing & Cost Review */}
          <Card>
            <CardHeader>
              <CardTitle>Billing & Cost Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Billing Anomaly Detected</AlertTitle>
                <AlertDescription>
                  Potential duplicate charge found for "Room Rent" on Day 2.
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                {/* Itemized bill table would go here */}
                <p className="text-sm text-muted-foreground">
                  (Itemized hospital bill would be displayed here)
                </p>
              </div>
            </CardContent>
          </Card>

           {/* 8. Audit History */}
          <Card>
            <CardHeader>
              <CardTitle>Claim History & Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {claim.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="bg-muted rounded-full p-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      {index < claim.timeline.length - 1 && (
                        <div className="w-px h-full bg-border"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{event.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* 2. Patient & Policy Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User /> Patient & Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Holder Trust Score</p>
                <p className="text-2xl font-bold text-primary">{holder.trustScore}</p>
              </div>
              <VerificationIndicator status="passed" text="Patient Verified" />
              <VerificationIndicator status="passed" text="Policy Active" />
              <VerificationIndicator status="attention" text="PED Check" />
              <VerificationIndicator status="passed" text="Coverage Eligible" />
            </CardContent>
          </Card>

          {/* 3. Hospital Verification Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HospitalIcon /> Hospital Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Hospital Trust Score</p>
                <p className="text-2xl font-bold text-primary">{hospital.trustScore}</p>
              </div>
              <VerificationIndicator status="passed" text="Network Hospital" />
              <VerificationIndicator status="passed" text="Compliance OK" />
            </CardContent>
          </Card>
          
          {/* 7. Claim Decision Panel */}
          <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>Final Decision</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea placeholder="Mandatory remarks for rejection or pending status..." />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                 <Button variant="outline" className="w-full" onClick={() => handleDecision('Pending')}>
                    <CircleHelp className="mr-2"/> Keep Pending / Need Info
                </Button>
                <Button variant="destructive" className="w-full" onClick={() => handleDecision('Rejected')}>
                    <ThumbsDown className="mr-2"/> Reject Claim
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleDecision('Approved')}>
                    <ThumbsUp className="mr-2"/> Approve Claim
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
