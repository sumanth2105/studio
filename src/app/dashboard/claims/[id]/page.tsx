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
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  DollarSign,
  HeartPulse,
  HospitalIcon,
  User,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { mockClaims, mockHolder, mockHospital } from '@/lib/data';
import { ClaimStatusBadge } from '@/components/dashboard/claim-status-badge';
import { ClaimExplanation } from '@/components/dashboard/claim-explanation';
import { notFound } from 'next/navigation';

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  const claim = mockClaims.find((c) => c.id === params.id);

  if (!claim) {
    notFound();
  }

  const holder = mockHolder;
  const hospital = mockHospital;
  const policy = holder.policies.find((p) => p.id === claim.policyId);

  const getTimelineIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'Auto-Approved':
      case 'Approved':
      case 'Settled':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Claim Details: {claim.id}</CardTitle>
              <CardDescription>
                Submitted on {new Date(claim.submissionDate).toLocaleDateString()}
              </CardDescription>
            </div>
            <ClaimStatusBadge status={claim.status} />
          </div>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="flex items-center gap-3">
                    <User className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Holder</p>
                        <p className="font-semibold">{holder.name}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <HospitalIcon className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Hospital</p>
                        <p className="font-semibold">{hospital.name}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <HeartPulse className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Diagnosis</p>
                        <p className="font-semibold">{claim.diagnosis}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-primary"/>
                    <div>
                        <p className="text-sm text-muted-foreground">Claim Amount</p>
                        <p className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(claim.claimAmount)}</p>
                    </div>
                </div>
            </div>
          <Separator className="my-6" />
          <ClaimExplanation claim={claim} holder={holder} hospital={hospital} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claim Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {claim.timeline.map((event, index) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-muted rounded-full p-2">
                      {getTimelineIcon(event.status)}
                    </div>
                    {index < claim.timeline.length - 1 && (
                      <div className="w-px h-full bg-border"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{event.status}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Associated Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {claim.documents.map(doc => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium text-primary hover:underline cursor-pointer">{doc.name}</TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
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
