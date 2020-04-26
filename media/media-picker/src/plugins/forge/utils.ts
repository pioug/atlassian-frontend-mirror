import { JsonLd } from 'json-ld-types';
import { getImageUrl, getResourceUrl } from '../extractors';

export const getMetadata = (
  id: string,
  resource: Omit<JsonLd.Primitives.Image | JsonLd.Data.Document, '@context'>,
) => {
  if (resource['@type'] === 'Image') {
    return {
      id,
      metadata: {
        type: 'image',
        src: getImageUrl(resource),
        srcFull: getImageUrl(resource),
      },
    };
  } else {
    return {
      id,
      metadata: {
        type: 'link',
        src: getResourceUrl(resource.url),
      },
    };
  }
};
