import PageHeader from '../components/PageHeader';

function Dashboard({ language = 'english' }) {
  const ar = language === 'arabic';
  const knowledgeAreas = [
    {
      title: ar ? 'الخدمات والعلاجات' : 'Services & Treatments',
      description: ar ? 'تصفح معلومات العلاجات وتفاصيلها.' : 'Explore treatment information and service details.',
      icon: '✦',
      tone: 'purple',
      href: '#/services',
    },
    {
      title: ar ? 'العروض' : 'Offers',
      description: ar ? 'تحقق من العروض المتاحة للعملاء.' : 'Check the offers available to customers.',
      icon: '◇',
      tone: 'orange',
      href: '#/offers',
    },
    {
      title: ar ? 'الأسعار' : 'Prices',
      description: ar ? 'اعثر على معلومات الأسعار بسرعة.' : 'Find accurate pricing information quickly.',
      icon: '▤',
      tone: 'blue',
      href: '#/prices',
    },
    {
      title: ar ? 'إجابات سريعة' : 'Quick Replies',
      description: ar ? 'انسخ إجابات جاهزة لاستفسارات المرضى الشائعة.' : 'Copy ready-to-use answers to common patient questions.',
      icon: '“',
      tone: 'green',
      href: '#/quick-replies',
    },
    {
      title: ar ? 'الصور والفيديوهات' : 'Photos & Videos',
      description: ar ? 'الوسائط متاحة داخل كل خدمة وعلاج.' : 'Media is available inside each service & treatment.',
      icon: '▧',
      tone: 'rose',
    },
  ];

  const popularResources = [
    {
      title: ar ? 'أدلة العلاجات' : 'Treatment guides',
      description: ar ? 'التفاصيل والأسئلة الشائعة' : 'Details and common patient questions',
      href: '#/services',
      icon: '✦',
    },
    {
      title: ar ? 'العروض الحالية' : 'Current offers',
      description: ar ? 'راجع العروض المتاحة' : 'Review available customer offers',
      href: '#/offers',
      icon: '◇',
    },
    {
      title: ar ? 'قائمة الأسعار' : 'Price list',
      description: ar ? 'تحقق من الأسعار ومدد الجلسات' : 'Check prices and session durations',
      href: '#/prices',
      icon: '▤',
    },
    {
      title: ar ? 'دليل المكالمة' : 'Call Flow',
      description: ar ? 'دليل خطوة بخطوة لإرشاد الوكلاء أثناء المكالمات.' : 'Step-by-step call guidance for agents.',
      href: '#/call-flow',
      icon: '☎',
    },
  ];

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow={ar ? 'مساحة عمل الموظف' : 'Agent workspace'}
        title={ar ? 'مركز معرفة الموظفين' : 'Agent Knowledge Hub'}
        description={ar ? 'كل ما تحتاجه للإجابة عن أسئلة المرضى بسرعة وثقة.' : 'Everything you need to answer patients quickly and confidently.'}
        language={language}
      />

      <section className="dashboard-section" aria-labelledby="knowledge-areas-title">
        <div className="dashboard-section-heading">
          <div>
            <span className="eyebrow">{ar ? 'اعثر على ما تحتاجه' : 'Find what you need'}</span>
            <h2 id="knowledge-areas-title">{ar ? 'استكشف قاعدة المعرفة' : 'Explore the knowledge hub'}</h2>
          </div>
          <p>{ar ? 'معلومات موثوقة، جاهزة لمحادثتك التالية.' : 'Trusted information, ready for your next conversation.'}</p>
        </div>

        <div className="dashboard-card-grid">
          {knowledgeAreas.map((area) => {
            const CardElement = area.href ? 'a' : 'article';
            return (
              <CardElement
                className={`dashboard-card${area.href ? '' : ' dashboard-card-unavailable'}`}
                href={area.href}
                key={area.title}
              >
                <span className={`dashboard-card-icon ${area.tone}`} aria-hidden="true">{area.icon}</span>
                <strong>{area.title}</strong>
                <span className="dashboard-card-description">{area.description}</span>
                {area.href && (
                  <span className="dashboard-card-action">
                    {ar ? 'فتح القسم' : 'Open section'}
                    <span aria-hidden="true">{ar ? '←' : '→'}</span>
                  </span>
                )}
              </CardElement>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section dashboard-popular" aria-labelledby="popular-resources-title">
        <div className="dashboard-section-heading">
          <div>
            <span className="eyebrow">{ar ? 'وصول سريع' : 'Quick access'}</span>
            <h2 id="popular-resources-title">{ar ? 'موارد شائعة' : 'Popular resources'}</h2>
          </div>
        </div>
        <div className="popular-resource-list">
          {popularResources.map((resource) => (
            <a className="popular-resource" href={resource.href} key={resource.title}>
              <span className="popular-resource-icon" aria-hidden="true">{resource.icon}</span>
              <span className="popular-resource-copy">
                <strong>{resource.title}</strong>
                <span>{resource.description}</span>
              </span>
              <span className="popular-resource-arrow" aria-hidden="true">{ar ? '←' : '→'}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
