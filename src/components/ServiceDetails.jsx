import QuestionCard from './QuestionCard';
import MediaGrid from './MediaGrid';
import CallFlowStepper from './CallFlowStepper';

function ServiceDetails({ service, language = 'english', onBack }) {
  const ar = language === 'arabic';
  return (
    <div className="service-details">
      <button className="back-button" type="button" onClick={onBack}>← <span>{ar ? 'العودة إلى الخدمات' : 'Back to Services'}</span></button>
      <div className="service-detail-hero" dir={ar ? 'rtl' : 'ltr'}>
        <div><span className="eyebrow">{ar ? 'معرفة الخدمات' : 'Service knowledge'}</span><h1>{ar ? service.nameAr : service.name}</h1><h2 dir="ltr">{ar ? service.name : service.nameAr}</h2><p>{ar ? service.shortDescriptionAr : service.shortDescription}</p></div>
        <span className="detail-mark">✦</span>
      </div>
      <div className="detail-overview">
        <section className="detail-section detail-wide"><h2>{ar ? 'ما هو العلاج؟' : 'What is the treatment?'}</h2><p>{ar ? service.descriptionAr : service.description}</p></section>
        <section className="detail-section"><h2>{ar ? 'الفوائد' : 'Benefits'}</h2><ul>{(ar ? service.benefitsAr : service.benefits).map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="detail-section"><h2>{ar ? 'مناسب لـ' : 'Suitable for'}</h2><p>{ar ? service.suitableForAr : service.suitableFor}</p></section>
        <section className="detail-section"><h2>{ar ? 'مناطق العلاج' : 'Treatment areas'}</h2><div className="tag-list">{(ar ? service.treatmentAreasAr : service.treatmentAreas).map((area) => <span key={area}>{area}</span>)}</div></section>
        <section className="detail-section"><h2>{ar ? 'ملاحظات مهمة' : 'Important notes'}</h2><ul>{(ar ? service.importantNotesAr : service.importantNotes).map((note) => <li key={note}>{note}</li>)}</ul></section>
      </div>
      <section className="service-call-flow-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{ar ? 'إرشاد المكالمة' : 'Agent guidance'}</span>
            <h2>{ar ? 'دليل المكالمة' : 'Call Flow'}</h2>
          </div>
        </div>
        <CallFlowStepper callFlow={service.callFlow} language={language} />
      </section>
      <section className="questions-section"><div className="section-heading"><div><span className="eyebrow">{ar ? 'إجابات جاهزة للموظف' : 'Agent-ready answers'}</span><h2>{ar ? 'أسئلة المرضى الشائعة' : 'Common patient questions'}</h2></div><span>{service.commonQuestions.length} {ar ? 'أسئلة' : 'questions'}</span></div><div className="questions-list">{service.commonQuestions.map((item, index) => <QuestionCard key={item.questionEn} question={item} questionIndex={index} language={language} />)}</div></section>
      {service.media.length > 0 && (
        <section className="service-media-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{ar ? 'مكتبة الموظف' : 'Agent library'}</span>
              <h2>{ar ? 'الصور والفيديوهات' : 'Photos & Videos'}</h2>
            </div>
            <span>{service.media.length} {ar ? 'صور' : 'images'}</span>
          </div>
          <MediaGrid items={service.media} language={language} />
        </section>
      )}
    </div>
  );
}

export default ServiceDetails;
