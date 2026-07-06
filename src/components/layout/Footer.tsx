import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-blue-600">🏠 부동산계산기</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
              매도·매수·대출·세금을 한 번에 계산하세요.
              <br />
              모든 결과는 참고용이며 전문가 상담을 권장합니다.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">계산기</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/calculators/home-upgrade" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">갈아타기 계산기</Link></li>
              <li><Link href="/calculators/mortgage" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">주택담보대출 계산기</Link></li>
              <li><Link href="/calculators/dsr" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">DSR 계산기</Link></li>
              <li><Link href="/calculators/ltv" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">LTV 계산기</Link></li>
              <li><Link href="/calculators/acquisition-tax" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">취득세 계산기</Link></li>
              <li><Link href="/calculators/brokerage-fee" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">중개수수료 계산기</Link></li>
              <li><Link href="/guides" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">부동산 가이드</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">안내</p>
            <ul className="mt-2 space-y-1">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">사이트 소개</Link></li>
              <li><Link href="/disclaimer" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">면책조항</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-200">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-4 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
          © {new Date().getFullYear()} 부동산계산기. 모든 계산 결과는 참고용이며 법적 효력이 없습니다.
        </div>
      </div>
    </footer>
  );
}
