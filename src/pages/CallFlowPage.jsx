import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import ApiStatus from '../components/ApiStatus';
import CallFlowStepper from '../components/CallFlowStepper';
import PageHeader from '../components/PageHeader';
import { useBranchContext } from '../context/BranchContext';

function CallFlowPage({ language = 'english' }) {
  const ar = language === 'arabic';
  const { selectedBranchId, loading: branchesLoading, error: branchError } = useBranchContext();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedBranchId) {
      setSteps([]);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(
      `/api/call-flows?branch_id=${encodeURIComponent(selectedBranchId)}&service_id=null`,
      { signal: controller.signal },
    )
      .then((data) => {
        const branchSteps = data.filter((step) => step.branch_id === Number(selectedBranchId));
        const defaultSteps = data.filter((step) => step.branch_id == null);
        setSteps((branchSteps.length > 0 ? branchSteps : defaultSteps)
          .sort((a, b) => a.step_order - b.step_order)
          .map((step) => ({ ...step, order: step.step_order })));
      })
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedBranchId]);

  const isLoading = branchesLoading || loading;
  const loadError = branchError || error;
  const generalCallFlow = { id: 'general', title_en: 'General Call Guidance', title_ar: 'دليل المكالمة العام', steps };

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
      <ApiStatus loading={isLoading} error={loadError} language={language} />
      {!(isLoading || loadError) && <CallFlowStepper callFlow={generalCallFlow} language={language} />}
    </div>
  );
}

export default CallFlowPage;
