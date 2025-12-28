
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { mockHolder, mockClaims } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Button } from '@/components/ui/button';
import {
  calculateTrustScore,
  type CalculateTrustScoreOutput,
} from '@/ai/flows/calculate-trust-score';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDocuments } from '@/hooks/use-documents';
import { useUser } from '@/firebase';

// Duplicating this list to avoid circular dependencies
const documentListForCheck: {
  id: string;
  name: string;
  required?: boolean;
}[] = [
  { id: 'aadhaar', name: 'Aadhaar Card', required: true },
  { id: 'pan', name: 'PAN Card' },
  { id: 'policy', name: 'Insurance Policy Document', required: true },
  { id: 'premium_proof', name: 'Premium Payment Proof', required: true },
  { id: 'bank_proof', name: 'Bank Proof', required: true },
  { id: 'self_declaration', name: 'Self-Declaration Form', required: true },
];

export default function TrustScorePage() {
  const [scoreResult, setScoreResult] =
    React.useState<CalculateTrustScoreOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { user } = useUser();
  const { documents: uploadedDocuments, isLoading: isLoadingDocuments } = useDocuments(user?.uid);

  const fetchScore = async () => {
    if (isLoadingDocuments) return; // Wait for documents to be loaded

    setIsLoading(true);
    setError(null);
    try {
      const activePolicy = mockHolder.policies.find(
        (p) => p.status === 'Active'
      );

      // Check for required documents
      const requiredDocs = documentListForCheck.filter(d => d.required);
      const uploadedDocTypes = new Set(uploadedDocuments?.map(d => d.fileType));
      const allRequiredDocsUploaded = requiredDocs.every(d => uploadedDocTypes.has(d.id));

      const premiumOverdueDays = activePolicy
        ? Math.max(0, differenceInDays(new Date(), new Date(activePolicy.lastPremiumPaymentDate)) - 30)
        : 0;

      const result = await calculateTrustScore({
        verification: {
          ...mockHolder.verification,
          uploadedRequiredDocuments: allRequiredDocsUploaded,
        },
        policy: {
          status: activePolicy?.status || 'Inactive',
          tenureMonths: activePolicy
            ? differenceInMonths(new Date(), new Date(activePolicy.startDate))
            : 0,
          premiumOverdueDays: premiumOverdueDays,
        },
        paymentHistory: {
          onTimeRatio: mockHolder.paymentHistory.onTimeRatio,
        },
        claimHistory: {
          totalClaims: mockClaims.length,
          rejectedClaims: mockClaims.filter((c) => c.status === 'Rejected')
            .length,
        },
        fraudIndicators: mockHolder.fraudIndicators,
      });
      setScoreResult(result);
    } catch (e) {
      console.error(e);
      setError('Could not calculate trust score. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryChipColor = (category?: string) => {
    switch (category) {
      case 'Highly Trusted':
        return 'bg-green-100 text-green-800';
      case 'Trusted':
        return 'bg-blue-100 text-blue-800';
      case 'Moderate Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'High Risk':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      );
    }

    if (!scoreResult) {
      return (
         <CardContent>
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-muted-foreground mb-4">Click the button below to calculate your latest trust score.</p>
            </div>
        </CardContent>
      );
    }

    return (
      <>
        <CardContent className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
            <TrustScoreGauge score={scoreResult.score} />
            <div
              className={`mt-4 px-3 py-1 text-sm font-semibold rounded-full ${getCategoryChipColor(
                scoreResult.category
              )}`}
            >
              {scoreResult.category}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-lg">Key Highlights</h3>
            <ul className="space-y-3">
              {scoreResult.explanation.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <CardTitle>How to Improve Your Trust Score</CardTitle>
            </div>
            <CardDescription>
              Follow these AI-powered suggestions to enhance your score.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scoreResult.suggestions.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Trust Score</CardTitle>
          <CardDescription>
            Your trust score is a dynamic rating that enables faster,
            pre-approved access to healthcare, powered by Gemini.
          </CardDescription>
        </CardHeader>
        {renderContent()}
         <CardFooter className="justify-center pt-6">
            <Button onClick={fetchScore} disabled={isLoading || isLoadingDocuments}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {scoreResult ? 'Recalculate Score' : 'Calculate Score'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
