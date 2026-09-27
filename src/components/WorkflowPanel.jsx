import { getWorkflowByServiceId, workflowBranchPrompt } from '../data/workflows';

function WorkflowPanel({ serviceId, language = 'english' }) {
  const workflow = getWorkflowByServiceId(serviceId);
  const ar = language === 'arabic';
  if (!workflow) return null;
  const steps = [
    { title: 'Opening', titleAr: 'الترحيب', content: workflow.opening, },
    { title: 'Qualification questions', titleAr: 'أسئلة التأهيل', list: workflow.qualificationQuestions },
    { title: 'Key points', titleAr: 'النقاط الأساسية', list: workflow.keyPoints },
    { title: 'Common objection response', titleAr: 'التعامل مع الاعتراض', content: workflow.objection },
    { title: 'Offer guidance', titleAr: 'تقديم العرض', content: workflow.offer },
    { title: 'Center selection', titleAr: 'اختيار المركز', content: { en: workflowBranchPrompt.en, ar: workflowBranchPrompt.ar } },
    { title: 'Booking prompt', titleAr: 'الخطوة التالية', content: { en: 'Would you like me to help you choose a convenient appointment time?', ar: 'هل تفضل أن أساعدك في اختيار موعد مناسب؟' } },
  ];

  return (
    <section className="workflow-panel" dir={ar ? 'rtl' : 'ltr'}>
      <div className="workflow-heading"><div><span className="eyebrow">{ar ? 'دليل المكالمة / Call guidance' : 'Call guidance / دليل المكالمة'}</span><h2>{ar ? 'خطوات محادثة مقترحة / Suggested conversation flow' : 'Suggested conversation flow / خطوات محادثة مقترحة'}</h2></div><span className="workflow-badge">{ar ? 'للاستخدام الداخلي' : 'Agent use'}</span></div>
      <div className="workflow-steps">
        {steps.map((step, index) => (
          <article className="workflow-step" key={step.title}>
            <span className="workflow-number">{index + 1}</span>
            <div className="workflow-step-content">
              <h3>{step.title} <span dir="rtl">{step.titleAr}</span></h3>
              {step.list ? (
                <div className="workflow-bilingual-lists">
                  <ul><span className="workflow-language-label">English</span>{step.list.en.map((item) => <li key={item}>{item}</li>)}</ul>
                  <ul dir="rtl"><span className="workflow-language-label">العربية</span>{step.list.ar.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              ) : (
                <div className="workflow-bilingual-copy">
                  <p>{step.content.en}</p>
                  <p dir="rtl">{step.content.ar}</p>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WorkflowPanel;
