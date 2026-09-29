import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { normalizeService } from '../api/normalize';
import { useBranchContext } from '../context/BranchContext';
import ApiStatus from './ApiStatus';
import QuestionCard from './QuestionCard';
import MediaGrid from './MediaGrid';
import CallFlowStepper from './CallFlowStepper';

function ServiceDetails({ service, language = 'english', onBack }) {
  const ar = language === 'arabic';
  const { selectedBranchId } = useBranchContext();
  const [serviceDetails, setServiceDetails] = useState(service);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(
      `/api/services/${encodeURIComponent(service.id)}?branch_id=${encodeURIComponent(selectedBranchId)}`,
      { signal: controller.signal },
    )
      .then((data) => setServiceDetails(normalizeService(data)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [service.id, selectedBranchId]);

  if (loading || error) {
    return (
      <>
        <button className="back-button" type="button" onClick={onBack}>
          ← <span>{ar ? 'العودة إلى الخدمات' : 'Back to Services'}</span>
        </button>
        <ApiStatus loading={loading} error={error} language={language} />
      </>
    );
  }

  const currentService = serviceDetails;
  return (
    <div className="service-details">
      <button className="back-button" type="button" onClick={onBack}>← <span>{ar ? 'العودة إلى الخدمات' : 'Back to Services'}</span></button>
      <div className="service-detail-hero" dir={ar ? 'rtl' : 'ltr'}>
        <div><span className="eyebrow">{ar ? 'معرفة الخدمات' : 'Service knowledge'}</span><h1>{ar ? currentService.nameAr : currentService.name}</h1><h2 dir="ltr">{ar ? currentService.name : currentService.nameAr}</h2><p>{ar ? currentService.shortDescriptionAr : currentService.shortDescription}</p></div>
        <span className="detail-mark">✦</span>
      </div>
      <div className="detail-overview">
        <section className="detail-section detail-wide"><h2>{ar ? 'ما هو العلاج؟' : 'What is the treatment?'}</h2><p>{ar ? currentService.descriptionAr : currentService.description}</p></section>
        <section className="detail-section"><h2>{ar ? 'الفوائد' : 'Benefits'}</h2><ul>{(ar ? currentService.benefitsAr : currentService.benefits).map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="detail-section"><h2>{ar ? 'مناسب لـ' : 'Suitable for'}</h2><p>{ar ? currentService.suitableForAr : currentService.suitableFor}</p></section>
        <section className="detail-section"><h2>{ar ? 'مناطق العلاج' : 'Treatment areas'}</h2><div className="tag-list">{(ar ? currentService.treatmentAreasAr : currentService.treatmentAreas).map((area) => <span key={area}>{area}</span>)}</div></section>
        <section className="detail-section"><h2>{ar ? 'ملاحظات مهمة' : 'Important notes'}</h2><ul>{(ar ? currentService.importantNotesAr : currentService.importantNotes).map((note) => <li key={note}>{note}</li>)}</ul></section>
      </div>
      <section className="service-call-flow-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ar ? 'إرشاد المكالمة' : 'Agent guidance'}</span>
            <h2>{ar ? 'دليل المكالمة' : 'Call Flow'}</h2>
          </div>
        </div>
        <CallFlowStepper callFlow={currentService.callFlow} language={language} />
      </section>
      <section className="questions-section"><div className="section-heading"><div><span className="eyebrow">{ar ? 'إجابات جاهزة للموظف' : 'Agent-ready answers'}</span><h2>{ar ? 'أسئلة المرضى الشائعة' : 'Common patient questions'}</h2></div><span>{currentService.commonQuestions.length} {ar ? 'أسئلة' : 'questions'}</span></div><div className="questions-list">{currentService.commonQuestions.map((item, index) => <QuestionCard key={item.questionEn} question={item} questionIndex={index} language={language} />)}</div></section>
      {currentService.media.length > 0 && (
        <section className="service-media-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{ar ? 'مكتبة الموظف' : 'Agent library'}</span>
              <h2>{ar ? 'الصور والفيديوهات' : 'Photos & Videos'}</h2>
            </div>
            <span>{currentService.media.length} {ar ? 'صور' : 'images'}</span>
          </div>
          <MediaGrid items={currentService.media} language={language} />
        </section>
      )}
    </div>
  );
}

export default ServiceDetails;
