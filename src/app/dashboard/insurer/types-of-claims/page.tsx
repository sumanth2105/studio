
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, PieChartIcon } from 'lucide-react';
import { mockClaims } from '@/lib/data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const claimTypeData = [
  { name: 'Cashless', value: 480 },
  { name: 'Reimbursement', value: 120 },
];
const treatmentTypeData = [
  { name: 'Medical', value: 350 },
  { name: 'Surgical', value: 250 },
];

const claimsByStatus = mockClaims.reduce((acc, claim) => {
      let statusGroup: string;
      if (['Approved', 'Settled', 'Insurance Claim Guaranteed'].includes(claim.status)) {
        statusGroup = 'Approved';
      } else if (['Pending', 'Manual Review'].includes(claim.status)) {
        statusGroup = 'Pending';
      } else { // Rejected
        statusGroup = 'Rejected';
      }
      acc[statusGroup] = (acc[statusGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

const claimStatusData = [
    { name: 'Approved', value: claimsByStatus['Approved'] || 0 },
    { name: 'Pending', value: claimsByStatus['Pending'] || 0 },
    { name: 'Rejected', value: claimsByStatus['Rejected'] || 0 },
];

export default function TypesOfClaimsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Types of Claims</CardTitle>
          <CardDescription>
            An overview of claim distributions by type, treatment, and status.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Claims by Type</CardTitle>
            </div>
            <CardDescription>Cashless vs. Reimbursement</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {claimTypeData.map(item => (
                        <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Claims by Treatment</CardTitle>
            </div>
            <CardDescription>Medical vs. Surgical</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Treatment</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {treatmentTypeData.map(item => (
                        <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Claims by Status</CardTitle>
            </div>
            <CardDescription>Approved vs. Pending vs. Rejected</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {claimStatusData.map(item => (
                        <TableRow key={item.name}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{item.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
