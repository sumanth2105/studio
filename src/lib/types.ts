export type UserRole = 'holder' | 'hospital' | 'insurer';

export interface User {
  id: string;
  name: string;
  mobile: string;
  aadhaarLast4: string;
  avatarUrl: string;
  role: UserRole;
}

export interface Policy {
  id: string;
  provider: string;
  policyNumber: string;
  status: 'Active' | 'Inactive';
  coverage: number;
}

export interface ClaimTimelineEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
}

export type ClaimStatus = 'Pending' | 'Auto-Approved' | 'Manual Review' | 'Approved' | 'Rejected';

export interface MedicalDocument {
  id: string;
  name: string;
  type: 'X-Ray' | 'MRI' | 'Blood Report' | 'Scan' | 'Bill';
  uploadDate: string;
  url: string;
}

export interface Claim {
  id: string;
  holderId: string;
  hospitalId: string;
  policyId: string;
  claimAmount: number;
  diagnosis: string;
  status: ClaimStatus;
  submissionDate: string;
  timeline: ClaimTimelineEvent[];
  documents: MedicalDocument[];
  doctorNotes: string;
}

export interface Holder extends User {
  role: 'holder';
  trustScore: number;
  policies: Policy[];
  emergencyNominee: {
    name: string;
    mobile: string;
  };
}

export interface Hospital {
  id: string;
  name: string;
  trustScore: number;
  logoUrl: string;
}

export interface Insurer extends User {
    role: 'insurer';
}
