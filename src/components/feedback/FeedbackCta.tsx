import { FEEDBACK_FORM_URL } from "@/lib/siteLinks";

interface FeedbackCtaProps {
  compact?: boolean;
}

export function FeedbackCta({ compact = false }: FeedbackCtaProps) {
  return (
    <aside className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">계산 결과가 이상하거나 필요한 기능이 있나요?</p>
      {!compact && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          오류 제보와 기능 제안을 보내주세요. 정확한 주소, 계좌번호, 주민번호 등 민감정보는 입력하지 마세요.
        </p>
      )}
      <a
        href={FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
      >
        피드백 보내기 →
      </a>
    </aside>
  );
}
