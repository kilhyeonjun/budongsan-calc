import { FeedbackCta } from "@/components/feedback/FeedbackCta";
import { calculatorGuides, type CalculatorGuideId } from "@/lib/guideContent";

interface CalculatorSeoGuideProps {
  id: CalculatorGuideId;
}

export function CalculatorSeoGuide({ id }: CalculatorSeoGuideProps) {
  const guide = calculatorGuides[id];

  return (
    <section className="content-card p-5 md:p-6 space-y-5">
      <div>
        <p className="eyebrow">계산 가이드</p>
        <h2 className="section-title mt-1">{guide.title}</h2>
        <p className="body-copy mt-2">{guide.summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guide.blocks.map((block) => (
          <article key={block.title} className="rounded-2xl border border-gray-200/80 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-900/70">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">{block.title}</h3>
            <p className="body-copy mt-2 text-sm">{block.body}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
              {block.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
        <h3 className="font-semibold text-gray-900 dark:text-gray-50">자주 묻는 질문</h3>
        <div className="mt-3 space-y-3">
          {guide.faq.map((item) => (
            <div key={item.question}>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Q. {item.question}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <FeedbackCta />
    </section>
  );
}
