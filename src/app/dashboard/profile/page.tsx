
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Heart,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {

  return (
    <div className="grid gap-6">
        <Card>
         <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>Manage your profile, documents, and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
           <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <User className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Personal Information</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>Update your personal details, contact information, and more.</p>
                    <Button asChild>
                        <Link href="/dashboard/personal-info">Update Profile</Link>
                    </Button>
                </CardContent>
           </Card>
           <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <FileText className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Documents</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>View, upload, and manage your verification documents.</p>
                    <Button asChild>
                        <Link href="/dashboard/documents">Manage Documents</Link>
                    </Button>
                </CardContent>
           </Card>
           <Card>
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <Heart className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">Consent Preferences</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className='text-sm text-muted-foreground mb-4'>Control how your data is shared with hospitals and insurers.</p>
                     <Button asChild>
                        <Link href="/dashboard/consent">Manage Consent</Link>
                    </Button>
                </CardContent>
           </Card>
        </CardContent>
      </Card>
    </div>
  );
}
