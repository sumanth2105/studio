
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function RejectedPendingClaimsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rejected / Pending Claims</CardTitle>
        <CardDescription>
          This page will show claims that are rejected or require more information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content for rejected and pending claims goes here.</p>
      </CardContent>
    </Card>
  );
}
