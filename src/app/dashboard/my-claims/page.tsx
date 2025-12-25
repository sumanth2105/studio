import { ClaimsTable } from '@/components/dashboard/claims-table';
import { mockClaims } from '@/lib/data';

export default function MyClaimsPage() {
  return (
    <div>
      <ClaimsTable
        claims={mockClaims}
        title="My Claims"
        description="A summary of all your insurance claims."
      />
    </div>
  );
}
