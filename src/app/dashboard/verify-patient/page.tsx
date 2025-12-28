
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
  Fingerprint,
} from 'lucide-react';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserContext } from '@/context/user-context';
import type { Holder } from '@/lib/types';

const patientIdSearchSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required.'),
});

const mobileSearchSchema = z.object({
  mobile: z.string().length(10, 'Please enter a valid 10-digit mobile number.'),
  aadhaarLast4: z.string().length(4, 'Please enter the last 4 digits of Aadhaar.'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the 6-digit OTP.'),
});

const claimSchema = z.object({
  admissionDate: z.coerce.date({ required_error: 'Admission date is required.' }),
  diagnosis: z.string().min(1, 'Diagnosis is required.'),
  treatmentType: z.enum(['Medical', 'Surgical'], {
    required_error: 'Treatment type is required.',
  }),
  estimatedCost: z.coerce.number().positive('Estimated cost must be a positive number.'),
  maxSurgeryStartTime: z.string().optional(),
  admissionNote: z.any().refine(file => file?.length == 1, 'Admission note is required.'),
  doctorDiagnosis: z.any().refine(file => file?.length == 1, 'Doctor diagnosis is required.'),
  medicalReports: z.any().refine(file => file?.length > 0, 'At least one medical report is required.'),
});

type PatientIdSearchFormValues = z.infer<typeof patientIdSearchSchema>;
type MobileSearchFormValues = z.infer<typeof mobileSearchSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;
type ClaimFormValues = z.infer<typeof claimSchema>;

type VerificationStep = 'search' | 'otp' | 'verified' | 'error' | 'claim_submitted';

export default function VerifyPatientPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { holder, isLoading: isHolderLoading } = useUserContext();
  const [step, setStep] = useState<VerificationStep>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newClaimId, setNewClaimId] = useState<string | null>(null);
  
  const verifiedPatient = holder;
  const activePolicy = verifiedPatient?.policies.find(p => p.status === 'Active');

  const patientIdForm = useForm<PatientIdSearchFormValues>({
    resolver: zodResolver(patientIdSearchSchema),
    defaultValues: { patientId: '' }
  });

  const mobileForm = useForm<MobileSearchFormValues>({
    resolver: zodResolver(mobileSearchSchema),
    defaultValues: { mobile: '', aadhaarLast4: '' }
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });
  
  const claimForm = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
  });

  const handlePatientSearch = async (data: MobileSearchFormValues | PatientIdSearchFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Searching for patient:', data);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const isMobileMatch = verifiedPatient && 'mobile' in data && data.mobile === verifiedPatient.mobile.substring(0, 10) && data.aadhaarLast4 === verifiedPatient.aadhaarLast4;
    const isPatientIdMatch = verifiedPatient && 'patientId' in data && data.patientId === verifiedPatient.id;

    if (isMobileMatch || isPatientIdMatch) {
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
    patientIdForm.reset({ patientId: '' });
    mobileForm.reset({ mobile: '', aadhaarLast4: ''});
    otpForm.reset({ otp: '' });
    claimForm.reset();
    setNewClaimId(null);
  };

  if (isHolderLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin" />
        </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'search':
        return (
          <>
            <CardHeader>
              <CardTitle>Verify Patient & Initiate Claim</CardTitle>
              <CardDescription>
                Find the patient to begin the claim submission process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="patient-id">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="patient-id">
                    <Fingerprint className="mr-2 h-4 w-4" /> Patient ID
                  </TabsTrigger>
                  <TabsTrigger value="mobile">
                    Mobile & Aadhaar
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="patient-id" className="pt-4">
                  <Form {...patientIdForm}>
                    <form onSubmit={patientIdForm.handleSubmit(handlePatientSearch)} className="space-y-4">
                      <FormField
                        control={patientIdForm.control}
                        name="patientId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Patient ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter patient's unique ID" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" disabled={isLoading} className='w-full'>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Find Patient
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent value="mobile" className="pt-4">
                  <Form {...mobileForm}>
                    <form onSubmit={mobileForm.handleSubmit(handlePatientSearch)} className="space-y-4">
                      <FormField
                        control={mobileForm.control}
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
                        control={mobileForm.control}
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
                      <Button type="submit" disabled={isLoading} className='w-full'>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowRight className="mr-2 h-4 w-4" />
                        )}
                        Find Patient
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </>
        );

      case 'otp':
        return (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOtpVerification)}>
              <CardHeader>
                <CardTitle>Enter OTP</CardTitle>
                <CardDescription>
                  An OTP has been sent to the patient's registered mobile number for verification.
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
        if (!verifiedPatient) return <Loader2 className="w-8 h-8 animate-spin" />;
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
                                    <FormItem>
                                        <FormLabel>Date of Admission</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="text" 
                                                placeholder="YYYY-MM-DD"
                                                {...field}
                                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const dateValue = e.target.value;
                                                    const date = new Date(dateValue);
                                                    if (!isNaN(date.getTime())) {
                                                        field.onChange(date);
                                                    } else {
                                                        field.onChange(undefined);
                                                    }
                                                }}
                                            />
                                        </FormControl>
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
                                <FormField
                                    control={claimForm.control}
                                    name="maxSurgeryStartTime"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max time to surgery</FormLabel>
                                        <FormControl>
                                        <Input
                                            placeholder="e.g., 2 hours"
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
        if (!verifiedPatient) return <Loader2 className="w-8 h-8 animate-spin" />;
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
