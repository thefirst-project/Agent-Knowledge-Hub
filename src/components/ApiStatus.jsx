function ApiStatus({ loading, error, language = 'english' }) {
  if (loading) {
    return <div className="no-results" role="status">{language === 'arabic' ? 'جارٍ التحميل...' : 'Loading...'}</div>;
  }

  if (error) {
    return (
      <div className="no-results" role="alert">
        {language === 'arabic'
          ? 'تعذر تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.'
          : `Unable to load data. ${error}`}
      </div>
    );
  }

  return null;
}

export default ApiStatus;
