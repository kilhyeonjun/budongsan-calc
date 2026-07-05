/**
 * 주택담보대출 계산기
 * 원리금균등, 원금균등, 만기일시 상환 방식
 */

export type RepaymentType = "equalPrincipalInterest" | "equalPrincipal" | "bulletRepayment";

export interface MortgageInput {
  /** 대출 원금 (원) */
  principal: number;
  /** 연 이율 (%, e.g. 4.0) */
  annualRate: number;
  /** 대출 기간 (년) */
  years: number;
  /** 상환 방식 */
  repaymentType: RepaymentType;
}

export interface MortgageResult {
  /** 월 상환액 (원) - 원금균등은 첫 달 기준 */
  monthlyPayment: number;
  /** 총 상환액 (원) */
  totalPayment: number;
  /** 총 이자 (원) */
  totalInterest: number;
  /** 월별 상환 스케줄 (optional, 처음 12개월) */
  schedule: MonthlyScheduleItem[];
}

export interface MonthlyScheduleItem {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  remainingBalance: number;
}

/**
 * 원리금균등상환 월 상환액 계산
 * PMT = P * r * (1+r)^n / ((1+r)^n - 1)
 */
function calcEqualPrincipalInterest(principal: number, monthlyRate: number, months: number): MortgageResult {
  if (monthlyRate === 0) {
    const mp = Math.round(principal / months);
    return {
      monthlyPayment: mp,
      totalPayment: mp * months,
      totalInterest: 0,
      schedule: generateScheduleEPI(principal, 0, months),
    };
  }

  const r = monthlyRate;
  const n = months;
  const factor = Math.pow(1 + r, n);
  const monthlyPayment = Math.round(principal * r * factor / (factor - 1));
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule: generateScheduleEPI(principal, r, n),
  };
}

function generateScheduleEPI(principal: number, monthlyRate: number, months: number): MonthlyScheduleItem[] {
  const schedule: MonthlyScheduleItem[] = [];
  let remaining = principal;
  const r = monthlyRate;
  const n = months;

  let mp: number;
  if (r === 0) {
    mp = Math.round(principal / months);
  } else {
    const factor = Math.pow(1 + r, n);
    mp = Math.round(principal * r * factor / (factor - 1));
  }

  const limit = Math.min(months, 12);
  for (let i = 1; i <= limit; i++) {
    const interest = Math.round(remaining * r);
    const principalPart = mp - interest;
    remaining -= principalPart;
    schedule.push({
      month: i,
      principal: principalPart,
      interest,
      payment: mp,
      remainingBalance: Math.max(0, remaining),
    });
  }
  return schedule;
}

/**
 * 원금균등상환
 * 매월 원금은 동일, 이자는 잔액 기준 감소
 */
function calcEqualPrincipal(principal: number, monthlyRate: number, months: number): MortgageResult {
  const monthlyPrincipal = Math.round(principal / months);
  let remaining = principal;
  let totalInterest = 0;
  const schedule: MonthlyScheduleItem[] = [];

  const limit = Math.min(months, 12);
  for (let i = 1; i <= months; i++) {
    const interest = Math.round(remaining * monthlyRate);
    totalInterest += interest;
    const payment = monthlyPrincipal + interest;
    remaining -= monthlyPrincipal;

    if (i <= limit) {
      schedule.push({
        month: i,
        principal: monthlyPrincipal,
        interest,
        payment,
        remainingBalance: Math.max(0, remaining),
      });
    }
  }

  // 첫 달 기준 월 상환액
  const firstMonthInterest = Math.round(principal * monthlyRate);
  const monthlyPayment = monthlyPrincipal + firstMonthInterest;

  return {
    monthlyPayment,
    totalPayment: principal + totalInterest,
    totalInterest,
    schedule,
  };
}

/**
 * 만기일시상환
 * 매월 이자만 납부, 만기에 원금 일시 상환
 */
function calcBulletRepayment(principal: number, monthlyRate: number, months: number): MortgageResult {
  const monthlyInterest = Math.round(principal * monthlyRate);
  const totalInterest = monthlyInterest * months;
  const schedule: MonthlyScheduleItem[] = [];

  const limit = Math.min(months, 12);
  for (let i = 1; i <= limit; i++) {
    const isLast = i === months;
    schedule.push({
      month: i,
      principal: isLast ? principal : 0,
      interest: monthlyInterest,
      payment: isLast ? principal + monthlyInterest : monthlyInterest,
      remainingBalance: isLast ? 0 : principal,
    });
  }

  return {
    monthlyPayment: monthlyInterest,
    totalPayment: principal + totalInterest,
    totalInterest,
    schedule,
  };
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const { principal, annualRate, years, repaymentType } = input;
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  switch (repaymentType) {
    case "equalPrincipalInterest":
      return calcEqualPrincipalInterest(principal, monthlyRate, months);
    case "equalPrincipal":
      return calcEqualPrincipal(principal, monthlyRate, months);
    case "bulletRepayment":
      return calcBulletRepayment(principal, monthlyRate, months);
  }
}
