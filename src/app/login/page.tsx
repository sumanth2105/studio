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
import { User, Hospital, ShieldCheck, KeyRound } from 'lucide-react';
import type { UserRole } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('holder');

  const handleLogin = () => {
    // In a real app, you'd perform authentication here.
    // For now, we'll just redirect based on the selected role.
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

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  const demoCredentials = {
    holder: { username: 'holder_demo', password: 'password' },
    hospital: { username: 'hospital_demo', password: 'password' },
    insurer: { username: 'insurer_demo', password: 'password' },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
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
                 <Alert variant="default" className="w-full text-sm">
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Demo Credentials</AlertTitle>
                    <AlertDescription>
                        Use <strong>{demoCredentials.holder.username}</strong> / <strong>{demoCredentials.holder.password}</strong>
                    </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
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
