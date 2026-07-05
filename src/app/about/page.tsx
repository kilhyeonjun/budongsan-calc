export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto prose prose-sm prose-gray">
      <h1>사이트 소개</h1>
      <p>
        <strong>부동산계산기</strong>는 집 갈아타기를 고민하는 분들을 위한 계산기 허브입니다.
      </p>

      <h2>왜 만들었나요?</h2>
      <p>
        기존 부동산 계산기들은 취득세, 대출이자, 중개수수료를 각각 따로 계산해야 합니다.
        실제로 갈아타기를 준비하는 사람에게 필요한 건 &quot;결국 내 통장에서 얼마가 나가고, 매달 얼마를 갚아야 하는가&quot;입니다.
      </p>
      <p>
        이 사이트는 매도·매수·대출·세금·부대비용의 전체 흐름을 한 번에 보여줍니다.
      </p>

      <h2>제공하는 계산기</h2>
      <ul>
        <li><strong>갈아타기 계산기</strong> — 매도→매수 전체 자금 흐름 + 판정</li>
        <li><strong>주택담보대출 계산기</strong> — 원리금균등/원금균등/만기일시</li>
        <li><strong>DSR 계산기</strong> — 총부채원리금상환비율</li>
        <li><strong>LTV 계산기</strong> — 담보인정비율</li>
        <li><strong>취득세 계산기</strong> — 주택 수/면적/지역별</li>
        <li><strong>중개수수료 계산기</strong> — 매매/전세/월세</li>
      </ul>

      <h2>기술</h2>
      <p>Next.js, TypeScript, Tailwind CSS로 만들었습니다. 모든 계산은 브라우저에서 실행되며, 개인정보를 수집하지 않습니다.</p>
    </div>
  );
}
