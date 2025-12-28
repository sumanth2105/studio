
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
import { mockClaims } from '@/lib/data';
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
import { useUserContext } from '@/context/user-context';

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
  const { holder, setHolder, isLoading: isUserContextLoading } = useUserContext();
  const [scoreResult, setScoreResult] = React.useState<CalculateTrustScoreOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true); // Start loading initially
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useUser();
  const { documents: uploadedDocuments, isLoading: isLoadingDocuments } = useDocuments(user?.uid);
  const initialLoadDone = React.useRef(false);

  const fetchScore = React.useCallback(async () => {
    if (!holder || !uploadedDocuments) return;

    setIsLoading(true);
    setError(null);
    try {
      const activePolicy = holder.policies.find(p => p.status === 'Active');
      const requiredDocs = documentListForCheck.filter(d => d.required);
      const uploadedDocTypes = new Set(uploadedDocuments.map(d => d.fileType));
      const allRequiredDocsUploaded = requiredDocs.every(d => uploadedDocTypes.has(d.id));
      const premiumOverdueDays = activePolicy
        ? Math.max(0, differenceInDays(new Date(), new Date(activePolicy.lastPremiumPaymentDate)) - 30)
        : 0;

      const result = await calculateTrustScore({
        verification: {
          ...holder.verification,
          uploadedRequiredDocuments: allRequiredDocsUploaded,
        },
        policy: {
          status: activePolicy?.status || 'Inactive',
          tenureMonths: activePolicy ? differenceInMonths(new Date(), new Date(activePolicy.startDate)) : 0,
          premiumOverdueDays: premiumOverdueDays,
        },
        paymentHistory: {
          onTimeRatio: holder.paymentHistory.onTimeRatio, 
        },
        claimHistory: {
          totalClaims: mockClaims.length,
          rejectedClaims: mockClaims.filter(c => c.status === 'Rejected').length,
        },
        fraudIndicators: holder.fraudIndicators,
      });

      setScoreResult(result);
      if (result) {
        setHolder(prevHolder => {
            if (prevHolder && prevHolder.trustScore !== result.score) {
                return { ...prevHolder, trustScore: result.score };
            }
            return prevHolder;
        });
      }
    } catch (e) {
      console.error(e);
      setError('Could not calculate trust score. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [holder, uploadedDocuments, setHolder]);

  React.useEffect(() => {
    // Only run on initial load when all data is ready
    if (!initialLoadDone.current && !isUserContextLoading && !isLoadingDocuments && holder && uploadedDocuments) {
        initialLoadDone.current = true; // Prevent this from running again automatically
        fetchScore();
    } else if (!isUserContextLoading && !isLoadingDocuments && !initialLoadDone.current) {
        // Handle case where data is ready but fetch hasn't run, and it's not the initial auto-run
        setIsLoading(false);
    }
  }, [isUserContextLoading, isLoadingDocuments, holder, uploadedDocuments, fetchScore]);

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
  
  const handleRecalculate = () => {
    fetchScore();
  }
  
  const isPageLoading = (isLoading || isUserContextLoading || isLoadingDocuments) && !scoreResult;

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
        {isPageLoading ? (
            <CardContent>
                <div className="flex flex-col justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-muted-foreground">Calculating your trust score...</p>
                </div>
            </CardContent>
        ) : error ? (
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
        ) : scoreResult && holder ? (
          <CardContent className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
              <TrustScoreGauge score={holder.trustScore} />
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
        ) : (
            <CardContent>
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-muted-foreground mb-4">Click the button below to calculate your score.</p>
                </div>
            </CardContent>
        )}
         <CardFooter className="justify-center pt-6">
            <Button onClick={handleRecalculate} disabled={isLoading || isUserContextLoading || isLoadingDocuments}>
                <RefreshCw className={`mr-2 h-4 w-4 ${(isLoading || isUser_ContextLoading || isLoadingDocuments) ? 'animate-spin' : ''}`} />
                Recalculate Score
            </Button>
        </CardFooter>
      </Card>

      {scoreResult && (
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
                <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
