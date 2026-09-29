import { useEffect, useState } from 'react';

function MediaGrid({ items, language = 'english' }) {
  const ar = language === 'arabic';
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  async function downloadImage(item) {
    setDownloadingId(item.id);
    setDownloadError(null);
    try {
      const response = await fetch(item.download_url);
      if (!response.ok) {
        throw new Error(`Image request failed (${response.status}).`);
      }

      const image = await response.blob();
      if (!image.size || !image.type.startsWith('image/')) {
        throw new Error('The download URL did not return a valid image.');
      }

      const extension = image.type.split('/')[1].split('+')[0].replace('jpeg', 'jpg');
      const objectUrl = URL.createObjectURL(image);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `image-${item.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch (error) {
      console.error('Unable to download image:', error);
      setDownloadError({ id: item.id });
    } finally {
      setDownloadingId(null);
    }
  }

  useEffect(() => {
    if (!selectedMedia) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedMedia(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [selectedMedia]);

  return (
    <>
      <div className="media-grid">
        {items.map((item) => (
          <article className="media-card" key={item.id}>
            {item.type === 'video' ? (
              <a
                aria-label={ar ? `مشاهدة ${item.title_ar} على YouTube` : `Watch ${item.title_en} on YouTube`}
                className="media-thumbnail-link"
                href={item.external_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  alt={ar ? item.title_ar : item.title_en}
                  className="media-thumbnail"
                  loading="lazy"
                  src={item.thumbnail_url}
                />
                <span className="media-play-icon" aria-hidden="true">▶</span>
              </a>
            ) : (
              <button
                aria-label={ar ? `عرض ${item.title_ar}` : `View ${item.title_en}`}
                className="media-thumbnail-button"
                onClick={() => setSelectedMedia(item)}
                type="button"
              >
              <img
                alt={ar ? item.title_ar : item.title_en}
                className="media-thumbnail"
                loading="lazy"
                src={item.thumbnail_url}
              />
              </button>
            )}
            <div className="media-card-content">
              <span className="media-category-badge">{item.type === 'video' ? (ar ? 'فيديو' : 'Video') : (ar ? 'صورة' : 'Image')}</span>
              <h2>{ar ? item.title_ar : item.title_en}</h2>
              <p>{ar ? item.caption_ar : item.caption_en}</p>
              <div className="media-card-actions">
                {item.type === 'video' ? (
                  <a
                    className="media-view-button"
                    href={item.external_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {ar ? 'مشاهدة على YouTube' : 'Watch on YouTube'}
                  </a>
                ) : (
                  <button className="media-view-button" onClick={() => setSelectedMedia(item)} type="button">
                    {ar ? 'عرض' : 'View'}
                  </button>
                )}
                {item.type !== 'video' && item.download_url && (
                  <button
                    className="media-download-button"
                    disabled={downloadingId === item.id}
                    onClick={() => downloadImage(item)}
                    type="button"
                  >
                    {downloadingId === item.id
                      ? (ar ? 'جارٍ التنزيل…' : 'Downloading…')
                      : (ar ? 'تنزيل' : 'Download')}
                  </button>
                )}
              </div>
              {downloadError?.id === item.id && (
                <p className="media-download-error" role="alert">
                  {ar ? 'تعذر تنزيل الصورة. يرجى المحاولة مرة أخرى.' : 'Unable to download this image. Please try again.'}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {selectedMedia && (
        <div className="media-lightbox-backdrop" onClick={() => setSelectedMedia(null)} role="presentation">
          <div
            aria-labelledby="media-lightbox-title"
            aria-modal="true"
            className="media-lightbox"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="media-lightbox-heading">
              <h2 id="media-lightbox-title">{ar ? selectedMedia.title_ar : selectedMedia.title_en}</h2>
              <button
                aria-label={ar ? 'إغلاق الصورة' : 'Close image'}
                className="media-lightbox-close"
                onClick={() => setSelectedMedia(null)}
                type="button"
              >
                ×
              </button>
            </div>
            <img
              alt={ar ? selectedMedia.title_ar : selectedMedia.title_en}
              className="media-lightbox-image"
              src={selectedMedia.full_url}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MediaGrid;
