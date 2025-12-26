
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Hospital,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';


const signUpSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  age: z.coerce.number().min(18, 'You must be at least 18 years old'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  dob: z.date({ required_error: 'Date of birth is required' }),
  contactNumber: z.string().length(10, 'Must be a valid 10-digit number'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Residential address is required'),
  aadhaar: z.string().length(12, 'Aadhaar must be 12 digits'),
  pan: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const otpSchema = z.object({
  otp: z.string().length(6, 'Please enter the 6-digit OTP.'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>('holder');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signUpStep, setSignUpStep] = useState<'details' | 'otp' | 'success'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);


  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
        fullName: '',
        contactNumber: '',
        email: '',
        address: '',
        aadhaar: '',
        pan: '',
        username: '',
        password: '',
        confirmPassword: '',
    }
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const handleLogin = () => {
    localStorage.setItem('userRole', role);

    switch (role) {
      case 'holder':
        router.push('/dashboard');
        break;
      case 'hospital':
        router.push('/dashboard/hospital');
        break;
      case 'insurer':
        router.push('/dashboard/insurer');
        break;
    }
  };
  
  const handleSignUpSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Signing up with data:', data);

    // Simulate sending OTP and show it for demo
    await new Promise(resolve => setTimeout(resolve, 1500));
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(generatedOtp);
    setSignUpStep('otp');
    toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${data.contactNumber}.`
    });
        
    setIsLoading(false);
  }

  const handleOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log('Verifying OTP:', data);
    
    // In a real app, you'd call a `verifyOtp` flow.
    // For this demo, we compare with the OTP stored in state.
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.otp === demoOtp) {
        setSignUpStep('success');
        toast({
            title: 'Sign Up Successful',
            description: 'Your account has been created. Please log in.'
        });
        setIsSigningUp(false);
        setSignUpStep('details');
        signUpForm.reset();
        otpForm.reset();
        setDemoOtp(null);
    } else {
        setErrorMessage('Invalid OTP. Please try again.');
    }
    setIsLoading(false);
  }

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
    setIsSigningUp(false); // Reset sign-up state on tab change
  };

  const demoCredentials = {
    holder: { username: 'holder_demo', password: 'password' },
    hospital: { username: 'hospital_demo', password: 'password' },
    insurer: { username: 'insurer_demo', password: 'password' },
  };
  
  const renderHolderCard = () => {
    if (isSigningUp) {
      return (
         <Card>
           {signUpStep === 'details' && (
            <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUpSubmit)}>
                    <CardHeader>
                        <CardTitle>Create Your Account</CardTitle>
                        <CardDescription>
                            Enter your details to get started with Suraksha Kavach.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-[50vh] overflow-y-auto pr-3">
                        {errorMessage && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{errorMessage}</AlertDescription>
                            </Alert>
                        )}
                        <FormField
                            control={signUpForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Choose a username" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={signUpForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Create a password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={signUpForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Confirm your password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={signUpForm.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={signUpForm.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Enter age" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={signUpForm.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        </div>
                        <FormField
                            control={signUpForm.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date of Birth</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
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
                                        disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={signUpForm.control}
                                name="contactNumber"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="10-digit number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={signUpForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email ID</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={signUpForm.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Residential Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your address" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={signUpForm.control}
                                name="aadhaar"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Aadhaar Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="12-digit Aadhaar" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={signUpForm.control}
                                name="pan"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>PAN (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter PAN" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                             ) : (
                                <ArrowRight className="mr-2 h-4 w-4" />
                             )}
                            Proceed
                        </Button>
                        <Button variant="link" onClick={() => setIsSigningUp(false)}>
                            Already have an account? Sign In
                        </Button>
                    </CardFooter>
                </form>
            </Form>
           )}

           {signUpStep === 'otp' && (
             <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
                    <CardHeader>
                        <CardTitle>Verify OTP</CardTitle>
                        <CardDescription>
                        An OTP has been sent to your registered mobile number.
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
                        {demoOtp && (
                        <Alert variant="default" className="text-sm">
                            <KeyRound className="h-4 w-4" />
                            <AlertTitle>Demo Information</AlertTitle>
                            <AlertDescription>
                                Use OTP: <strong>{demoOtp}</strong>
                            </AlertDescription>
                        </Alert>
                        )}
                    </CardContent>
                     <CardFooter className="flex-col gap-4">
                        <Button type="submit" disabled={isLoading} className='w-full'>
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <ShieldCheck className="mr-2 h-4 w-4" />
                        )}
                        Verify Account
                        </Button>
                        <Button variant="link" onClick={() => setSignUpStep('details')}>
                            Back to details
                        </Button>
                    </CardFooter>
                </form>
             </Form>
           )}
         </Card>
      );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Insurance Holder Login</CardTitle>
                <CardDescription>
                Access your personal health insurance dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="holder-username">Username</Label>
                <Input id="holder-username" defaultValue={demoCredentials.holder.username} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="holder-password">Password</Label>
                <Input id="holder-password" type="password" defaultValue={demoCredentials.holder.password}/>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                 <Button variant="link" className="w-full" onClick={() => setIsSigningUp(true)}>
                    Don't have an account? Sign Up
                </Button>
                <Alert variant="default" className="w-full text-sm">
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Demo Credentials</AlertTitle>
                    <AlertDescription>
                        Use <strong>{demoCredentials.holder.username}</strong> / <strong>{demoCredentials.holder.password}</strong>
                    </AlertDescription>
                </Alert>
            </CardFooter>
        </Card>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md mx-auto">
         <div className="flex items-center gap-2 justify-center mb-6">
           <svg
              className="h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m12 10 4 2-4 2-4-2 4-2z" />
            </svg>
          <h1 className="text-2xl font-bold font-headline text-primary">Suraksha Kavach</h1>
        </div>
        <Tabs value={role} onValueChange={handleRoleChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="holder">
              <User className="mr-2 h-4 w-4" /> Holder
            </TabsTrigger>
            <TabsTrigger value="hospital">
              <Hospital className="mr-2 h-4 w-4" /> Hospital
            </TabsTrigger>
            <TabsTrigger value="insurer">
              <ShieldCheck className="mr-2 h-4 w-4" /> Insurer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="holder">
            {renderHolderCard()}
          </TabsContent>
          <TabsContent value="hospital">
            <Card>
              <CardHeader>
                <CardTitle>Hospital Portal Login</CardTitle>
                <CardDescription>
                  Manage patient claims and records.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hospital-username">Username</Label>
                  <Input id="hospital-username" defaultValue={demoCredentials.hospital.username}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital-password">Password</Label>
                  <Input id="hospital-password" type="password" defaultValue={demoCredentials.hospital.password}/>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                <Alert variant="default" className="w-full text-sm">
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Demo Credentials</AlertTitle>
                    <AlertDescription>
                        Use <strong>{demoCredentials.hospital.username}</strong> / <strong>{demoCredentials.hospital.password}</strong>
                    </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="insurer">
            <Card>
              <CardHeader>
                <CardTitle>Insurer Portal Login</CardTitle>
                <CardDescription>
                  Review and process insurance claims.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurer-username">Username</Label>
                  <Input id="insurer-username" defaultValue={demoCredentials.insurer.username}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurer-password">Password</Label>
                  <Input id="insurer-password" type="password" defaultValue={demoCredentials.insurer.password}/>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4">
                <Button className="w-full" onClick={handleLogin}>Sign In</Button>
                <Alert variant="default" className="w-full text-sm">
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Demo Credentials</AlertTitle>
                    <AlertDescription>
                        Use <strong>{demoCredentials.insurer.username}</strong> / <strong>{demoCredentials.insurer.password}</strong>
                    </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
