
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  CalendarIcon,
  CheckCircle,
  Download,
  ShieldAlert,
  Clock,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { subDays, format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockHospitalPerformance = [
    { name: 'City Central Hospital', approvalRate: 95, avgSettlementDays: 2 },
    { name: 'Wellness General Hospital', approvalRate: 92, avgSettlementDays: 3 },
    { name: 'Sunrise Medical Center', approvalRate: 88, avgSettlementDays: 4 },
];

export default function ReportsAndAnalyticsPage() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Reports & Analytics</CardTitle>
            <CardDescription>
              Performance and compliance insights for management.
            </CardDescription>
          </div>
           <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className="w-[300px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, 'LLL dd, y')} -{' '}
                        {format(date.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(date.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Claim Approval Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">94.5%</div>
                 <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Approval Success</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">78.2%</div>
                 <p className="text-xs text-muted-foreground">Of all eligible claims</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraud Incidence Rate</CardTitle>
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1.8%</div>
                 <p className="text-xs text-muted-foreground">-0.3% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Settlement Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3.2 Days</div>
                 <p className="text-xs text-muted-foreground">Faster by 8% from last month</p>
            </CardContent>
        </Card>
      </div>

       <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                <CardTitle>Hospital Performance</CardTitle>
             </div>
             <CardDescription>Top performing hospitals by approval rate and settlement time.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Approval Rate</TableHead>
                        <TableHead>Avg. Settlement</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockHospitalPerformance.map(h => (
                        <TableRow key={h.name}>
                            <TableCell className="font-medium">{h.name}</TableCell>
                            <TableCell className="text-green-600 font-semibold">{h.approvalRate}%</TableCell>
                            <TableCell>{h.avgSettlementDays} days</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Trust Score Distribution</CardTitle>
             </div>
             <CardDescription>Breakdown of trust scores across all active policy holders.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-64 bg-muted/50 rounded-md flex items-center justify-center'>
                 <p className='text-muted-foreground text-sm'>Chart placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
