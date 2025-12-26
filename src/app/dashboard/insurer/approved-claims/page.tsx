
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ApprovedClaimsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approved Claims</CardTitle>
        <CardDescription>
          This page will show all claims that have been approved, both automatically and manually.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content for approved claims goes here.</p>
      </CardContent>
    </Card>
  );
}
