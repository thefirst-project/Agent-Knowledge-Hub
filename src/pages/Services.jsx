import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';
import { normalizeService } from '../api/normalize';
import ApiStatus from '../components/ApiStatus';
import PageHeader from '../components/PageHeader';
import ServiceCard from '../components/ServiceCard';
import ServiceDetails from '../components/ServiceDetails';
import ServiceSearch from '../components/ServiceSearch';
import { useBranchContext } from '../context/BranchContext';

const searchableText = (service, language) => {
  const english = [
    service.name,
    service.shortDescription,
    service.description,
    ...service.commonQuestions.flatMap((item) => [item.questionEn, item.answerEn]),
  ];
  const arabic = [
    service.nameAr,
    ...service.commonQuestions.flatMap((item) => [item.questionAr, item.answerAr]),
  ];

  if (language === 'english') return english.join(' ').toLocaleLowerCase();
  if (language === 'arabic') return arabic.join(' ').toLocaleLowerCase();
  return [...english, ...arabic].join(' ').toLocaleLowerCase();
};

function Services({ language = 'english' }) {
  const ar = language === 'arabic';
  const { selectedBranchId, loading: branchesLoading, error: branchError } = useBranchContext();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [query, setQuery] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('all');

  useEffect(() => {
    if (!selectedBranchId) {
      setServices([]);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch(`/api/services?branch_id=${encodeURIComponent(selectedBranchId)}`, { signal: controller.signal })
      .then((data) => setServices(data.map(normalizeService)))
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [selectedBranchId]);

  useEffect(() => {
    const selectServiceFromHash = () => {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const serviceId = params.get('service');
      setSelectedService(services.find((service) => String(service.id) === serviceId) || null);
      if (params.has('question')) {
        window.setTimeout(
          () => document.getElementById(`question-${params.get('question')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          0,
        );
      }
    };
    selectServiceFromHash();
    window.addEventListener('hashchange', selectServiceFromHash);
    return () => window.removeEventListener('hashchange', selectServiceFromHash);
  }, [services]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredServices = useMemo(() => services.filter((service) => (
    !normalizedQuery || searchableText(service, searchLanguage).includes(normalizedQuery)
  )), [services, normalizedQuery, searchLanguage]);

  if (selectedService) {
    return (
      <ServiceDetails
        service={selectedService}
        language={language}
        onBack={() => {
          window.location.hash = '#/services';
          setSelectedService(null);
        }}
      />
    );
  }

  const isLoading = branchesLoading || loading;
  const loadError = branchError || error;

  return (
    <>
      <PageHeader
        title={ar ? 'الخدمات' : 'Services'}
        description={ar
          ? 'اعثر بسرعة على معلومات العلاج والإجابات الجاهزة لكل محادثة مع العميل.'
          : 'Quickly find treatment knowledge and ready-to-use answers for every customer conversation.'}
        language={language}
      />
      <ApiStatus loading={isLoading} error={loadError} language={language} />
      {!(isLoading || loadError) && (
        <>
          <ServiceSearch
            query={query}
            language={searchLanguage}
            uiLanguage={language}
            onQueryChange={setQuery}
            onLanguageChange={setSearchLanguage}
            onClear={() => setQuery('')}
          />
          <div className="content-toolbar">
            <span className="result-count">
              {filteredServices.length} {ar ? 'من' : 'of'} {services.length} {ar ? 'خدمات' : 'services'}
            </span>
            <a className="text-button" href="#/offers">
              {ar ? 'عرض العروض الحالية' : 'View current offers'} <span aria-hidden="true">→</span>
            </a>
          </div>
          {filteredServices.length > 0 ? (
            <div className="knowledge-services-grid">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  language={language}
                  onSelect={(item) => {
                    window.location.hash = `#/services?service=${item.id}`;
                    setSelectedService(item);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="no-results" role="status">
              <span className="no-results-icon">⌕</span>
              <h2>{ar ? 'لم يتم العثور على خدمات أو أسئلة مطابقة.' : 'No matching services or questions found.'}</h2>
              <p>{ar ? 'جرّب اسماً أو لغة أو سؤالاً آخر.' : 'Try another service name, language, or patient question.'}</p>
              <button
                className="clear-results-button"
                type="button"
                onClick={() => { setQuery(''); setSearchLanguage('all'); }}
              >
                {ar ? 'مسح عوامل التصفية' : 'Clear filters'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Services;
