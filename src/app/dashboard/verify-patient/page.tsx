
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function VerifyPatientPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Patient</CardTitle>
        <CardDescription>
          Verify patient eligibility for insurance claims.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Patient verification form will go here.</p>
      </CardContent>
    </Card>
  );
}
