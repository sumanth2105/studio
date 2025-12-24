import { cn } from '@/lib/utils';

interface TrustScoreGaugeProps {
  score: number;
  className?: string;
}

export function TrustScoreGauge({ score, className }: TrustScoreGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'stroke-primary';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-destructive';
  };

  return (
    <div className={cn("relative flex items-center justify-center w-32 h-32", className)}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-border"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
        />
        <circle
          className={cn(
            'stroke-current transition-all duration-1000 ease-out',
            getScoreColor()
          )}
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="text-center">
        <span className="text-3xl font-bold text-foreground">{score}</span>
        <p className="text-xs text-muted-foreground">Trust Score</p>
      </div>
    </div>
  );
}
