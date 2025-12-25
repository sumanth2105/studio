
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

export default function ProfilePage() {

  return (
    <div className="grid gap-6">
        <Card>
         <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>Manage your profile, documents, and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
           <Link href="/dashboard/personal-info" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Update Profile</span>
           </Link>
            <Link href="/dashboard/documents" className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">View & Upload Documents</span>
           </Link>
            <div className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                <Heart className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Consent Preferences</span>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
