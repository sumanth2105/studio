
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
  FileText,
  HospitalIcon,
  ShieldCheck,
  User,
  X,
  ThumbsUp,
  ThumbsDown,
  CircleHelp,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import type { Claim, Holder, Hospital } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ClaimStatusBadge } from '../dashboard/claim-status-badge';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Link from 'next/link';

interface ClaimReviewPanelProps {
  claim: Claim;
  holder: Holder;
  hospital: Hospital;
  onClose: () => void;
}

export function ClaimReviewPanel({
  claim,
  holder,
  hospital,
  onClose,
}: ClaimReviewPanelProps) {
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDecision = (decision: 'Approved' | 'Rejected' | 'Pending') => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            toast({
                title: `Claim ${decision}`,
                description: `Claim ${claim.id} has been marked as ${decision}.`
            });
            setIsProcessing(false);
            onClose();
        }, 1500);
    }
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>Review Claim</CardTitle>
          <CardDescription>{claim.id}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 overflow-auto">
         <Button asChild className="w-full">
            <Link href={`/dashboard/insurer/claims/${claim.id}`}>
                View Full Details
                <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
         </Button>

        <Separator />

        {/* Key Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(claim.claimAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Diagnosis</span>
            <span className="font-semibold">{claim.diagnosis}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status</span>
            <ClaimStatusBadge status={claim.status} />
          </div>
        </div>

        <Separator />

        {/* Trust Scores */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Holder Score</p>
            <p className="text-lg font-bold text-primary">{holder.trustScore}</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">Hospital Score</p>
            <p className="text-lg font-bold text-primary">{hospital.trustScore}</p>
          </div>
        </div>

        <Separator />

        {/* Participants */}
        <div className="space-y-3">
            <h4 className='font-medium'>Participants</h4>
             <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground"/>
                <div>
                    <p className="font-semibold">{holder.name}</p>
                    <p className="text-xs text-muted-foreground">Policy: {holder.policies.find(p => p.id === claim.policyId)?.policyNumber}</p>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <HospitalIcon className="w-5 h-5 text-muted-foreground"/>
                <div>
                    <p className="font-semibold">{hospital.name}</p>
                    <p className="text-xs text-muted-foreground">Reg ID: {hospital.registrationId}</p>
                </div>
            </div>
        </div>
        
        <Separator />

         {/* Decision */}
         <div className="space-y-3">
            <h4 className='font-medium'>Decision Remarks</h4>
            <Textarea placeholder="Add mandatory remarks for rejection or pending status..." />
        </div>


      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
         <Button variant="outline" size="sm" onClick={() => handleDecision('Pending')} disabled={isProcessing}>
             <CircleHelp/> Pending
        </Button>
         <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => {}} disabled={isProcessing}>
             <ShieldAlert/> Flag Fraud
        </Button>
         <Button variant="destructive" className='col-span-2' onClick={() => handleDecision('Rejected')} disabled={isProcessing}>
            <ThumbsDown/> Reject Claim
        </Button>
        <Button className='col-span-2 bg-green-600 hover:bg-green-700' onClick={() => handleDecision('Approved')} disabled={isProcessing}>
             <ThumbsUp/> Approve Claim
        </Button>
      </CardFooter>
    </Card>
  );
}
