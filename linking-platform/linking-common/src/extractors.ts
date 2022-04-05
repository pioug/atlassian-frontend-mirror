import { JsonLd } from 'json-ld-types';
import { CardPlatform, LinkPreview } from './types';

export type { LinkPreview };

export const extractUrlFromLinkJsonLd = (
  link: JsonLd.Primitives.Link | JsonLd.Primitives.Link[],
): string | undefined => {
  if (typeof link === 'string') {
    return link;
  } else if (Array.isArray(link)) {
    if (link.length > 0) {
      return extractUrlFromLinkJsonLd(link[0]);
    }
  } else {
    return link.href;
  }
};

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

export const extractPlatformIsSupported = (
  preview: JsonLd.Data.BaseData['preview'],
  platform?: CardPlatform,
): boolean | undefined => {
  if (preview) {
    // By default, we support previews everywhere.
    if (typeof preview === 'string') {
      return true;
    } else {
      const supportedPlatforms = preview['atlassian:supportedPlatforms'];
      if (supportedPlatforms) {
        const isWeb = platform === 'web';
        return (
          (isWeb && supportedPlatforms.includes('web')) ||
          (!isWeb && supportedPlatforms.includes('mobile'))
        );
      }
      // No supported platforms - assume they are all supported.
      return true;
    }
  }

  // No preview, don't try and render it on any platforms.
  return false;
};
