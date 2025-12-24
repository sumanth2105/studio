import type { Holder, Hospital, Claim, Policy, Insurer } from './types';
import { placeholderImages } from './placeholder-images';

const userAvatar1 = placeholderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '';
const hospitalLogo1 = placeholderImages.find(p => p.id === 'hospital-logo-1')?.imageUrl || '';

export const mockHolder: Holder = {
  id: 'user-001',
  name: 'Aarav Sharma',
  mobile: '98XXXXXX01',
  aadhaarLast4: '1234',
  avatarUrl: userAvatar1,
  role: 'holder',
  trustScore: 85,
  emergencyNominee: {
    name: 'Priya Sharma',
    mobile: '98XXXXXX02',
  },
  policies: [
    {
      id: 'policy-01',
      provider: 'HealthSecure India',
      policyNumber: 'HS-987654321',
      status: 'Active',
      coverage: 500000,
    },
    {
      id: 'policy-02',
      provider: 'LifeGuard Insurance',
      policyNumber: 'LG-112233445',
      status: 'Inactive',
      coverage: 1000000,
    },
  ],
};

export const mockHospital: Hospital = {
  id: 'hosp-01',
  name: 'City Central Hospital',
  trustScore: 92,
  logoUrl: hospitalLogo1,
};

export const mockInsurer: Insurer = {
    id: 'insurer-001',
    name: 'Riya Singh',
    mobile: '99XXXXXX01',
    aadhaarLast4: '5678',
    avatarUrl: placeholderImages.find(p => p.id === 'user-avatar-2')?.imageUrl || '',
    role: 'insurer',
}

export const mockClaims: Claim[] = [
  {
    id: 'claim-101',
    holderId: 'user-001',
    hospitalId: 'hosp-01',
    policyId: 'policy-01',
    claimAmount: 75000,
    diagnosis: 'Appendicitis',
    status: 'Auto-Approved',
    submissionDate: '2023-10-26',
    doctorNotes: 'Patient presented with acute abdominal pain. Diagnosis confirmed via ultrasound. Appendectomy performed successfully. Post-op recovery is normal.',
    timeline: [
      { id: 't1-1', timestamp: '2023-10-26T10:00:00Z', status: 'Submitted', description: 'Claim submitted by City Central Hospital.' },
      { id: 't1-2', timestamp: '2023-10-26T10:01:00Z', status: 'Auto-Approved', description: 'Claim auto-approved based on high trust scores and policy validity.' },
      { id: 't1-3', timestamp: '2023-10-28T14:00:00Z', status: 'Settled', description: 'Payment settled with hospital.' },
    ],
    documents: [
      { id: 'd1-1', name: 'Ultrasound Report', type: 'Scan', uploadDate: '2023-10-26', url: '#' },
      { id: 'd1-2', name: 'Hospital Bill', type: 'Bill', uploadDate: '2023-10-28', url: '#' },
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
    doctorNotes: 'Patient admitted with chest pain. Angiogram revealed significant blockage. Stent successfully placed in the left anterior descending artery.',
    timeline: [
      { id: 't2-1', timestamp: '2023-11-15T09:00:00Z', status: 'Submitted', description: 'Claim submitted by City Central Hospital.' },
      { id: 't2-2', timestamp: '2023-11-15T09:05:00Z', status: 'Manual Review', description: 'Claim amount exceeds safety cap. Flagged for manual review.' },
    ],
    documents: [
      { id: 'd2-1', name: 'Angiogram Report', type: 'Scan', uploadDate: '2023-11-15', url: '#' },
      { id: 'd2-2', name: 'Blood Test Results', type: 'Blood Report', uploadDate: '2023-11-15', url: '#' },
    ],
  },
  {
    id: 'claim-103',
    holderId: 'user-001',
    hospitalId: 'hosp-01',
    policyId: 'policy-01',
    claimAmount: 32000,
    diagnosis: 'Malaria Treatment',
    status: 'Approved',
    submissionDate: '2023-08-02',
    doctorNotes: 'Patient admitted with high fever and chills. Blood tests confirm Malaria. Standard treatment protocol administered.',
    timeline: [
      { id: 't3-1', timestamp: '2023-08-02T18:00:00Z', status: 'Submitted', description: 'Claim submitted by City Central Hospital.' },
      { id: 't3-2', timestamp: '2023-08-02T18:05:00Z', status: 'Auto-Approved', description: 'Claim auto-approved.' },
      { id: 't3-3', timestamp: '2023-08-05T11:00:00Z', status: 'Settled', description: 'Payment settled.' },
    ],
    documents: [
       { id: 'd3-1', name: 'Blood Test Results', type: 'Blood Report', uploadDate: '2023-08-02', url: '#' },
    ],
  },
];
