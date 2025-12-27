
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Separator } from '@/components/ui/separator';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockHolder } from '@/lib/data';


const personalInfoSchema = z.object({
  // Patient Details
  patientName: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().min(0, 'Age must be a positive number').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dob: z.coerce.date({ required_error: 'Date of birth is required' }).optional(),
  contactNumber: z.string().min(10, 'Must be a valid 10-digit number'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Residential address is required'),
  aadhaar: z.string().length(12, 'Aadhaar must be 12 digits'),
  pan: z.string().optional(),

  // Policy Details
  policyHolderName: z.string().min(1, 'Policy holder name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  policyHolderContact: z.string().min(10, 'Must be a valid 10-digit number'),
  insuranceCompany: z.string().min(1, 'Insurance company is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  policyType: z.enum(['individual', 'family_floater']),
  policyStartDate: z.coerce.date({ required_error: 'Policy start date is required' }),
  policyEndDate: z.coerce.date({ required_error: 'Policy end date is required' }),
  lastPremiumPaymentDate: z.coerce.date({ required_error: 'Last premium payment date is required' }),
  sumInsured: z.coerce.number().positive('Sum insured must be positive'),
  remainingSum: z.coerce.number().positive('Remaining sum must be positive'),
  claimType: z.enum(['cashless', 'reimbursement']),
  tpaName: z.string().optional(),
  tpaId: z.string().optional(),

  // Bank Details
  accountHolderName: z.string().min(1, 'Account holder name is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  ifscCode: z.string().min(1, 'IFSC code is required'),
  branchName: z.string().min(1, 'Branch name is required'),
  bankProof: z.any().optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

const formatDateForInput = (date?: Date): string => {
  if (!date || isNaN(date.getTime())) return '';
  try {
    return date.toISOString().split('T')[0];
  } catch (e) {
    return '';
  }
};


const defaultInitialValues: PersonalInfoFormValues = {
    patientName: '',
    contactNumber: '',
    email: '',
    address: '',
    aadhaar: '',
    pan: '',
    age: undefined,
    gender: undefined,
    dob: undefined,
    policyHolderName: '',
    relationship: 'Self',
    policyHolderContact: '',
    insuranceCompany: '',
    policyNumber: '',
    policyType: 'family_floater',
    sumInsured: 0,
    remainingSum: 0,
    claimType: 'cashless',
    policyStartDate: new Date(),
    policyEndDate: new Date(),
    lastPremiumPaymentDate: new Date(),
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    tpaName: '',
    tpaId: '',
    bankProof: undefined
};


export default function PersonalInfoPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: defaultInitialValues,
    mode: 'onBlur'
  });

   useEffect(() => {
    // We safely access localStorage and populate the form only on the client-side
    const getInitialFormValues = (): PersonalInfoFormValues => {
        if (typeof window === 'undefined') {
            return defaultInitialValues;
        }
        const storedData = localStorage.getItem('registeredUserData');
        const activePolicy = mockHolder.policies.find(p => p.status === 'Active');

        const defaults = { ...defaultInitialValues };

        if (activePolicy) {
            defaults.insuranceCompany = activePolicy.provider;
            defaults.policyNumber = activePolicy.policyNumber;
            defaults.sumInsured = activePolicy.coverage;
            defaults.remainingSum = activePolicy.coverage;
            defaults.policyStartDate = new Date(activePolicy.startDate);
            defaults.policyEndDate = new Date(activePolicy.endDate);
            defaults.lastPremiumPaymentDate = new Date(activePolicy.lastPremiumPaymentDate);
        }

        if (storedData) {
            const userData = JSON.parse(storedData);
            // This is where we fix the property name mismatches
            return {
                ...defaults,
                patientName: userData.patientName || defaults.patientName,
                contactNumber: userData.contactNumber || defaults.contactNumber,
                age: userData.age ? Number(userData.age) : defaults.age,
                gender: userData.gender || defaults.gender,
                dob: userData.dob ? new Date(userData.dob) : defaults.dob,
                email: userData.email || defaults.email,
                address: userData.address || defaults.address,
                aadhaar: userData.aadhaar || defaults.aadhaar,
                pan: userData.pan || '',
                policyHolderName: userData.policyHolderName || defaults.policyHolderName,
                relationship: userData.relationship || defaults.relationship,
                policyHolderContact: userData.policyHolderContact || defaults.policyHolderContact,
                policyStartDate: userData.policyStartDate ? new Date(userData.policyStartDate) : defaults.policyStartDate,
                policyEndDate: userData.policyEndDate ? new Date(userData.policyEndDate) : defaults.policyEndDate,
                lastPremiumPaymentDate: userData.lastPremiumPaymentDate ? new Date(userData.lastPremiumPaymentDate) : defaults.lastPremiumPaymentDate,
                accountHolderName: userData.accountHolderName || defaults.accountHolderName,
                bankName: userData.bankName || defaults.bankName,
                accountNumber: userData.accountNumber || defaults.accountNumber,
ifscCode: userData.ifscCode || defaults.ifscCode,
                branchName: userData.branchName || defaults.branchName,
            };
        }

        // Fallback for first-time sign-up, if needed
        const signUpData = localStorage.getItem('signUpData');
        if (signUpData) {
            const userData = JSON.parse(signUpData);
             return {
                ...defaults,
                patientName: userData.fullName || defaults.patientName,
                contactNumber: userData.contactNumber || defaults.contactNumber,
                email: userData.email || defaults.email,
                aadhaar: userData.aadhaar || defaults.aadhaar,
                policyHolderName: userData.fullName || defaults.patientName,
                policyHolderContact: userData.contactNumber || defaults.contactNumber,
                accountHolderName: userData.fullName || defaults.patientName,
            };
        }

        return defaults;
    };
    const values = getInitialFormValues();
    form.reset(values);
  }, [form]);


  async function onSubmit(data: PersonalInfoFormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Form data submitted:", data);
    
    // Update local storage with the new data
    localStorage.setItem('registeredUserData', JSON.stringify(data));
    
    // Reset the form with the new values to ensure it remains populated
    form.reset(data);
    
    toast({
      title: 'Information Submitted',
      description: 'Your personal information has been saved successfully.',
    });
    
    setIsSubmitting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Please fill in your details accurately. This information will be used for claim processing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Patient Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Patient Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient's full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter age" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input 
                            type="text" 
                            placeholder="YYYY-MM-DD" 
                            {...field}
                            value={field.value ? formatDateForInput(new Date(field.value)) : ''}
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
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email ID</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-3">
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full residential address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="aadhaar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 12-digit Aadhaar number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PAN number" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Policy Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Policy Details</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="policyHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter policy holder's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship with Patient</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Self, Spouse, Father" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyHolderContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Holder Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="insuranceCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter policy number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select policy type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="individual">Individual</SelectItem>
                          <SelectItem value="family_floater">Family Floater</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policyStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Start Date</FormLabel>
                       <FormControl>
                        <Input 
                            type="text" 
                            placeholder="YYYY-MM-DD" 
                            {...field}
                            value={field.value ? formatDateForInput(new Date(field.value)) : ''}
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
                  control={form.control}
                  name="policyEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy End Date</FormLabel>
                       <FormControl>
                        <Input 
                            type="text" 
                            placeholder="YYYY-MM-DD" 
                            {...field}
                            value={field.value ? formatDateForInput(new Date(field.value)) : ''}
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
                  control={form.control}
                  name="lastPremiumPaymentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Premium Payment Date</FormLabel>
                       <FormControl>
                        <Input 
                            type="text" 
                            placeholder="YYYY-MM-DD" 
                            {...field}
                            value={field.value ? formatDateForInput(new Date(field.value)) : ''}
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
                  control={form.control}
                  name="sumInsured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sum Insured (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="remainingSum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remaining Sum (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="claimType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Claim Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select claim type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cashless">Cashless</SelectItem>
                          <SelectItem value="reimbursement">Reimbursement</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tpaName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TPA Name (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter TPA Name" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tpaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TPA ID / Contact (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter TPA ID or Contact" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
            
            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary">Bank Details (for Claim Settlement)</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="accountHolderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Holder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name as per bank records" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank account number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ifscCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter IFSC code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter branch name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bankProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Proof</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                           <Input type="file" className="flex-1" accept="image/*,.pdf" />
                           <Button type="button" variant="outline" size="icon">
                             <Upload className="h-4 w-4"/>
                           </Button>
                        </div>
                      </FormControl>
                       <FormDescription>
                        Upload a cancelled cheque or bank passbook front page.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <CardFooter className="px-0">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Information
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    