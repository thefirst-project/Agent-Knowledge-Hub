import CallFlowStepper from '../components/CallFlowStepper';
import PageHeader from '../components/PageHeader';
import { generalCallFlow } from '../data/callFlows';

function CallFlowPage({ language = 'english' }) {
  const ar = language === 'arabic';

  return (
    <div className="call-flow-page">
      <PageHeader
        eyebrow={ar ? 'دليل الموظف' : 'Agent guidance'}
        title={ar ? 'دليل المكالمة العام' : 'General Call Guidance'}
        description={ar
          ? 'دليل مكالمة عام للاستفسارات غير المحددة.'
          : 'A universal call flow for general and unspecified inquiries.'}
        language={language}
      />
      <CallFlowStepper callFlow={generalCallFlow} language={language} />
    </div>
  );
}

export default CallFlowPage;
