/**
 * 광고 슬롯
 * AdSense 승인 전에는 렌더링하지 않아 빈 광고 박스/CLS를 만들지 않는다.
 * NEXT_PUBLIC_SHOW_ADS=true 와 슬롯 코드가 준비된 뒤 실제 광고 태그를 연결한다.
 */

interface AdSlotProps {
  /** 슬롯 ID: topNotice, afterResult, guideInline, guideBottom, desktopSidebar */
  slot: "topNotice" | "afterResult" | "guideInline" | "guideBottom" | "desktopSidebar";
  className?: string;
}

const SLOT_CONFIG: Record<AdSlotProps["slot"], { minHeight: number; hideOnMobile?: boolean }> = {
  topNotice: { minHeight: 90, hideOnMobile: true },
  afterResult: { minHeight: 250 },
  guideInline: { minHeight: 90 },
  guideBottom: { minHeight: 250 },
  desktopSidebar: { minHeight: 600, hideOnMobile: true },
};

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const config = SLOT_CONFIG[slot];
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === "true";
  const showPlaceholders = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true";

  if (!showAds && !showPlaceholders) {
    return null;
  }

  if (showPlaceholders) {
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
        광고 자리 ({slot})
      </div>
    );
  }

  return (
    <div
      className={`
        ${config.hideOnMobile ? "hidden lg:block" : "block"}
        ${className}
      `}
      style={{ minHeight: config.minHeight }}
      data-ad-slot={slot}
    />
  );
}
