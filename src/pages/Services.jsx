import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import ServiceCard from '../components/ServiceCard';
import ServiceSearch from '../components/ServiceSearch';
import ServiceDetails from '../components/ServiceDetails';
import { services } from '../data/services';

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
  const [selectedService, setSelectedService] = useState(null);
  const [query, setQuery] = useState('');
  const [searchLanguage, setSearchLanguage] = useState('all');

  useEffect(() => {
    const selectServiceFromHash = () => {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const serviceId = params.get('service');
      setSelectedService(services.find((service) => service.id === serviceId) || null);
      if (params.has('question')) {
        window.setTimeout(() => document.getElementById(`question-${params.get('question')}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
      }
    };
    selectServiceFromHash();
    window.addEventListener('hashchange', selectServiceFromHash);
    return () => window.removeEventListener('hashchange', selectServiceFromHash);
  }, []);

  if (selectedService) {
    return <ServiceDetails service={selectedService} language={language} onBack={() => { window.location.hash = '#/services'; setSelectedService(null); }} />;
  }

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredServices = services.filter((service) => (
    !normalizedQuery || searchableText(service, searchLanguage).includes(normalizedQuery)
  ));

  return (
    <>
      <PageHeader title={ar ? 'الخدمات' : 'Services'} description={ar ? 'اعثر بسرعة على معلومات العلاج والإجابات الجاهزة لكل محادثة مع العميل.' : 'Quickly find treatment knowledge and ready-to-use answers for every customer conversation.'} language={language} />
      <ServiceSearch
        query={query}
        language={searchLanguage}
        uiLanguage={language}
        onQueryChange={setQuery}
        onLanguageChange={setSearchLanguage}
        onClear={() => setQuery('')}
      />
      <div className="content-toolbar"><span className="result-count">{filteredServices.length} {ar ? 'من' : 'of'} {services.length} {ar ? 'خدمات' : 'services'}</span><a className="text-button" href="#/offers">{ar ? 'عرض العروض الحالية' : 'View current offers'} <span aria-hidden="true">→</span></a></div>
      {filteredServices.length > 0 ? (
        <div className="knowledge-services-grid">{filteredServices.map((service) => <ServiceCard key={service.id} service={service} language={language} onSelect={setSelectedService} />)}</div>
      ) : (
        <div className="no-results" role="status">
          <span className="no-results-icon">⌕</span>
          <h2>No matching services or questions found.</h2>
          <p>Try another service name, language, or patient question.</p>
          <button className="clear-results-button" type="button" onClick={() => { setQuery(''); setLanguage('all'); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}

export default Services;
