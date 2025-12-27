
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  KeyRound,
  FilePlus,
  ArrowRight,
  UploadCloud,
  ClipboardList,
  FileCheck,
  CalendarIcon,
} from 'lucide-react';
import { mockHolder } from '@/lib/data';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

const patientSearchSchema = z.object({
  mobile: z.string().length(10, 'Please enter a valid 10-digit mobile number.'),
  aadhaarLast4: z.string().length(4, 'Please enter the last 4 digits of Aadhaar.'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the 6-digit OTP.'),
});

const claimSchema = z.object({
  admissionDate: z.date({ required_error: 'Admission date is required.' }),
  diagnosis: z.string().min(1, 'Diagnosis is required.'),
  treatmentType: z.enum(['Medical', 'Surgical'], {
    required_error: 'Treatment type is required.',
  }),
  estimatedCost: z.coerce.number().positive('Estimated cost must be a positive number.'),
  admissionNote: z.any().refine(file => file?.length == 1, 'Admission note is required.'),
  doctorDiagnosis: z.any().refine(file => file?.length == 1, 'Doctor diagnosis is required.'),
  medicalReports: z.any().refine(file => file?.length > 0, 'At least one medical report is required.'),
});

type PatientSearchFormValues = z.infer<typeof patientSearchSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type ClaimFormValues = z.infer<typeof claimSchema>;

type VerificationStep = 'search' | 'otp' | 'verified' | 'error' | 'claim_submitted';

export default function VerifyPatientPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState<VerificationStep>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newClaimId, setNewClaimId] = useState<string | null>(null);
  
  const verifiedPatient = mockHolder; // In a real app, this would be fetched
  const activePolicy = verifiedPatient.policies.find(p => p.status === 'Active');

  const searchForm = useForm<PatientSearchFormValues>({
    resolver: zodResolver(patientSearchSchema),
    defaultValues: { mobile: '', aadhaarLast4: '' }
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });
  
  const claimForm = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
  });

  const handlePatientSearch = async (data: PatientSearchFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Searching for patient:', data);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    
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

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (data.otp === '123456') {
      setStep('verified');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
      otpForm.setError('otp', { message: ' ' });
    }
    setIsLoading(false);
  };
  
  const handleClaimSubmit = async (data: ClaimFormValues) => {
    setIsLoading(true);
    console.log('Claim data:', data);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedClaimId = `claim-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewClaimId(generatedClaimId);

    toast({
      title: 'Claim Submitted Successfully',
      description: `Claim ID: ${generatedClaimId} has been created and is now being processed.`,
    });

    setIsLoading(false);
    setStep('claim_submitted');
    claimForm.reset();
  };
  
  const handleReset = () => {
    setStep('search');
    setErrorMessage(null);
    searchForm.reset({ mobile: '', aadhaarLast4: ''});
    otpForm.reset({ otp: '' });
    claimForm.reset();
    setNewClaimId(null);
  };

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
                  Verify & Proceed
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
                                Eligibility details for {verifiedPatient.name}. You can now file a claim.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
                         <div className="flex flex-col items-center justify-center p-6 bg-card-foreground/5 rounded-lg">
                            <TrustScoreGauge score={verifiedPatient.trustScore} />
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
                     <Form {...claimForm}>
                        <form onSubmit={claimForm.handleSubmit(handleClaimSubmit)} className="space-y-8">
                             {/* Admission Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-primary flex items-center gap-2">
                                    <ClipboardList />
                                    New Claim Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                <FormField
                                    control={claimForm.control}
                                    name="admissionDate"
                                    render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Date of Admission</FormLabel>
                                        <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                'w-full pl-3 text-left font-normal',
                                                !field.value && 'text-muted-foreground'
                                                )}
                                            >
                                                {field.value ? (
                                                format(field.value, 'PPP')
                                                ) : (
                                                <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={date =>
                                                date > new Date() ||
                                                date < new Date('1900-01-01')
                                            }
                                            initialFocus
                                            />
                                        </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={claimForm.control}
                                    name="treatmentType"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Treatment Type</FormLabel>
                                        <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        >
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue placeholder="Select treatment type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Medical">Medical</SelectItem>
                                            <SelectItem value="Surgical">Surgical</SelectItem>
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={claimForm.control}
                                    name="diagnosis"
                                    render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Diagnosis</FormLabel>
                                        <FormControl>
                                        <Textarea
                                            placeholder="Enter the primary diagnosis..."
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormDescription>
                                        Provide a clear and concise diagnosis.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={claimForm.control}
                                    name="estimatedCost"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estimated Cost (₹)</FormLabel>
                                        <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="e.g., 150000"
                                            {...field}
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                </div>
                            </div>

                             {/* Document Uploads */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-primary flex items-center gap-2">
                                    <UploadCloud />
                                    Document Uploads
                                </h3>
                                <Alert>
                                    <AlertTitle>Mandatory Documents</AlertTitle>
                                    <AlertDescription>
                                        Please upload all required documents in PDF, JPG, or PNG format.
                                    </AlertDescription>
                                </Alert>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField
                                    control={claimForm.control}
                                    name="admissionNote"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Admission Note</FormLabel>
                                        <FormControl>
                                        <Input type="file" {...claimForm.register('admissionNote')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={claimForm.control}
                                    name="doctorDiagnosis"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Doctor's Diagnosis</FormLabel>
                                        <FormControl>
                                        <Input type="file" {...claimForm.register('doctorDiagnosis')} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={claimForm.control}
                                    name="medicalReports"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Medical Reports</FormLabel>
                                        <FormControl>
                                        <Input type="file" multiple {...claimForm.register('medicalReports')} />
                                        </FormControl>
                                        <FormDescription>
                                            (X-ray, MRI, blood tests, etc.)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                </div>
                            </div>
                            <CardFooter className="px-0 pt-4 flex-col gap-4">
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting Claim...
                                    </>
                                    ) : (
                                      <>
                                        <FilePlus className="mr-2 h-4 w-4"/>
                                        Submit Claim
                                      </>
                                    )}
                                </Button>
                                 <Button variant="outline" onClick={handleReset} className="w-full">
                                    Cancel and Verify Another Patient
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </CardContent>
            </>
        )

      case 'claim_submitted':
        return (
            <Card>
                <CardHeader className="text-center">
                    <div className="mx-auto bg-green-100 rounded-full p-3 w-fit mb-4">
                    <FileCheck className="h-10 w-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Claim Submitted Successfully</CardTitle>
                    <CardDescription>
                        Claim ID <strong>{newClaimId}</strong> for patient <strong>{verifiedPatient.name}</strong> has been created.
                        You can track its status in the "Claim Status" section.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={() => router.push('/dashboard/claim-status')}>
                        Go to Claim Status
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleReset}>
                        Verify Another Patient
                    </Button>
                </CardFooter>
            </Card>
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
        <Card className="w-full max-w-2xl">
            {renderContent()}
        </Card>
    </div>
  );
}
