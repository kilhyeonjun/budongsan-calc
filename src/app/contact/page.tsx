import { FEEDBACK_FORM_URL } from "@/lib/siteLinks";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-sm prose-gray dark:prose-invert">
      <h1>문의</h1>
      <p>
        <strong>부동산계산기</strong>에 대한 오류 제보, 기능 제안, 개인정보 문의는
        아래 피드백 창구를 통해 남겨주세요.
      </p>

      <h2>문의 가능한 내용</h2>
      <ul>
        <li>계산 결과 오류 또는 정책 변경 반영 요청</li>
        <li>부동산·대출·세금 계산기 기능 제안</li>
        <li>가이드 문서의 오탈자 또는 최신 정보 제보</li>
        <li>개인정보처리방침 관련 문의</li>
      </ul>

      <h2>피드백/오류 제보</h2>
      <p>
        <a href={FEEDBACK_FORM_URL} target="_blank" rel="noopener noreferrer">
          Google Form으로 문의 남기기
        </a>
      </p>

      <h2>주의사항</h2>
      <p>
        문의 또는 오류 제보 시 주민등록번호, 계좌번호, 정확한 주소, 비밀번호,
        대출 계좌 정보 등 민감정보를 입력하지 말아주세요.
      </p>
      <p>
        본 사이트는 금융상품 추천, 대출 중개, 세무·법률 자문을 제공하지 않습니다.
        중요한 의사결정 전에는 은행, 세무사, 법무사 등 전문가에게 확인하시기 바랍니다.
      </p>

      <p className="text-xs text-gray-400 mt-8">최종 수정: 2026년 7월</p>
    </div>
  );
}
