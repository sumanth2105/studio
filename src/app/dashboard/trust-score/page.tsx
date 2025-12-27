
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
  FileCheck,
  CalendarClock,
  FileText,
  BadgePercent,
  ShieldBan,
  ShieldCheck,
  UserCheck,
  HeartPulse,
} from 'lucide-react';
import { mockHolder, mockClaims } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { calculateTrustScore } from '@/lib/trust-score';
import { Progress } from '@/components/ui/progress';

export default function TrustScorePage() {
  // Recalculate score on the client
  const scoreResult = calculateTrustScore(mockHolder, mockClaims);
  const { finalScore, category, breakdown, explanationPoints } = scoreResult;

  const scoreFactors = [
    {
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      title: 'Identity Verification',
      score: breakdown.identity.score,
      maxScore: 20,
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-primary" />,
      title: 'Policy Health',
      score: breakdown.policyHealth.score,
      maxScore: 20,
    },
    {
      icon: <CalendarClock className="h-6 w-6 text-primary" />,
      title: 'Payment Behavior',
      score: breakdown.paymentBehavior.score,
      maxScore: 25,
    },
    {
      icon: <FileCheck className="h-6 w-6 text-primary" />,
      title: 'Claim Behavior',
      score: breakdown.claimBehavior.score,
      maxScore: 20,
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: 'Document Completeness',
      score: breakdown.documentCompleteness.score,
      maxScore: 10,
    },
    {
      icon: <ShieldBan className="h-6 w-6 text-destructive" />,
      title: 'Fraud & Risk Penalties',
      score: breakdown.fraudPenalties.score,
      maxScore: 0,
    },
  ];

  const improvementTips = [
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: 'Ensure all your KYC documents are uploaded and verified.',
      action: '/dashboard/documents',
      actionText: 'Upload Documents',
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: 'Keep your personal and policy information accurate.',
      action: '/dashboard/personal-info',
      actionText: 'Update Info',
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: 'Provide clear and complete information during claim submissions.',
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      text: 'Maintain a good record of timely premium payments.',
    },
  ];

  const getCategoryChipColor = () => {
    switch (category) {
      case 'Highly Trusted':
        return 'bg-green-100 text-green-800';
      case 'Trusted':
        return 'bg-blue-100 text-blue-800';
      case 'Moderate Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'High Risk':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Trust Score</CardTitle>
          <CardDescription>
            Your trust score is a dynamic rating that enables faster,
            pre-approved access to healthcare. A higher score unlocks instant approvals.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
            <TrustScoreGauge score={finalScore} />
            <div className={`mt-4 px-3 py-1 text-sm font-semibold rounded-full ${getCategoryChipColor()}`}>
              {category}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-lg">Key Highlights</h3>
            <ul className="space-y-3">
              {explanationPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>
            Your Trust Score is calculated based on several key factors. Here’s how they are weighted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {scoreFactors.map((factor, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 w-full sm:w-1/3">
                <div className="flex-shrink-0">{factor.icon}</div>
                <h4 className="font-semibold">{factor.title}</h4>
              </div>
              <div className="w-full sm:w-2/3 flex items-center gap-4">
                <Progress value={(factor.score / factor.maxScore) * 100} className="h-2" />
                <span className="font-semibold w-24 text-right">
                  {factor.score} / {factor.maxScore}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>How to Improve Your Trust Score</CardTitle>
          </div>
          <CardDescription>
            Follow these tips to enhance your score and enjoy more benefits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {improvementTips.map((tip, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 mt-1">{tip.icon}</div>
                    <p className="text-sm">{tip.text}</p>
                  </div>
                  {tip.action && (
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <Link href={tip.action}>{tip.actionText}</Link>
                    </Button>
                  )}
                </div>
                {index < improvementTips.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
