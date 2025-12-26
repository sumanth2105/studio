
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewClaimPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Claim Submission</CardTitle>
        <CardDescription>
          Submit a new insurance claim for a verified patient.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>New claim submission form will go here.</p>
      </CardContent>
    </Card>
  );
}
