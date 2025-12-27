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

const claimTypeData = [
  { name: 'Cashless', value: 480, fill: 'var(--color-cashless)' },
  { name: 'Reimbursement', value: 120, fill: 'var(--color-reimbursement)' },
];
const treatmentTypeData = [
  { name: 'Medical', value: 350, fill: 'var(--color-medical)' },
  { name: 'Surgical', value: 250, fill: 'var(--color-surgical)' },
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
};

export default function TypesOfClaimsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Types of Claims</CardTitle>
          <CardDescription>
            An overview of claim distributions by type and treatment.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}
