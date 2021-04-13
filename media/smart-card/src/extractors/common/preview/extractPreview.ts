import { JsonLd } from 'json-ld-types';

import { CardPlatform } from '../../../view/Card/types';
import { extractUrlFromLinkJsonLd } from '../utils';
import { extractPlatformIsSupported } from './extractPlatformIsSupported';

export interface LinkPreview {
  src?: string;
  content?: string;
  aspectRatio?: number;
}

export const extractPreview = (
  jsonLd: JsonLd.Data.BaseData,
  platform?: CardPlatform,
): LinkPreview | undefined => {
  const preview = jsonLd.preview;
  const isSupported = extractPlatformIsSupported(preview, platform);
  if (preview && isSupported) {
    if (typeof preview === 'string') {
      return { src: preview };
    } else if (preview['@type'] === 'Link') {
      return {
        src: extractUrlFromLinkJsonLd(preview),
        aspectRatio: preview['atlassian:aspectRatio'],
      };
    } else {
      // TODO, EDM-565: Remove this once the typings for Dropbox and Jira have been patched up.
      if (preview.url || (preview as any).href) {
        return {
          src: extractUrlFromLinkJsonLd(preview.url || (preview as any).href),
          aspectRatio: preview['atlassian:aspectRatio'],
        };
      } else if (preview.content) {
        return { content: preview.content };
      }
    }
  }
};
