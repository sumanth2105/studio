
import { Badge } from '@/components/ui/badge';
import type { ClaimStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
}

const statusStyles: Record<ClaimStatus, string> = {
  Pending: 'bg-yellow-400/20 text-yellow-600 border-yellow-400/50', // #FBBF24
  'Auto-Approved': 'bg-green-600/20 text-green-700 border-green-600/50', // #16A34A
  'Manual Review': 'bg-blue-400/20 text-blue-600 border-blue-400/50',
  Approved: 'bg-green-600/20 text-green-700 border-green-600/50', // #16A34A
  Rejected: 'bg-red-600/20 text-red-700 border-red-600/50', // #DC2626
  Settled: 'bg-gray-500/20 text-gray-600 border-gray-500/50',
};

export function ClaimStatusBadge({ status }: ClaimStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-semibold', statusStyles[status])}>
      {status}
    </Badge>
  );
}
