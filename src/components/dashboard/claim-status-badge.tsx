
import { Badge } from '@/components/ui/badge';
import type { ClaimStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
}

const statusStyles: Record<ClaimStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800',
  'Auto-Approved': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  'Manual Review': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
  Approved: 'bg-primary/10 text-primary border-primary/20',
  Rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  Settled: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/50 dark:text-gray-300 dark:border-gray-800',
};

export function ClaimStatusBadge({ status }: ClaimStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-semibold', statusStyles[status])}>
      {status}
    </Badge>
  );
}
