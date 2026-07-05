import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-blue-600">🏠 부동산계산기</p>
            <p className="mt-2 text-sm text-gray-500">
              매도·매수·대출·세금을 한 번에 계산하세요.
              <br />
              모든 결과는 참고용이며 전문가 상담을 권장합니다.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <p className="font-semibold text-gray-900 text-sm">계산기</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/calculators/home-upgrade" className="text-sm text-gray-600 hover:text-blue-600">갈아타기 계산기</Link></li>
              <li><Link href="/calculators/mortgage" className="text-sm text-gray-600 hover:text-blue-600">주택담보대출 계산기</Link></li>
              <li><Link href="/calculators/dsr" className="text-sm text-gray-600 hover:text-blue-600">DSR 계산기</Link></li>
              <li><Link href="/calculators/ltv" className="text-sm text-gray-600 hover:text-blue-600">LTV 계산기</Link></li>
              <li><Link href="/calculators/acquisition-tax" className="text-sm text-gray-600 hover:text-blue-600">취득세 계산기</Link></li>
              <li><Link href="/calculators/brokerage-fee" className="text-sm text-gray-600 hover:text-blue-600">중개수수료 계산기</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="font-semibold text-gray-900 text-sm">안내</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">사이트 소개</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-gray-600 hover:text-blue-600">면책조항</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} 부동산계산기. 모든 계산 결과는 참고용이며 법적 효력이 없습니다.
        </div>
      </div>
    </footer>
  );
}
