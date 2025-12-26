
'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { TrustScoreGauge } from '@/components/dashboard/trust-score-gauge';
import { mockHospital } from '@/lib/data';
import {
  ShieldCheck,
  MapPin,
  FileText,
  FileClock,
  Building,
  User,
  Pen,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  contactEmail: z.string().email('Please enter a valid email.'),
  contactPhone: z.string().min(10, 'Please enter a valid phone number.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function HospitalProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      contactEmail: mockHospital.contactEmail,
      contactPhone: mockHospital.contactPhone,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Profile updated:', data);

    toast({
      title: 'Profile Updated',
      description: 'Your contact information has been saved.',
    });
    setIsEditing(false);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Building /> {mockHospital.name}
              </CardTitle>
              <CardDescription>{mockHospital.address}</CardDescription>
            </div>
            <Badge variant={mockHospital.networkType === 'Network' ? 'default' : 'secondary'}>
                {mockHospital.networkType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Registration ID</p>
              <p className="font-semibold">{mockHospital.registrationId}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className='flex-row items-center justify-between'>
            <CardTitle>Contact Information</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)} disabled={form.formState.isSubmitting}>
                <Pen className="h-4 w-4"/>
                <span className="sr-only">Edit</span>
            </Button>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              {isEditing && (
                <CardFooter>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                     <Button variant="outline" onClick={() => { setIsEditing(false); form.reset(); }} className="ml-2">
                        Cancel
                    </Button>
                </CardFooter>
              )}
            </form>
          </Form>
        </Card>
        
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck /> Trust Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <TrustScoreGauge score={mockHospital.trustScore} />
                <p className="text-xs text-muted-foreground text-center mt-2">Based on claim approval rates, document accuracy, and response times.</p>
            </CardContent>
         </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Verification Documents</CardTitle>
            <CardDescription>
              These are the official documents provided by the hospital for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead className="text-right">Upload Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockHospital.documents.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.name}</TableCell>
                            <TableCell className="text-right">{doc.uploadDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileClock /> Audit Log</CardTitle>
            <CardDescription>
              A log of recent changes made to this hospital profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockHospital.auditLogs.map(log => (
                        <TableRow key={log.id}>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{log.userId}</TableCell>
                            <TableCell>{log.action}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>

    </div>
  );
}
