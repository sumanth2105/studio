'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Loader2, AlertCircle } from 'lucide-react';
import type { Claim, Holder, Hospital } from '@/lib/types';
import { explainClaimDecision } from '@/ai/flows/explain-claim-decisions';

interface ClaimExplanationProps {
  claim: Claim;
  holder: Holder;
  hospital: Hospital;
}

export function ClaimExplanation({ claim, holder, hospital }: ClaimExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExplanation = async () => {
    setIsLoading(true);
    setError(null);
    setExplanation(null);

    const activePolicy = holder.policies.find(p => p.id === claim.policyId);

    try {
      const result = await explainClaimDecision({
        holderTrustScore: holder.trustScore,
        hospitalTrustScore: hospital.trustScore,
        policyActive: activePolicy?.status === 'Active',
        claimAmount: claim.claimAmount,
        safetyCap: 100000, // Mock safety cap
        fraudFlags: claim.status === 'Manual Review',
        autoApprove: claim.status === 'Auto-Approved',
        medicalDocuments: claim.documents.map(d => d.name).join(', '),
        bills: `Total amount: ${claim.claimAmount}`,
        doctorNotes: claim.doctorNotes,
      });
      setExplanation(result.explanation);
    } catch (e) {
      console.error(e);
      setError('Could not generate explanation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch explanation on component mount
    getExplanation();
  }, [claim.id]);


  if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating explanation...
        </div>
      )
  }

   if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (explanation) {
    return (
      <Alert className="bg-primary/5 border-primary/20">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">AI-Powered Explanation</AlertTitle>
        <AlertDescription>
          <p className="text-foreground">{explanation}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
