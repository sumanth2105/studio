
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  ShieldBan,
  UserCheck,
  HeartPulse,
  CalendarClock,
  FileCheck,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { mockHolder, mockClaims } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  calculateTrustScore,
  type CalculateTrustScoreOutput,
} from '@/ai/flows/calculate-trust-score';
import { differenceInMonths } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TrustScorePage() {
  const [scoreResult, setScoreResult] =
    React.useState<CalculateTrustScoreOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchScore = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const activePolicy = mockHolder.policies.find(
          (p) => p.status === 'Active'
        );

        const result = await calculateTrustScore({
          verification: mockHolder.verification,
          policy: {
            status: activePolicy?.status || 'Inactive',
            tenureMonths: activePolicy
              ? differenceInMonths(new Date(), new Date(activePolicy.startDate))
              : 0,
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

    fetchScore();
  }, []);

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
          <p>No score data available.</p>
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
      </Card>
    </div>
  );
}
