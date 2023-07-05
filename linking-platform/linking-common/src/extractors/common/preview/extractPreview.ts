import { JsonLd } from 'json-ld-types';
import { CardPlatform } from '../../../types';
import { extractPlatformIsSupported } from '../platform/extractPlatformIsSupported';
import { extractUrlFromLinkJsonLd } from '../url';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export interface LinkPreview {
  src?: string;
  content?: string;
  aspectRatio?: number;
}

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export type EmbedIframeUrlType = 'href' | 'interactiveHref';

/**
 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3340 Internal documentation for deprecation (no external access)} use `@atlaskit/link-extractors` instead
 */
export const extractPreview = (
  jsonLd: JsonLd.Data.BaseData,
  platform?: CardPlatform,
  iframeUrlType?: EmbedIframeUrlType,
): LinkPreview | undefined => {
  const preview = jsonLd.preview;
  const isSupported = extractPlatformIsSupported(preview, platform);
  if (preview && isSupported) {
    if (typeof preview === 'string') {
      return { src: preview };
    } else if (
      preview['@type'] === 'Link' &&
      iframeUrlType === 'interactiveHref' &&
      preview.interactiveHref
    ) {
      return {
        src: preview.interactiveHref,
        aspectRatio: preview['atlassian:aspectRatio'],
      };
    } else if (preview['@type'] === 'Link') {
      return {
        src: extractUrlFromLinkJsonLd(preview),
        aspectRatio: preview['atlassian:aspectRatio'],
      };
    } else {
      // TODO, EDM-565: Remove this once the typings for Dropbox and Jira have been patched up.
      if (preview.url || (preview as any).href) {
        if (iframeUrlType === 'interactiveHref' && preview.interactiveHref) {
          return {
            src: preview.interactiveHref,
            aspectRatio: preview['atlassian:aspectRatio'],
          };
        }
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
