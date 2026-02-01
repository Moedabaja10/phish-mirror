import { RULES, DetectionReason } from "./rules";

// Export the AnalysisResult type so dashboard can use it
export interface AnalysisResult {
  verdict: "SCAM" | "SUSPICIOUS" | "SAFE";
  score: number;
  reasons: DetectionReason[];
}

export function analyzeText(text: string): AnalysisResult {
  const reasons: DetectionReason[] = [];

  for (const rule of RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        reasons.push({
          code: rule.code,
          title: rule.title,
          weight: rule.weight,
          evidence: match[0],
        });
        break;
      }
    }
  }

  const score = Math.min(
    100,
    reasons.reduce((sum, r) => sum + r.weight, 0)
  );

  return {
    verdict:
      score >= 60 ? "SCAM" : score >= 30 ? "SUSPICIOUS" : "SAFE",
    score,
    reasons,
  };
}