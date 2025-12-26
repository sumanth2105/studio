
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ClaimHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Claim History</CardTitle>
        <CardDescription>
          View a history of all past insurance claims.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Claim history table with filters will go here.</p>
      </CardContent>
    </Card>
  );
}
