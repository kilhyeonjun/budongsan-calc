/**
 * 취득세 간이 계산기
 * 2024~2026 기준 단순화 버전
 * 주의: 정확한 세율은 정책 변동이 잦으므로 참고용
 */

export interface AcquisitionTaxInput {
  /** 주택 가격 (원) */
  propertyValue: number;
  /** 취득 후 보유 주택 수 */
  houseCount: 1 | 2 | 3;
  /** 전용면적 (㎡) */
  area: number;
  /** 조정대상지역 여부 */
  isRegulatedArea: boolean;
}

export interface AcquisitionTaxResult {
  /** 취득세율 (%) */
  taxRate: number;
  /** 취득세 (원) */
  acquisitionTax: number;
  /** 지방교육세 (원) */
  localEducationTax: number;
  /** 농어촌특별세 (원) - 85㎡ 초과시 */
  ruralTax: number;
  /** 총 세금 (원) */
  totalTax: number;
  /** 면책: 참고용 */
  disclaimer: string;
}

/**
 * 1주택 취득세율 (매매가 기준)
 * - 6억 이하: 1%
 * - 6억 초과 ~ 9억 이하: (매매가 * 2/3억 - 3) / 100 (1~3% 구간)
 * - 9억 초과: 3%
 */
function getRate1House(price: number): number {
  if (price <= 600_000_000) return 1;
  if (price <= 900_000_000) {
    // 선형 보간: 6억에서 1%, 9억에서 3%
    return 1 + ((price - 600_000_000) / 300_000_000) * 2;
  }
  return 3;
}

/**
 * 다주택 취득세율 (단순화)
 * 2주택: 조정 8%, 비조정 1~3%
 * 3주택+: 조정 12%, 비조정 8%
 */
function getRateMultiHouse(houseCount: 2 | 3, isRegulated: boolean, price: number): number {
  if (houseCount === 2) {
    if (isRegulated) return 8;
    return getRate1House(price); // 비조정 2주택은 1주택과 동일
  }
  // 3주택 이상
  if (isRegulated) return 12;
  return 8;
}

export function calculateAcquisitionTax(input: AcquisitionTaxInput): AcquisitionTaxResult {
  const { propertyValue, houseCount, area, isRegulatedArea } = input;

  let taxRate: number;
  if (houseCount === 1) {
    taxRate = getRate1House(propertyValue);
  } else {
    taxRate = getRateMultiHouse(houseCount, isRegulatedArea, propertyValue);
  }

  const acquisitionTax = Math.round(propertyValue * taxRate / 100);

  // 지방교육세: 취득세의 10%
  const localEducationTax = Math.round(acquisitionTax * 0.1);

  // 농어촌특별세: 전용 85㎡ 초과 주택은 통상 과세표준의 0.2%를 더한다.
  // 취득세율의 10%가 아니므로 9억 초과 주택 등에서 과대 계산하지 않도록 분리한다.
  const ruralTax = area > 85 ? Math.round(propertyValue * 0.002) : 0;

  const totalTax = acquisitionTax + localEducationTax + ruralTax;

  return {
    taxRate: Math.round(taxRate * 100) / 100,
    acquisitionTax,
    localEducationTax,
    ruralTax,
    totalTax,
    disclaimer: "본 계산은 참고용 추정치이며, 실제 세율은 정책 변동에 따라 달라질 수 있습니다. 정확한 세액은 세무사에게 확인하세요.",
  };
}
