
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function IncomingClaimsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Incoming Claims</CardTitle>
        <CardDescription>
          This page will be the main queue for reviewing and deciding on new claims.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content for incoming claims goes here.</p>
      </CardContent>
    </Card>
  );
}
