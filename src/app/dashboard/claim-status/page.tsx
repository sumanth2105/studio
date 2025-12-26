
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ClaimStatusPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim Status</CardTitle>
        <CardDescription>
          Track the status of active insurance claims.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Real-time claim status tracker will go here.</p>
      </CardContent>
    </Card>
  );
}
