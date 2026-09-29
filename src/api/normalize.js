export function normalizeBranch(branch) {
  return {
    ...branch,
    name: branch.name_en,
    nameAr: branch.name_ar,
    location: branch.city_en || '',
    locationAr: branch.city_ar || '',
    copyText: [branch.name_en, branch.city_en].filter(Boolean).join(' — '),
    copyTextAr: [branch.name_ar, branch.city_ar].filter(Boolean).join(' — '),
  };
}

export function normalizeService(service) {
  const details = service.details || {};
  return {
    ...service,
    name: service.name_en,
    nameAr: service.name_ar,
    shortDescription: details.shortDescription || service.description_en || '',
    shortDescriptionAr: details.shortDescriptionAr || service.description_ar || '',
    description: service.description_en || '',
    descriptionAr: service.description_ar || '',
    benefits: details.benefits || [],
    benefitsAr: details.benefitsAr || [],
    suitableFor: details.suitableFor || '',
    suitableForAr: details.suitableForAr || '',
    treatmentAreas: details.treatmentAreas || [],
    treatmentAreasAr: details.treatmentAreasAr || [],
    importantNotes: details.importantNotes || [],
    importantNotesAr: details.importantNotesAr || [],
    commonQuestions: details.commonQuestions || [],
    media: service.media || [],
    callFlow: service.callFlow || { title_en: '', title_ar: '', steps: [] },
  };
}

export function normalizeOffer(offer, index) {
  return {
    ...offer,
    title: offer.title_en || '',
    titleAr: offer.title_ar || '',
    detail: offer.description_en || '',
    detailAr: offer.description_ar || '',
    expiry: offer.valid_until
      ? `Valid until ${new Date(offer.valid_until).toLocaleDateString()}`
      : '',
    expiryAr: offer.valid_until
      ? `ساري حتى ${new Date(offer.valid_until).toLocaleDateString('ar')}`
      : '',
    tone: ['purple', 'orange', 'blue'][index % 3],
  };
}

export function normalizePrice(price) {
  const amount = Number(price.price);
  return {
    ...price,
    service: price.service_name_en || '',
    serviceAr: price.service_name_ar || '',
    duration: price.duration_en || 'Not specified',
    durationAr: price.duration_ar || 'غير محددة',
    price: `${price.currency || 'AED'} ${Number.isFinite(amount) ? amount.toFixed(2) : price.price}`,
  };
}

export function normalizeQuickReply(reply) {
  return {
    ...reply,
    title: reply.title_en || '',
    branch_id: reply.branch_id == null ? null : Number(reply.branch_id),
  };
}
