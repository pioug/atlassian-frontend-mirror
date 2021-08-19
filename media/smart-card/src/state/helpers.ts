import { JsonLd } from 'json-ld-types';
import { CardType, CardStore } from './store/types';
import { Store } from 'redux';
import { extractVisitUrl } from '../extractors/common/primitives/extractVisitUrl';

export const getByDefinitionId = (
  definitionId: string | undefined,
  store: CardStore,
) => {
  const urls = Object.keys(store);
  return urls.filter((url) => {
    const { details } = store[url];
    return details && details.meta.definitionId === definitionId;
  });
};

export const getUrl = (store: Store<CardStore>, url: string) => {
  return (
    store.getState()[url] || {
      status: 'pending',
    }
  );
};

export const getClickUrl = (url: string, jsonLd?: JsonLd.Response): string => {
  if (jsonLd && jsonLd.data) {
    const visitUrl = extractVisitUrl(jsonLd.data as JsonLd.Data.BaseData);
    if (visitUrl) {
      return visitUrl;
    }
  }
  return url;
};

export const getDefinitionId = (details?: JsonLd.Response) =>
  details && details.meta && details.meta.definitionId;

export const getExtensionKey = (details?: JsonLd.Response) =>
  details && details.meta && details.meta.key;

export const getResourceType = (
  details?: JsonLd.Response,
): string | undefined => details && details.meta && details.meta.resourceType;

export const getServices = (details?: JsonLd.Response) =>
  (details && details.meta.auth) || [];

export const hasResolved = (details?: JsonLd.Response) =>
  details && isAccessible(details) && isVisible(details);

export const isAccessible = ({ meta: { access } }: JsonLd.Response) =>
  access === 'granted';

export const isVisible = ({ meta: { visibility } }: JsonLd.Response) =>
  visibility === 'restricted' || visibility === 'public';

export const getStatus = ({ meta }: JsonLd.Response): CardType => {
  const { access, visibility } = meta;
  switch (access) {
    case 'forbidden':
      if (visibility === 'not_found') {
        return 'not_found';
      } else {
        return 'forbidden';
      }
    case 'unauthorized':
      return 'unauthorized';
    default:
      return 'resolved';
  }
};

export const isFinalState = (status: CardType): boolean => {
  return (
    ['unauthorized', 'forbidden', 'errored', 'resolved', 'not_found'].indexOf(
      status,
    ) > -1
  );
};
