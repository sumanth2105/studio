'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  KeyRound,
  FilePlus,
  ArrowRight,
} from 'lucide-react';
import { mockHolder } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const patientSearchSchema = z.object({
  mobile: z.string().length(10, 'Please enter a valid 10-digit mobile number.'),
  aadhaarLast4: z.string().length(4, 'Please enter the last 4 digits of Aadhaar.'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the 6-digit OTP.'),
});

type PatientSearchFormValues = z.infer<typeof patientSearchSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

type VerificationStep = 'search' | 'otp' | 'verified' | 'error';

export default function VerifyPatientPage() {
  const [step, setStep] = useState<VerificationStep>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchForm = useForm<PatientSearchFormValues>({
    resolver: zodResolver(patientSearchSchema),
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const handlePatientSearch = async (data: PatientSearchFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Searching for patient:', data);

    // Simulate API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In a real app, you'd check if the patient exists before sending OTP.
    if (data.mobile === mockHolder.mobile.substring(0, 10) && data.aadhaarLast4 === mockHolder.aadhaarLast4) {
      setStep('otp');
    } else {
      setErrorMessage('Patient not found. Please check the details and try again.');
      setStep('error');
    }
    
    setIsLoading(false);
  };

  const handleOtpVerification = async (data: OtpFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Verifying OTP:', data);

    // Simulate API call to verify OTP
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (data.otp === '123456') { // Demo OTP
      setStep('verified');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
      otpForm.setError('otp', { message: ' ' }); // Add error styling to input
    }
    setIsLoading(false);
  };
  
  const handleReset = () => {
    setStep('search');
    setErrorMessage(null);
    searchForm.reset({ mobile: '', aadhaarLast4: ''});
    otpForm.reset({ otp: '' });
  };
  
  const activePolicy = mockHolder.policies.find(p => p.status === 'Active');

  const renderContent = () => {
    switch (step) {
      case 'search':
        return (
          <Form {...searchForm}>
            <form onSubmit={searchForm.handleSubmit(handlePatientSearch)}>
              <CardHeader>
                <CardTitle>Verify Patient</CardTitle>
                <CardDescription>
                  Enter patient's mobile number and last 4 digits of Aadhaar to begin.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={searchForm.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={searchForm.control}
                  name="aadhaarLast4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last 4 Digits of Aadhaar</FormLabel>
                      <FormControl>
                        <Input placeholder="XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className='w-full'>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Send OTP
                </Button>
              </CardFooter>
            </form>
          </Form>
        );

      case 'otp':
        return (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpVerification)}>
              <CardHeader>
                <CardTitle>Enter OTP</CardTitle>
                <CardDescription>
                  An OTP has been sent to the patient's registered mobile number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 6-digit OTP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {errorMessage && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Verification Failed</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
                <Alert variant="default" className="text-sm">
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Demo Information</AlertTitle>
                    <AlertDescription>
                        Use OTP: <strong>123456</strong>
                    </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button type="submit" disabled={isLoading} className='w-full'>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  )}
                  Verify & View Details
                </Button>
                 <Button variant="outline" onClick={handleReset} className="w-full">
                  Back to Search
                </Button>
              </CardFooter>
            </form>
          </Form>
        );
    
     case 'verified':
        return (
            <>
                <CardHeader>
                    <div className='flex items-center gap-3'>
                        <UserCheck className="h-8 w-8 text-green-600" />
                        <div>
                            <CardTitle>Patient Verified</CardTitle>
                            <CardDescription>
                                Eligibility details for {mockHolder.name}.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
                         <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
                            <TrustScoreGauge score={mockHolder.trustScore} />
                        </div>
                        <div className="space-y-4">
                             <div>
                                <p className="text-sm text-muted-foreground">Policy Status</p>
                                <Badge variant={activePolicy?.status === 'Active' ? 'default' : 'destructive'}>
                                    {activePolicy?.status}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Policy Provider</p>
                                <p className="font-semibold">{activePolicy?.provider}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Policy Number</p>
                                <p className="font-semibold">{activePolicy?.policyNumber}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Coverage Amount</p>
                                <p className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(activePolicy?.coverage || 0)}</p>
                            </div>
                        </div>
                    </div>
                    <Separator/>
                     <Alert variant="default">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Next Step</AlertTitle>
                        <AlertDescription>
                           You can now proceed to submit a new claim for this patient.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button asChild className="w-full">
                        <Link href="/dashboard/new-claim">
                            <FilePlus className="mr-2 h-4 w-4"/>
                            Submit New Claim
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={handleReset} className="w-full">
                      Verify Another Patient
                    </Button>
                </CardFooter>
            </>
        )

      case 'error':
        return (
          <>
            <CardHeader>
              <CardTitle>Verification Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={handleReset} className='w-full'>Try Again</Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="flex justify-center items-start py-8">
        <Card className="w-full max-w-lg">
            {renderContent()}
        </Card>
    </div>
  );
}
