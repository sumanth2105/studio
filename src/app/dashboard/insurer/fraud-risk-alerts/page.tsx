
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function FraudRiskAlertsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud & Risk Alerts</CardTitle>
        <CardDescription>
          This page will display alerts for potentially fraudulent activities or high-risk claims.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content for fraud and risk alerts goes here.</p>
      </CardContent>
    </Card>
  );
}
