import { offers } from './offers';
import { prices } from './prices';
import { services } from './services';

const record = (type, title, description, arabicTitle, path, extra = {}) => ({
  type,
  title,
  description,
  arabicTitle,
  path,
  searchText: [title, description, arabicTitle, ...extra.searchTerms].filter(Boolean).join(' '),
  ...extra,
});

export const searchableKnowledge = [
  ...services.flatMap((service) => [
    record('Service', service.name, service.shortDescription, service.nameAr, `#/services?service=${service.id}`, {
      searchTerms: [
        service.description,
        service.shortDescriptionAr,
        service.descriptionAr,
        ...service.benefits,
        ...service.benefitsAr,
        service.suitableFor,
        service.suitableForAr,
        ...service.treatmentAreas,
        ...service.treatmentAreasAr,
        ...service.importantNotes,
        ...service.importantNotesAr,
        ...service.commonQuestions.flatMap((item) => [item.questionEn, item.questionAr, item.answerEn, item.answerAr]),
      ],
      serviceId: service.id,
    }),
    ...service.commonQuestions.map((item, index) => record(
      'Question',
      item.questionEn,
      item.answerEn,
      item.questionAr,
      `#/services?service=${service.id}&question=${index}`,
      { searchTerms: [item.questionAr, item.answerAr], serviceId: service.id, questionIndex: index },
    )),
  ]),
  ...offers.map((offer) => record('Offer', offer.title, offer.detail, offer.titleAr, '#/offers', { searchTerms: [offer.detailAr, offer.expiry, offer.expiryAr], branchIds: offer.branchIds })),
  ...prices.map((price) => record('Price', price.service, `${price.duration} · ${price.price}`, price.serviceAr, '#/prices', { searchTerms: [price.serviceAr, price.duration, price.durationAr, price.price], branchIds: price.branchIds })),
];

export function searchKnowledge(query, branchId) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];
  return searchableKnowledge.filter((item) => (
    item.searchText.toLocaleLowerCase().includes(normalizedQuery)
    && (!item.branchIds || item.branchIds.includes(branchId))
  ));
}
