
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
import { mockHolder } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileWarning, Ruler, Weight, Heart, Droplets, Activity, CalendarDays, Stethoscope, Microscope, Pill } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function HealthRecordsPage() {
  const { healthRecords } = mockHolder;

  if (!healthRecords) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>No Health Records Found</AlertTitle>
            <AlertDescription>
              We could not find any health records associated with this account.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getSeverityBadge = (severity: 'Mild' | 'Moderate' | 'Severe') => {
    switch (severity) {
      case 'Severe':
        return 'destructive';
      case 'Moderate':
        return 'secondary';
      default:
        return 'outline';
    }
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Records</CardTitle>
          <CardDescription>
            A summary of your key health information.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Height</CardTitle>
                <Ruler className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{healthRecords.vitals.height}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weight</CardTitle>
                <Weight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{healthRecords.vitals.weight}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{healthRecords.vitals.bloodPressure}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blood Group</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{healthRecords.vitals.bloodGroup}</div>
            </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Medical Conditions</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Condition</TableHead>
                        <TableHead>Diagnosed On</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {healthRecords.conditions.map(c => (
                        <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.name}</TableCell>
                            <TableCell>{new Date(c.diagnosedDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <Microscope className="h-5 w-5 text-primary" />
                <CardTitle>Allergies</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Allergy</TableHead>
                        <TableHead>Severity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {healthRecords.allergies.map(a => (
                        <TableRow key={a.id}>
                            <TableCell className="font-medium">{a.name}</TableCell>
                            <TableCell><Badge variant={getSeverityBadge(a.severity)}>{a.severity}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Card>
          <CardHeader>
             <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                <CardTitle>Current Medications</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {healthRecords.medications.map(m => (
                        <TableRow key={m.id}>
                            <TableCell className="font-medium">{m.name}</TableCell>
                            <TableCell>{m.dosage}</TableCell>
                            <TableCell>{m.frequency}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                <CardTitle>Recent Visits</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Reason for Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthRecords.recentVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell>{new Date(visit.date).toLocaleDateString()}</TableCell>
                  <TableCell>{visit.hospital}</TableCell>
                  <TableCell>{visit.doctor}</TableCell>
                  <TableCell>{visit.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
