
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockClaims } from '@/lib/data';

const claimTypeData = [
  { name: 'Cashless', value: 480, fill: 'var(--color-cashless)' },
  { name: 'Reimbursement', value: 120, fill: 'var(--color-reimbursement)' },
];
const treatmentTypeData = [
  { name: 'Medical', value: 350, fill: 'var(--color-medical)' },
  { name: 'Surgical', value: 250, fill: 'var(--color-surgical)' },
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
    { name: 'Approved', value: claimsByStatus['Approved'] || 0, fill: 'var(--color-approved)' },
    { name: 'Pending', value: claimsByStatus['Pending'] || 0, fill: 'var(--color-pending)' },
    { name: 'Rejected', value: claimsByStatus['Rejected'] || 0, fill: 'var(--color-rejected)' },
];


const chartConfig = {
  cashless: {
    label: 'Cashless',
    color: 'hsl(var(--chart-1))',
  },
  reimbursement: {
    label: 'Reimbursement',
    color: 'hsl(var(--chart-2))',
  },
   medical: {
    label: 'Medical',
    color: 'hsl(var(--chart-3))',
  },
  surgical: {
    label: 'Surgical',
    color: 'hsl(var(--chart-4))',
  },
  approved: {
    label: 'Approved',
    color: 'hsl(var(--chart-2))',
  },
  pending: {
      label: 'Pending',
      color: 'hsl(var(--chart-5))',
  },
  rejected: {
      label: 'Rejected',
      color: 'hsl(var(--chart-3))',
  }
};

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
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={claimTypeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {claimTypeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
                 {claimTypeData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.fill}}/>
                        <span>{item.name} ({((item.value / (claimTypeData.reduce((acc, curr) => acc + curr.value, 0))) * 100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
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
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={treatmentTypeData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {treatmentTypeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
             <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
                 {treatmentTypeData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.fill}}/>
                        <span>{item.name} ({((item.value / (treatmentTypeData.reduce((acc, curr) => acc + curr.value, 0))) * 100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
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
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={claimStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {claimStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
             <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
                 {claimStatusData.map(item => (
                    <div key={item.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.fill}}/>
                        <span>{item.name} ({((item.value / (claimStatusData.reduce((acc, curr) => acc + curr.value, 0))) * 100).toFixed(0)}%)</span>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
