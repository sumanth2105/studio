
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  FileCheck,
  History,
  TrendingUp,
  UploadCloud,
} from 'lucide-react';
import { mockHolder } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function TrustScorePage() {
  const { trustScore } = mockHolder;

  const scoreFactors = [
    {
      icon: <History className="h-6 w-6 text-primary" />,
      title: 'Payment Regularity',
      description:
        'Consistent and on-time premium payments build a strong foundation.',
    },
    {
      icon: <FileCheck className="h-6 w-6 text-primary" />,
      title: 'Claim History',
      description:
        'A history of legitimate and well-documented claims contributes positively.',
    },
    {
      icon: <UploadCloud className="h-6 w-6 text-primary" />,
      title: 'Document Completeness',
      description:
        'Keeping your KYC and policy documents up-to-date is crucial.',
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

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Trust Score</CardTitle>
          <CardDescription>
            Your trust score is a dynamic rating that enables faster,
            pre-approved access to healthcare.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
            <TrustScoreGauge score={trustScore} />
            <p className="text-sm text-muted-foreground mt-4 text-center">
              A higher score unlocks instant approvals for treatments.
            </p>
          </div>
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold">
              How is your Trust Score calculated?
            </h3>
            <div className="space-y-4">
              {scoreFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{factor.icon}</div>
                  <div>
                    <h4 className="font-semibold">{factor.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {factor.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
