
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HospitalProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Profile</CardTitle>
        <CardDescription>
          Manage your hospital's information and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Hospital profile content will go here.</p>
      </CardContent>
    </Card>
  );
}
