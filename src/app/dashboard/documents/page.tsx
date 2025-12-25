
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  FileUp,
  Loader2,
  Paperclip,
  Upload,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

type DocumentType =
  | 'aadhaar'
  | 'pan'
  | 'policy'
  | 'premium_proof'
  | 'bank_proof'
  | 'self_declaration';

const documentList: {
  id: DocumentType;
  name: string;
  description: string;
  required?: boolean;
}[] = [
  {
    id: 'aadhaar',
    name: 'Aadhaar Card',
    description: 'For identity and address verification.',
    required: true,
  },
  {
    id: 'pan',
    name: 'PAN Card',
    description: 'For financial verification.',
  },
  {
    id: 'policy',
    name: 'Insurance Policy Document',
    description: 'The complete policy document.',
    required: true,
  },
  {
    id: 'premium_proof',
    name: 'Premium Payment Proof',
    description: 'Latest premium payment receipt.',
    required: true,
  },
  {
    id: 'bank_proof',
    name: 'Bank Proof',
    description: 'Cancelled cheque or bank passbook first page.',
    required: true,
  },
  {
    id: 'self_declaration',
    name: 'Self-Declaration Form',
    description: 'A signed self-declaration form if required.',
  },
];

const selfDeclarationText = [
    "All the information and documents provided by me on this platform are true, correct, and complete to the best of my knowledge.",
    "I confirm that the uploaded documents belong only to me and have not been altered, forged, or misrepresented.",
    "I understand that any false information or fraudulent documents may result in: Rejection or cancellation of insurance claims, Suspension of platform access, or Legal action as per applicable laws.",
    "I authorize the platform and associated insurance providers to verify the submitted information with relevant authorities or service providers, strictly for claim and verification purposes.",
    "I provide explicit consent for my information to be accessed by: Authorized hospitals during medical emergencies, and Authorized insurance companies for claim processing.",
    "I acknowledge that my data will be processed in accordance with applicable data protection and privacy laws.",
    "I understand that emergency treatment approvals may be provided based on system trust evaluation and that final claim settlement may occur later.",
];


export default function DocumentsPage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<Record<DocumentType, File | null>>({
    aadhaar: null,
    pan: null,
    policy: null,
    premium_proof: null,
    bank_proof: null,
    self_declaration: null,
  });
  const [uploadStatus, setUploadStatus] = useState<
    Record<DocumentType, 'idle' | 'uploading' | 'uploaded' | 'error'>
  >({
    aadhaar: 'idle',
    pan: 'idle',
    policy: 'idle',
    premium_proof: 'idle',
    bank_proof: 'idle',
    self_declaration: 'idle',
  });
  const [declarationConsent, setDeclarationConsent] = useState(false);

  const handleFileChange = (
    docId: DocumentType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [docId]: file }));
      setUploadStatus((prev) => ({ ...prev, [docId]: 'idle' }));
    }
  };

  const handleUpload = async (docId: DocumentType) => {
    const file = files[docId];
    if (!file) return;

    setUploadStatus((prev) => ({ ...prev, [docId]: 'uploading' }));

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      setUploadStatus((prev) => ({ ...prev, [docId]: 'uploaded' }));
      toast({
        title: 'Upload Successful',
        description: `${documentList.find(d => d.id === docId)?.name} has been uploaded.`,
      });
    } else {
      setUploadStatus((prev) => ({ ...prev, [docId]: 'error' }));
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: `Could not upload ${documentList.find(d => d.id === docId)?.name}. Please try again.`,
      });
    }
  };
  
    const handleDeclarationSubmit = async () => {
        setUploadStatus((prev) => ({ ...prev, self_declaration: 'uploading' }));
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            setUploadStatus((prev) => ({ ...prev, self_declaration: 'uploaded' }));
            toast({
                title: 'Declaration Submitted',
                description: 'Your self-declaration has been recorded.',
            });
        } else {
            setUploadStatus((prev) => ({ ...prev, self_declaration: 'error' }));
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: 'Could not submit declaration. Please try again.',
            });
        }
    };


  const getStatusIcon = (status: 'idle' | 'uploading' | 'uploaded' | 'error', docId: DocumentType) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
      case 'uploaded':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
       case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return docId === 'self_declaration' ? <FileText className="h-5 w-5 text-muted-foreground" /> : <Paperclip className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload Center</CardTitle>
        <CardDescription>
          Please upload the required documents and provide your consent. This will help
          in building your trust score and ensuring faster claim processing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {documentList.map((doc) => (
          <div key={doc.id}>
            {doc.id === 'self_declaration' ? (
                 <div className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(uploadStatus[doc.id], doc.id)}</div>
                     <div className="flex-1 space-y-4">
                        <h4 className="font-semibold">
                            {doc.name} {doc.required && <span className="text-destructive">*</span>}
                        </h4>
                        <ScrollArea className="h-48 w-full rounded-md border bg-muted/50 p-4">
                            <div className="space-y-3 text-sm text-muted-foreground">
                                {selfDeclarationText.map((text, i) => <p key={i}>{text}</p>)}
                                <p className="font-medium pt-2">Date: {new Date().toLocaleDateString()}</p>
                            </div>
                        </ScrollArea>
                        
                         {uploadStatus[doc.id] !== 'uploaded' ? (
                            <>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="consent" checked={declarationConsent} onCheckedChange={(checked) => setDeclarationConsent(Boolean(checked))} />
                                    <Label htmlFor="consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                       I acknowledge and give my consent.
                                    </Label>
                                </div>
                                 <Button
                                    onClick={handleDeclarationSubmit}
                                    disabled={!declarationConsent || uploadStatus[doc.id] === 'uploading'}
                                    className="w-full md:w-auto"
                                >
                                    {uploadStatus[doc.id] === 'uploading' ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Submit Declaration
                                </Button>
                            </>
                         ) : (
                             <p className="text-sm text-green-600 font-medium mt-2">
                                Declaration submitted on {new Date().toLocaleString()}.
                            </p>
                         )}

                        {uploadStatus[doc.id] === 'error' && (
                             <p className="text-sm text-destructive font-medium mt-2">
                                Submission failed. Please try again.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
             <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">{getStatusIcon(uploadStatus[doc.id], doc.id)}</div>
                <div className="flex-1">
                    <h4 className="font-semibold">
                        {doc.name} {doc.required && <span className="text-destructive">*</span>}
                    </h4>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                     {files[doc.id] && uploadStatus[doc.id] !== 'uploaded' && (
                        <p className="text-sm text-primary mt-1">{files[doc.id]?.name}</p>
                     )}
                     {uploadStatus[doc.id] === 'uploaded' && (
                        <p className="text-sm text-green-600 font-medium mt-1">Uploaded: {files[doc.id]?.name}</p>
                     )}
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <Input
                    id={doc.id}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(doc.id, e)}
                    disabled={uploadStatus[doc.id] === 'uploading'}
                  />
                  <Button asChild variant="outline" className="flex-1">
                    <label htmlFor={doc.id}>
                      {files[doc.id] ? 'Change File' : 'Select File'}
                    </label>
                  </Button>
                  <Button
                    onClick={() => handleUpload(doc.id)}
                    disabled={!files[doc.id] || uploadStatus[doc.id] === 'uploading' || uploadStatus[doc.id] === 'uploaded'}
                    className="flex-1"
                  >
                    {uploadStatus[doc.id] === 'uploading' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Upload</span>
                  </Button>
                </div>
            </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

    