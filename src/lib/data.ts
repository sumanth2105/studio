
import type { Holder, Hospital, Claim, Policy, Insurer, VerificationRequest } from './types';
import { placeholderImages } from './placeholder-images';

const userAvatar1 =
  placeholderImages.find((p) => p.id === 'user-avatar-1')?.imageUrl || '';
const hospitalLogo1 =
  placeholderImages.find((p) => p.id === 'hospital-logo-1')?.imageUrl || '';

export const mockHolder: Holder = {
  id: 'user-001',
  name: 'Insurance Holder',
  mobile: '98XXXXXX01',
  aadhaarLast4: '1234',
  avatarUrl: '',
  role: 'holder',
  trustScore: 85,
  emergencyNominee: {
    name: 'Priya Sharma',
    mobile: '98XXXXXX02',
  },
  verification: {
    aadhaar: true,
    pan: true,
    mobile: true,
    policyDocument: true,
    bankProof: true,
  },
  paymentHistory: {
    onTimeRatio: 0.98, // 98%
    missedPayments: 1,
    consistencyDuration: 36, // 3 years
  },
  fraudIndicators: {
    pastFraudAlerts: false,
    activeInvestigation: false,
    misrepresentationFlags: false,
  },
  policies: [
    {
      id: 'policy-01',
      provider: 'HealthSecure India',
      policyNumber: 'HS-987654321',
      status: 'Active',
      coverage: 500000,
      startDate: '2021-01-01',
      endDate: '2024-12-31',
      lastPremiumPaymentDate: '2023-12-15',
    },
    {
      id: 'policy-02',
      provider: 'LifeGuard Insurance',
      policyNumber: 'LG-112233445',
      status: 'Inactive',
      coverage: 1000000,
      startDate: '2020-06-01',
      endDate: '2023-05-31',
      lastPremiumPaymentDate: '2023-05-01',
    },
  ],
  healthRecords: {
    vitals: {
      height: "5' 9\"",
      weight: '75 kg',
      bloodPressure: '120/80 mmHg',
      bloodGroup: 'O+',
    },
    allergies: [{ id: 'allergy-1', name: 'Peanuts', severity: 'Severe' }],
    medications: [
      {
        id: 'med-1',
        name: 'Metformin',
        dosage: '500 mg',
        frequency: 'Twice a day',
      },
    ],
    conditions: [
      { id: 'cond-1', name: 'Type 2 Diabetes', diagnosedDate: '2020-05-10' },
      { id: 'cond-2', name: 'Hypertension', diagnosedDate: '2021-01-15' },
    ],
    recentVisits: [
      {
        id: 'visit-1',
        date: '2023-10-26',
        doctor: 'Dr. Mehta',
        reason: 'Appendicitis',
        hospital: 'City Central Hospital',
      },
       {
        id: 'visit-2',
        date: '2023-08-02',
        doctor: 'Dr. Gupta',
        reason: 'Malaria',
        hospital: 'City Central Hospital',
      },
    ],
  },
};

export const mockHospital: Hospital = {
  id: 'hosp-01',
  name: 'City Central Hospital',
  registrationId: 'HOS-IN-DL-10293',
  address: '123, Main Road, New Delhi, Delhi 110001',
  networkType: 'Network',
  contactEmail: 'admin@citycentral.hosp',
  contactPhone: '011-23456789',
  trustScore: 92,
  logoUrl: hospitalLogo1,
  documents: [
    { id: 'doc-h1', name: 'Hospital Registration Certificate', uploadDate: '2022-01-15' },
    { id: 'doc-h2', name: 'Fire Safety Clearance', uploadDate: '2023-06-20' },
    { id: 'doc-h3', name: 'Accreditation Certificate (NABH)', uploadDate: '2023-08-01' },
  ],
  auditLogs: [
    { id: 'log-1', timestamp: '2023-11-20T10:00:00Z', userId: 'admin-01', action: 'Updated contact phone number.' },
    { id: 'log-2', timestamp: '2023-09-12T15:30:00Z', userId: 'admin-01', action: 'Updated contact email address.' },
  ]
};

export const mockInsurer: Insurer = {
  id: 'insurer-001',
  name: 'Riya Singh',
  mobile: '99XXXXXX01',
  aadhaarLast4: '5678',
  avatarUrl:
    placeholderImages.find((p) => p.id === 'user-avatar-2')?.imageUrl || '',
  role: 'insurer',
};

export const mockClaims: Claim[] = [
  {
    id: 'claim-101',
    holderId: 'user-001',
    hospitalId: 'hosp-01',
    policyId: 'policy-01',
    claimAmount: 75000,
    diagnosis: 'Appendicitis',
    status: 'Settled',
    submissionDate: '2023-10-26',
    doctorNotes:
      'Patient presented with acute abdominal pain. Diagnosis confirmed via ultrasound. Appendectomy performed successfully. Post-op recovery is normal.',
    timeline: [
      {
        id: 't1-1',
        timestamp: '2023-10-26T10:00:00Z',
        status: 'Submitted',
        description: 'Claim submitted by City Central Hospital.',
      },
      {
        id: 't1-2',
        timestamp: '2023-10-26T10:01:00Z',
        status: 'Insurance Claim Guaranteed',
        description:
          'Claim auto-approved based on high trust scores and policy validity.',
      },
      {
        id: 't1-3',
        timestamp: '2023-10-28T14:00:00Z',
        status: 'Settled',
        description: 'Payment settled with hospital.',
      },
    ],
    documents: [
      {
        id: 'd1-1',
        name: 'Ultrasound Report',
        type: 'Scan',
        uploadDate: '2023-10-26',
        url: '#',
      },
      {
        id: 'd1-2',
        name: 'Hospital Bill',
        type: 'Bill',
        uploadDate: '2023-10-28',
        url: '#',
      },
    ],
  },
  {
    id: 'claim-102',
    holderId: 'user-001',
    hospitalId: 'hosp-01',
    policyId: 'policy-01',
    claimAmount: 250000,
    diagnosis: 'Cardiac Stent Placement',
    status: 'Manual Review',
    submissionDate: '2023-11-15',
    doctorNotes:
      'Patient admitted with chest pain. Angiogram revealed significant blockage. Stent successfully placed in the left anterior descending artery.',
    timeline: [
      {
        id: 't2-1',
        timestamp: '2023-11-15T09:00:00Z',
        status: 'Submitted',
        description: 'Claim submitted by City Central Hospital.',
      },
      {
        id: 't2-2',
        timestamp: '2023-11-15T09:05:00Z',
        status: 'Manual Review',
        description:
          'Claim amount exceeds safety cap. Flagged for manual review.',
      },
    ],
    documents: [
      {
        id: 'd2-1',
        name: 'Angiogram Report',
        type: 'Scan',
        uploadDate: '2023-11-15',
        url: '#',
      },
      {
        id: 'd2-2',
        name: 'Blood Test Results',
        type: 'Blood Report',
        uploadDate: '2023-11-15',
        url: '#',
      },
    ],
  },
  {
    id: 'claim-103',
    holderId: 'user-001',
    hospitalId: 'hosp-01',
    policyId: 'policy-01',
    claimAmount: 32000,
    diagnosis: 'Malaria Treatment',
    status: 'Settled',
    submissionDate: '2023-08-02',
    doctorNotes:
      'Patient admitted with high fever and chills. Blood tests confirm Malaria. Standard treatment protocol administered.',
    timeline: [
      {
        id: 't3-1',
        timestamp: '2023-08-02T18:00:00Z',
        status: 'Submitted',
        description: 'Claim submitted by City Central Hospital.',
      },
      {
        id: 't3-2',
        timestamp: '2023-08-02T18:05:00Z',
        status: 'Insurance Claim Guaranteed',
        description: 'Claim auto-approved.',
      },
      {
        id: 't3-3',
        timestamp: '2023-08-05T11:00:00Z',
        status: 'Settled',
        description: 'Payment settled.',
      },
    ],
    documents: [
      {
        id: 'd3-1',
        name: 'Blood Test Results',
        type: 'Blood Report',
        uploadDate: '2023-08-02',
        url: '#',
      },
    ],
  },
];


export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: 'hosp-req-1',
    name: 'Wellness General Hospital',
    registrationId: 'HOS-IN-MH-40129',
    dateOfRequest: '2023-11-18',
    status: 'Pending Verification',
    claimsCount: 150,
    disputeRatio: 0.05,
    trustScore: 88,
    trustScoreAnalysis: 'Good claim history, but document submission is slightly delayed.'
  },
  {
    id: 'hosp-req-2',
    name: 'Unity Health Care',
    registrationId: 'HOS-IN-KA-88765',
    dateOfRequest: '2023-11-12',
    status: 'Pending Verification',
    claimsCount: 320,
    disputeRatio: 0.02,
    trustScore: 94,
    trustScoreAnalysis: 'Excellent claim approval rate and fast document submission.'
  },
  {
    id: 'hosp-req-3',
    name: 'Sunrise Medical Center',
    registrationId: 'HOS-IN-TN-55432',
    dateOfRequest: '2023-11-05',
    status: 'Additional Documents Required',
    claimsCount: 80,
    disputeRatio: 0.1,
    trustScore: 75,
    trustScoreAnalysis: 'High dispute ratio. Suggest reviewing claim submission process.'
  },
];
