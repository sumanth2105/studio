
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function EmployeeSecurityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee & Security</CardTitle>
        <CardDescription>
          Manage hospital staff access and view security logs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Employee and security management tools will go here.</p>
      </CardContent>
    </Card>
  );
}
