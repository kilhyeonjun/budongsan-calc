/**
 * 광고 슬롯 Placeholder
 * 개발/초기 배포에서는 placeholder만 표시
 * AdSense 승인 후 실제 광고 코드 삽입
 * CLS 방지를 위해 min-height 고정
 */

interface AdSlotProps {
  /** 슬롯 ID: topNotice, afterResult, guideInline, guideBottom, desktopSidebar */
  slot: "topNotice" | "afterResult" | "guideInline" | "guideBottom" | "desktopSidebar";
  className?: string;
}

const SLOT_CONFIG: Record<AdSlotProps["slot"], { minHeight: number; label: string; hideOnMobile?: boolean }> = {
  topNotice: { minHeight: 90, label: "광고", hideOnMobile: true },
  afterResult: { minHeight: 250, label: "광고" },
  guideInline: { minHeight: 90, label: "광고" },
  guideBottom: { minHeight: 250, label: "광고" },
  desktopSidebar: { minHeight: 600, label: "광고", hideOnMobile: true },
};

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const config = SLOT_CONFIG[slot];
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";

  if (!showAds) {
    // 개발 모드에서는 placeholder 박스만 표시
    return (
      <div
        className={`
          border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs
          ${config.hideOnMobile ? "hidden lg:flex" : "flex"}
          ${className}
        `}
        style={{ minHeight: config.minHeight }}
        aria-hidden="true"
      >
        {config.label} ({slot})
      </div>
    );
  }

  // 실제 AdSense 코드 삽입 위치
  return (
    <div
      className={`
        ${config.hideOnMobile ? "hidden lg:block" : "block"}
        ${className}
      `}
      style={{ minHeight: config.minHeight }}
    >
      {/* TODO: AdSense 승인 후 ins.adsbygoogle 태그 삽입 */}
    </div>
  );
}
