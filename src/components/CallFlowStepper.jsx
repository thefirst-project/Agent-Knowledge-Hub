import { useEffect, useState } from 'react';

function CallFlowStepper({ callFlow, language = 'english' }) {
  const ar = language === 'arabic';
  const steps = callFlow?.steps || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [callFlow]);

  if (steps.length === 0) {
    return (
      <div className="call-flow-empty">
        {ar
          ? 'لم يتم إعداد دليل مكالمة لهذه الخدمة بعد.'
          : 'No call flow has been set up for this service yet.'}
      </div>
    );
  }

  const activeStep = steps[activeIndex] || steps[0];
  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="call-flow-stepper" dir={ar ? 'rtl' : 'ltr'}>
      <nav aria-label={ar ? 'خطوات دليل المكالمة' : 'Call flow steps'} className="call-flow-progress">
        {steps.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <div
              className={`call-flow-progress-item${isComplete ? ' complete' : ''}${isActive ? ' active' : ''}`}
              key={step.id}
            >
              <button
                aria-current={isActive ? 'step' : undefined}
                aria-label={`${index + 1}. ${ar ? step.label_ar : step.label_en}`}
                className="call-flow-progress-button"
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className="call-flow-progress-bubble" aria-hidden="true">
                  {isComplete ? '✓' : index + 1}
                </span>
                <span className="call-flow-progress-label">{ar ? step.label_ar : step.label_en}</span>
              </button>
            </div>
          );
        })}
      </nav>

      <section aria-live="polite" className="call-flow-step-card">
        <div className="call-flow-step-heading">
          <span className="call-flow-step-badge">
            {ar
              ? `الخطوة ${activeIndex + 1} من ${steps.length}`
              : `Step ${activeIndex + 1} of ${steps.length}`}
          </span>
          <h3>{ar ? activeStep.label_ar : activeStep.label_en}</h3>
        </div>

        <div className="call-flow-content-columns" dir="ltr">
          <div className="call-flow-language-block">
            <span className="call-flow-language-label">English</span>
            <p>{activeStep.content_en}</p>
          </div>
          <div className="call-flow-language-block" dir="rtl">
            <span className="call-flow-language-label">العربية</span>
            <p>{activeStep.content_ar}</p>
          </div>
        </div>

        {(activeStep.tip_en || activeStep.tip_ar) && (
          <aside className="call-flow-tip">
            <strong>{ar ? 'نصيحة للموظف' : 'Coaching tip'}</strong>
            {activeStep.tip_en && <p>{activeStep.tip_en}</p>}
            {activeStep.tip_ar && <p dir="rtl">{activeStep.tip_ar}</p>}
          </aside>
        )}

        <div className="call-flow-navigation">
          <button
            className="call-flow-nav-button secondary"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((index) => Math.max(0, index - 1))}
            type="button"
          >
            {ar ? 'السابق' : 'Previous'}
          </button>
          <button
            className="call-flow-nav-button primary"
            onClick={() => setActiveIndex(isLastStep ? 0 : activeIndex + 1)}
            type="button"
          >
            {isLastStep ? (ar ? 'إنهاء المكالمة' : 'End Call') : (ar ? 'التالي' : 'Next')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default CallFlowStepper;
