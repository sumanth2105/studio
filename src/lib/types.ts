
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
  startDate: string;
  endDate: string;
  lastPremiumPaymentDate: string;
}

export interface ClaimTimelineEvent {
  id: string;
  timestamp: string;
  status: string;
  description: string;
}

export type ClaimStatus =
  | 'Pending'
  | 'Insurance Claim Guaranteed'
  | 'Manual Review'
  | 'Approved'
  | 'Rejected'
  | 'Settled';

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

export interface HealthRecord {
    vitals: {
        height: string;
        weight: string;
        bloodPressure: string;
        bloodGroup: string;
    };
    allergies: { id: string; name: string; severity: 'Mild' | 'Moderate' | 'Severe' }[];
    medications: { id: string; name: string; dosage: string; frequency: string }[];
    conditions: { id: string; name: string; diagnosedDate: string }[];
    recentVisits: { id: string; date: string; doctor: string; reason: string; hospital: string }[];
}

export interface VerificationStatus {
    aadhaar: boolean;
    pan: boolean;
    mobile: boolean;
    policyDocument: boolean;
    bankProof: boolean;
}

export interface PaymentHistory {
    onTimeRatio: number; // e.g., 0.95 for 95%
    missedPayments: number;
    consistencyDuration: number; // in months
}

export interface FraudIndicators {
    pastFraudAlerts: boolean;
    activeInvestigation: boolean;
    misrepresentationFlags: boolean;
}

export interface Holder extends User {
  role: 'holder';
  trustScore: number;
  policies: Policy[];
  emergencyNominee: {
    name: string;
    mobile: string;
  };
  healthRecords?: HealthRecord;
  verification: VerificationStatus;
  paymentHistory: PaymentHistory;
  fraudIndicators: FraudIndicators;
}

export interface HospitalDocument {
    id: string;
    name: string;
    uploadDate: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    action: string;
}

export interface Hospital {
  id: string;
  name: string;
  registrationId: string;
  address: string;
  networkType: 'Network' | 'Non-network';
  contactEmail: string;
  contactPhone: string;
  trustScore: number;
  logoUrl: string;
  documents: HospitalDocument[];
  auditLogs: AuditLog[];
}

export interface Insurer extends User {
  role: 'insurer';
}

export type VerificationRequestStatus =
  | 'Pending Verification'
  | 'Additional Documents Required'
  | 'Verified'
  | 'Rejected';

export interface VerificationRequest {
  id: string;
  name: string;
  registrationId: string;
  dateOfRequest: string;
  status: VerificationRequestStatus;
  claimsCount: number;
  disputeRatio: number;
  trustScore: number;
}
