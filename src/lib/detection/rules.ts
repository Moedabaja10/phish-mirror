export interface DetectionReason {
  code: string;
  title: string;
  weight: number;
  evidence?: string;
}

export const RULES = [
  {
    code: "AUTHORITY_IMPERSONATION",
    title: "Impersonates a trusted authority",
    weight: 25,
    patterns: [/bank/i, /fraud department/i, /irs/i],
  },
  {
    code: "URGENCY",
    title: "Creates urgency or panic",
    weight: 20,
    patterns: [/urgent/i, /immediately/i, /right now/i],
  },
  {
    code: "OTP_REQUEST",
    title: "Requests verification code",
    weight: 35,
    patterns: [/verification code/i, /one[- ]time/i, /otp/i],
  },
];