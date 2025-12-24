'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Search,
  Upload,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { mockClaims, mockHolder } from '@/lib/data';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';
import { detectAnomalousBills } from '@/ai/flows/detect-anomalous-bills';
import type { DetectAnomalousBillsOutput } from '@/ai/flows/detect-anomalous-bills';

export default function HospitalPage() {
  const [anomalyResult, setAnomalyResult] =
    useState<DetectAnomalousBillsOutput | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnomalyResult(null);
      setError(null);
    }
  };

  const handleCheckAnomaly = async () => {
    if (!selectedFile) {
      setError('Please select a bill to check.');
      return;
    }

    setIsChecking(true);
    setAnomalyResult(null);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = async (e) => {
      try {
        const billDataUri = e.target?.result as string;
        const result = await detectAnomalousBills({ billDataUri });
        setAnomalyResult(result);
      } catch (err) {
        setError('Failed to check for anomalies. Please try again.');
        console.error(err);
      } finally {
        setIsChecking(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the selected file.');
      setIsChecking(false);
    };
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
          <CardDescription>
            Search for a patient using their mobile number and last 4 digits of
            Aadhaar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Patient Mobile Number" className="pl-10" />
            </div>
            <Input placeholder="Aadhaar Last 4 Digits" className="max-w-xs" />
            <Button>Search Patient</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Admissions</CardTitle>
            <CardDescription>
              List of patients currently admitted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockClaims.slice(0, 3).map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">
                      {mockHolder.name}
                    </TableCell>
                    <TableCell>{claim.id}</TableCell>
                    <TableCell>
                      <ClaimStatusBadge status={claim.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Bill Anomaly Detection</CardTitle>
            <CardDescription>
              Upload an itemized bill to check for duplicates or inflated
              costs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                id="bill-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="flex-1"
              />
              <Button onClick={handleCheckAnomaly} disabled={isChecking}>
                {isChecking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Check Bill
              </Button>
            </div>
            {isChecking && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing bill, please wait...
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {anomalyResult && (
              <Alert
                variant={anomalyResult.isAnomalous ? 'destructive' : 'default'}
                className={!anomalyResult.isAnomalous ? "bg-primary/10 border-primary/20" : ""}
              >
                {anomalyResult.isAnomalous ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {anomalyResult.isAnomalous
                    ? 'Anomaly Detected'
                    : 'No Anomalies Found'}
                </AlertTitle>
                <AlertDescription>
                  {anomalyResult.explanation}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
