import { JsonLd } from 'json-ld-types';
import { extractUrlFromLinkJsonLd } from '../utils';

export interface LinkPreview {
  src?: string;
  content?: string;
}

export const extractPreview = (
  jsonLd: JsonLd.Data.BaseData,
): LinkPreview | undefined => {
  const preview = jsonLd.preview;
  if (preview) {
    if (typeof preview === 'string') {
      return { src: preview };
    } else if (preview['@type'] === 'Link') {
      return { src: extractUrlFromLinkJsonLd(preview) };
    } else {
      // TODO, EDM-565: Remove this once the typings for Dropbox and Jira have been patched up.
      if (preview.url || (preview as any).href) {
        return {
          src: extractUrlFromLinkJsonLd(preview.url || (preview as any).href),
        };
      } else if (preview.content) {
        return { content: preview.content };
      }
    }
  }
};
