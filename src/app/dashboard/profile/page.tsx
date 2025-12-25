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

export default function ProfilePage() {

  return (
    <div className="grid gap-6">
      <Card>
         <CardHeader>
          <CardTitle>Profile & Settings</CardTitle>
          <CardDescription>Manage your profile, documents, and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted">
              <div className='flex items-center gap-4'>
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Update Profile</span>
              </div>
           </div>
            <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted">
                <div className='flex items-center gap-4'>
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">View Documents</span>
                </div>
           </div>
            <div className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted">
                <div className='flex items-center gap-4'>
                    <Heart className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Consent Preferences</span>
                </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
