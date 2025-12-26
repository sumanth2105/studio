'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import {
  CalendarIcon,
  Loader2,
  UploadCloud,
  FileCheck,
  UserCheck,
  ClipboardList,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { mockHolder } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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

type ClaimFormValues = z.infer<typeof claimSchema>;

export default function NewClaimPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newClaimId, setNewClaimId] = useState<string | null>(null);

  // In a real app, this would be fetched or passed after patient verification
  const verifiedPatient = mockHolder;

  const form = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
  });

  const onSubmit = async (data: ClaimFormValues) => {
    setIsLoading(true);
    console.log('Claim data:', data);

    // Simulate API call to submit claim
    await new Promise(resolve => setTimeout(resolve, 2000));

    const generatedClaimId = `claim-${Math.floor(1000 + Math.random() * 9000)}`;
    setNewClaimId(generatedClaimId);

    toast({
      title: 'Claim Submitted Successfully',
      description: `Claim ID: ${generatedClaimId} has been created and is now being processed.`,
    });

    setIsLoading(false);
    setIsSubmitted(true);
    form.reset();
  };
  
  if (isSubmitted) {
    return (
       <Card className="w-full max-w-2xl mx-auto">
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
            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                Submit Another Claim
            </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Verified Patient Details</CardTitle>
                <CardDescription>Claim being filed for the following verified patient.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p className="font-semibold">Patient Name</p>
                    <p className="text-muted-foreground">{verifiedPatient.name}</p>
                </div>
                <div>
                    <p className="font-semibold">Policy Number</p>
                    <p className="text-muted-foreground">{verifiedPatient.policies.find(p => p.status === 'Active')?.policyNumber}</p>
                </div>
                 <div>
                    <p className="font-semibold">Trust Score</p>
                    <p className="text-muted-foreground">{verifiedPatient.trustScore}</p>
                </div>
                 <div>
                    <p className="font-semibold">Policy Status</p>
                    <p className="text-green-600 font-bold">Active</p>
                </div>
            </CardContent>
        </Card>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>New Claim Submission</CardTitle>
              <CardDescription>
                Fill in the details below to submit a new claim. All fields are
                mandatory.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Admission Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary flex items-center gap-2">
                    <ClipboardList />
                    Admission & Treatment Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
                    name="admissionNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Note</FormLabel>
                        <FormControl>
                          <Input type="file" {...form.register('admissionNote')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="doctorDiagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor's Diagnosis</FormLabel>
                        <FormControl>
                          <Input type="file" {...form.register('doctorDiagnosis')} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicalReports"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medical Reports</FormLabel>
                        <FormControl>
                          <Input type="file" multiple {...form.register('medicalReports')} />
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
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Claim...
                  </>
                ) : (
                  'Submit Claim'
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
