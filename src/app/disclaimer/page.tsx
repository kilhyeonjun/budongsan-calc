export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-sm prose-gray">
      <h1>면책조항</h1>
      <p>본 사이트에서 제공하는 모든 계산 결과는 <strong>참고용 추정치</strong>이며, 법적 효력이 없습니다.</p>

      <h2>계산 결과의 한계</h2>
      <ul>
        <li>취득세, 양도소득세 등 세율은 정책 변동에 따라 수시로 변경될 수 있습니다.</li>
        <li>DSR, LTV 규제는 지역, 주택 수, 대출 유형에 따라 달라집니다.</li>
        <li>중개수수료는 상한요율 기준이며, 실제 수수료는 중개사와 협의합니다.</li>
        <li>대출 가능 여부와 실제 금리는 개인 신용, 소득 증빙, 은행 심사에 따라 다릅니다.</li>
      </ul>

      <h2>권장사항</h2>
      <p>
        본 사이트의 결과를 기반으로 중요한 재정 의사결정을 내리기 전에,
        반드시 <strong>세무사, 법무사, 은행 대출 상담사</strong> 등 전문가에게 확인하시기 바랍니다.
      </p>

      <h2>면책</h2>
      <p>
        본 사이트의 계산 결과로 인해 발생한 직접적·간접적 손해에 대해
        사이트 운영자는 어떠한 책임도 지지 않습니다.
      </p>

      <p className="text-xs text-gray-400 mt-8">최종 수정: 2026년 7월</p>
    </div>
  );
}
