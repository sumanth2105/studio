
import type { Holder, Claim } from './types';
import { differenceInMonths } from 'date-fns';

type ScoreComponent = {
  score: number;
  explanation: string;
};

type ScoreBreakdown = {
  identity: ScoreComponent;
  policyHealth: ScoreComponent;
  paymentBehavior: ScoreComponent;
  claimBehavior: ScoreComponent;
  documentCompleteness: ScoreComponent;
  fraudPenalties: ScoreComponent;
};

type TrustScoreResult = {
  finalScore: number;
  category: 'Highly Trusted' | 'Trusted' | 'Moderate Risk' | 'High Risk';
  breakdown: ScoreBreakdown;
  explanationPoints: string[];
};

export function calculateTrustScore(holder: Holder, claims: Claim[]): TrustScoreResult {
  const breakdown: ScoreBreakdown = {
    identity: { score: 0, explanation: '' },
    policyHealth: { score: 0, explanation: '' },
    paymentBehavior: { score: 0, explanation: '' },
    claimBehavior: { score: 0, explanation: '' },
    documentCompleteness: { score: 0, explanation: '' },
    fraudPenalties: { score: 0, explanation: '' },
  };

  const explanationPoints: string[] = [];

  // 1. Identity Verification (Max 20 points)
  if (holder.verification.aadhaar) breakdown.identity.score += 8;
  if (holder.verification.pan) breakdown.identity.score += 8;
  if (holder.verification.mobile) breakdown.identity.score += 4;
  breakdown.identity.explanation = `Scored ${breakdown.identity.score}/20 for identity verification.`;
  if (breakdown.identity.score === 20) {
    explanationPoints.push('All identity documents are fully verified.');
  }

  // 2. Policy Health (Max 20 points)
  const activePolicy = holder.policies.find((p) => p.status === 'Active');
  if (activePolicy) {
    breakdown.policyHealth.score += 10;
    const policyTenureMonths = differenceInMonths(new Date(), new Date(activePolicy.startDate));
    
    if (policyTenureMonths >= 24) {
      breakdown.policyHealth.score += 10;
      explanationPoints.push(`Long policy tenure of ${Math.floor(policyTenureMonths/12)} years.`);
    } else if (policyTenureMonths >= 12) {
      breakdown.policyHealth.score += 7;
      explanationPoints.push('Policy has been active for over a year.');
    } else {
      breakdown.policyHealth.score += 4;
    }
  }
  breakdown.policyHealth.explanation = `Scored ${breakdown.policyHealth.score}/20 for policy health.`;

  // 3. Premium Payment Behavior (Max 25 points)
  const { onTimeRatio } = holder.paymentHistory;
  if (onTimeRatio >= 0.95) {
    breakdown.paymentBehavior.score += 25;
    explanationPoints.push('Excellent history of on-time premium payments.');
  } else if (onTimeRatio >= 0.8) {
    breakdown.paymentBehavior.score += 18;
  } else if (onTimeRatio >= 0.6) {
    breakdown.paymentBehavior.score += 10;
  }
  breakdown.paymentBehavior.explanation = `Scored ${breakdown.paymentBehavior.score}/25 for payment behavior.`;

  // 4. Claim Behavior (Max 20 points)
  const rejectedClaims = claims.filter((c) => c.status === 'Rejected').length;
  if (rejectedClaims === 0) {
    breakdown.claimBehavior.score += 10;
    explanationPoints.push('No history of rejected claims.');
  } else {
    breakdown.claimBehavior.score -= 10;
  }
  
  if (claims.length < 3) { // Assuming low claim frequency
    breakdown.claimBehavior.score += 10;
    explanationPoints.push('Low frequency of claims filed.');
  }
  
  // Ensure score does not go below zero for this section
  breakdown.claimBehavior.score = Math.max(0, breakdown.claimBehavior.score);
  breakdown.claimBehavior.explanation = `Scored ${breakdown.claimBehavior.score}/20 for claim behavior.`;
  

  // 5. Document Completeness (Max 10 points)
  const { policyDocument, bankProof } = holder.verification;
  if (policyDocument && bankProof && holder.verification.aadhaar) {
    breakdown.documentCompleteness.score += 10;
    explanationPoints.push('All mandatory documents are complete.');
  } else if (!policyDocument || !bankProof || !holder.verification.aadhaar) {
    breakdown.documentCompleteness.score -= 5;
  }
  breakdown.documentCompleteness.explanation = `Scored ${breakdown.documentCompleteness.score}/10 for document completeness.`;


  // 6. Fraud & Risk Penalties (Max -15 points)
  if (holder.fraudIndicators.pastFraudAlerts) breakdown.fraudPenalties.score -= 10;
  if (holder.fraudIndicators.activeInvestigation) breakdown.fraudPenalties.score -= 15;
  if (breakdown.fraudPenalties.score === 0) {
      explanationPoints.push('No past fraud flags or investigations.');
  }
  breakdown.fraudPenalties.explanation = `Applied ${breakdown.fraudPenalties.score} points in fraud penalties.`;

  // Final Score Calculation
  let finalScore =
    breakdown.identity.score +
    breakdown.policyHealth.score +
    breakdown.paymentBehavior.score +
    breakdown.claimBehavior.score +
    breakdown.documentCompleteness.score +
    breakdown.fraudPenalties.score;

  // Clamp score between 0 and 100
  finalScore = Math.max(0, Math.min(100, finalScore));

  // Categorize
  let category: TrustScoreResult['category'];
  if (finalScore >= 80) category = 'Highly Trusted';
  else if (finalScore >= 60) category = 'Trusted';
  else if (finalScore >= 40) category = 'Moderate Risk';
  else category = 'High Risk';

  return {
    finalScore: Math.round(finalScore),
    category,
    breakdown,
    explanationPoints: explanationPoints.slice(0, 5), // Return top 5 explanations
  };
}
