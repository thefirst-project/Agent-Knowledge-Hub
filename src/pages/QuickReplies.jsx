import { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { normalizeQuickReply } from '../api/normalize';
import ApiStatus from '../components/ApiStatus';
import CopyButton from '../components/CopyButton';
import PageHeader from '../components/PageHeader';
import { useBranchContext } from '../context/BranchContext';

function QuickReplies({ language = 'english' }) {
  const ar = language === 'arabic';
  const { selectedBranchId, loading: branchesLoading, error: branchError } = useBranchContext();
  const [quickReplies, setQuickReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (!selectedBranchId) {
      setQuickReplies([]);
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(`/api/quick-replies?branch_id=${encodeURIComponent(selectedBranchId)}`, { signal: controller.signal })
      .then((data) => setQuickReplies(data.map(normalizeQuickReply)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [selectedBranchId]);

  const categories = ['All', ...new Set(quickReplies.map((reply) => reply.category).filter(Boolean))];
  const visibleReplies = activeCategory === 'All'
    ? quickReplies
    : quickReplies.filter((reply) => reply.category === activeCategory);
  const categoryLabels = {
    All: ar ? 'الكل' : 'All replies',
    Booking: ar ? 'الحجوزات' : 'Booking',
    Pricing: ar ? 'الأسعار' : 'Pricing',
    Complaints: ar ? 'الشكاوى' : 'Complaints',
    Promotions: ar ? 'العروض' : 'Promotions',
  };
  const isLoading = branchesLoading || loading;
  const loadError = branchError || error;

  return (
    <div className="quick-replies-page" dir={ar ? 'rtl' : 'ltr'}>
      <PageHeader
        eyebrow={ar ? 'إجابات جاهزة للموظف' : 'Agent-ready messages'}
        title={ar ? 'إجابات سريعة' : 'Quick Replies'}
        description={ar ? 'اختر رسالة جاهزة وانسخها لمساعدتك في الرد على استفسارات المرضى.' : 'Choose a ready-to-use message and copy it to help answer patient enquiries.'}
        language={language}
      />

      <section aria-label={ar ? 'تصفية الإجابات حسب الفئة' : 'Filter replies by category'}>
        <ApiStatus loading={isLoading} error={loadError} language={language} />
        {!(isLoading || loadError) && <>
        <div className="quick-reply-category-tabs" role="group" aria-label={ar ? 'فئات الإجابات' : 'Reply categories'}>
          {categories.map((category) => (
            <button
              aria-pressed={activeCategory === category}
              className={`quick-reply-category-tab${activeCategory === category ? ' active' : ''}`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        <div className="quick-reply-grid">
          {visibleReplies.map((reply) => (
            <article className="quick-reply-card" key={reply.id}>
              <span className="quick-reply-card-category">{categoryLabels[reply.category]}</span>
              <h2>{reply.title}</h2>
              <p className="quick-reply-body" dir={ar ? 'rtl' : 'ltr'}>{ar ? reply.body_ar : reply.body_en}</p>
              <div className="quick-reply-copy">
                <CopyButton
                  label={ar ? 'نسخ الرد' : 'Copy reply'}
                  text={ar ? reply.body_ar : reply.body_en}
                />
              </div>
            </article>
          ))}
        </div>
        </>}
      </section>
    </div>
  );
}

export default QuickReplies;
