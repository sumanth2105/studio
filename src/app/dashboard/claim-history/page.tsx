
'use client';

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowRight,
  CalendarIcon,
  Download,
  Search,
  X,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { mockClaims, mockHolder } from '@/lib/data';
import type { Claim, ClaimStatus } from '@/lib/types';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';
import Link from 'next/link';

export default function ClaimHistoryPage() {
  const [filters, setFilters] = useState<{
    patient: string;
    status: ClaimStatus | 'all';
    dateRange: DateRange | undefined;
  }>({
    patient: '',
    status: 'all',
    dateRange: { from: subDays(new Date(), 90), to: new Date() },
  });

  const filteredClaims = useMemo(() => {
    return mockClaims.filter((claim) => {
      const patientName = mockHolder.name.toLowerCase();
      const filterPatient = filters.patient.toLowerCase();
      const patientMatch = filterPatient
        ? patientName.includes(filterPatient)
        : true;

      const statusMatch =
        filters.status === 'all' ? true : claim.status === filters.status;

      const submissionDate = new Date(claim.submissionDate);
      const dateMatch =
        filters.dateRange?.from && filters.dateRange?.to
          ? submissionDate >= filters.dateRange.from &&
            submissionDate <= filters.dateRange.to
          : true;

      return patientMatch && statusMatch && dateMatch;
    });
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      patient: '',
      status: 'all',
      dateRange: undefined,
    });
  };

  const allStatuses: ClaimStatus[] = [
    'Pending',
    'Auto-Approved',
    'Manual Review',
    'Approved',
    'Rejected',
    'Settled',
  ];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Claim History</CardTitle>
          <CardDescription>
            Search and filter through all past insurance claims submitted by
            your hospital.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-card-foreground/5">
            <div className="lg:col-span-1">
              <label
                htmlFor="patient-search"
                className="text-sm font-medium text-muted-foreground"
              >
                Patient Name
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="patient-search"
                  placeholder="Search by patient..."
                  value={filters.patient}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, patient: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="status-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value as ClaimStatus | 'all',
                  }))
                }
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {allStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label
                htmlFor="date-range-filter"
                className="text-sm font-medium text-muted-foreground"
              >
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={'outline'}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange?.from ? (
                      filters.dateRange.to ? (
                        <>
                          {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                          {format(filters.dateRange.to, 'LLL dd, y')}
                        </>
                      ) : (
                        format(filters.dateRange.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filters.dateRange?.from}
                    selected={filters.dateRange}
                    onSelect={(range) =>
                      setFilters((prev) => ({ ...prev, dateRange: range }))
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
             <div className="flex items-end">
                <Button variant="ghost" onClick={handleClearFilters} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.id}</TableCell>
                    <TableCell>{mockHolder.name}</TableCell>
                    <TableCell>{claim.diagnosis}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                      }).format(claim.claimAmount)}
                    </TableCell>
                    <TableCell>
                      <ClaimStatusBadge status={claim.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right flex justify-end items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/claims/${claim.id}`}>
                          View
                          <ArrowRight className="h-3 w-3 ml-2" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Download PDF">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download PDF</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
