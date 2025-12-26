
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function HospitalVerificationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hospital Verification Requests</CardTitle>
        <CardDescription>
          This page will list hospitals awaiting verification to join the network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content for hospital verification requests goes here.</p>
      </CardContent>
    </Card>
  );
}
