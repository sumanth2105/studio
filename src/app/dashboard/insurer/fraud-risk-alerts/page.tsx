
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Shield, Search, Microscope, Check } from 'lucide-react';
import Link from 'next/link';

type RiskLevel = 'Low' | 'Medium' | 'High';
type AlertStatus = 'New' | 'Investigating' | 'Cleared';

interface FraudAlert {
  id: string;
  timestamp: string;
  riskLevel: RiskLevel;
  reason: string;
  linkedEntity: {
    type: 'Claim' | 'Hospital' | 'Holder';
    id: string;
  };
  status: AlertStatus;
}

const mockAlerts: FraudAlert[] = [
  {
    id: 'alert-001',
    timestamp: '2023-11-20T14:30:00Z',
    riskLevel: 'High',
    reason: 'Billing anomaly detected: upcoding of procedures.',
    linkedEntity: { type: 'Claim', id: 'claim-102' },
    status: 'New',
  },
  {
    id: 'alert-002',
    timestamp: '2023-11-19T11:00:00Z',
    riskLevel: 'Medium',
    reason: 'Frequent claims for same diagnosis from different hospitals.',
    linkedEntity: { type: 'Holder', id: 'user-001' },
    status: 'Investigating',
  },
  {
    id: 'alert-003',
    timestamp: '2023-11-18T09:45:00Z',
    riskLevel: 'Low',
    reason: 'Unusually high number of claims for a non-network hospital.',
    linkedEntity: { type: 'Hospital', id: 'hosp-non-network-01' },
    status: 'New',
  },
    {
    id: 'alert-004',
    timestamp: '2023-11-17T16:20:00Z',
    riskLevel: 'High',
    reason: 'Potential identity mismatch based on provided documents.',
    linkedEntity: { type: 'Claim', id: 'claim-098' },
    status: 'Cleared',
  },
];

const riskLevelStyles: Record<RiskLevel, string> = {
  Low: 'text-green-600 border-green-400',
  Medium: 'text-yellow-600 border-yellow-400',
  High: 'text-destructive border-destructive',
};

const statusStyles: Record<AlertStatus, string> = {
  New: 'bg-blue-100 text-blue-800 border-blue-200',
  Investigating: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Cleared: 'bg-green-100 text-green-800 border-green-200',
};


export default function FraudRiskAlertsPage() {
    const { toast } = useToast();
    const [alerts, setAlerts] = useState<FraudAlert[]>(mockAlerts);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleAction = (alertId: string, newStatus: AlertStatus, actionText: string) => {
        setAlerts(prevAlerts => 
            prevAlerts.map(alert => 
                alert.id === alertId ? { ...alert, status: newStatus } : alert
            )
        );
        toast({
            title: `Alert Updated`,
            description: `Alert ${alertId} has been marked as "${actionText}".`,
        });
    };

    return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud & Risk Alerts</CardTitle>
        <CardDescription>
          A centralized console for monitoring, investigating, and resolving
          system-generated risk alerts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Alert ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Linked Entity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
             <TableBody>
                {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                        <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                        <TableCell>{isClient ? new Date(alert.timestamp).toLocaleString() : ''}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn('font-bold', riskLevelStyles[alert.riskLevel])}>
                                {alert.riskLevel}
                            </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{alert.reason}</TableCell>
                        <TableCell>
                            <Link href="#" className="text-primary hover:underline text-sm">
                                {alert.linkedEntity.type}: {alert.linkedEntity.id}
                            </Link>
                        </TableCell>
                         <TableCell>
                            <Badge variant="outline" className={cn('font-semibold', statusStyles[alert.status])}>
                                {alert.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" disabled={alert.status === 'Cleared'}>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleAction(alert.id, 'Investigating', 'Under Investigation')}>
                                        <Search className="mr-2 h-4 w-4"/> Mark for Investigation
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleAction(alert.id, 'Investigating', 'Escalated to Audit')}>
                                        <Shield className="mr-2 h-4 w-4"/> Escalate to Audit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleAction(alert.id, 'Cleared', 'Cleared')}>
                                        <Check className="mr-2 h-4 w-4"/> Clear Alert
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
             </TableBody>
        </Table>
      </CardContent>
    </Card>
    );
}
