import { type JsonLd } from 'json-ld-types';
import { type CardPlatform, type EmbedIframeUrlType } from '../../view/Card/types';
import {
  extractLink,
  extractTitle,
  extractProvider,
  extractProviderIcon,
  type LinkProvider,
  extractPreview,
  type LinkPreview,
  extractUrlFromIconJsonLd,
} from '@atlaskit/link-extractors';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { extractIsSupportTheming } from '../common/meta/extractIsSupportTheming';
import { type EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';
import { prioritiseIcon } from '../common/icon';

const extractEmbedPreview = (
  jsonLd: JsonLd.Data.BaseData,
  platform?: CardPlatform,
  iframeUrlType?: EmbedIframeUrlType,
): (LinkPreview & { src: string }) | undefined => {
  const preview = extractPreview(jsonLd, platform, iframeUrlType);
  if (preview && preview.src) {
    return { ...preview, src: preview.src };
  }
};

function generateContext(jsonLd: JsonLd.Data.BaseData): LinkProvider | undefined {
  const provider = extractProvider(jsonLd);
  if (!provider) {
    return undefined;
  }

  // If no icon is supplied, return existing context
  if (!jsonLd.icon) {
    return provider;
  }

  const generator = jsonLd.generator;

  const icon: React.ReactNode = prioritiseIcon<React.ReactNode>({
    providerId: generator && typeof generator !== 'string' && generator['@type'] !== 'Link' ? generator['@id'] : undefined,
    fileFormatIcon: undefined,
    documentTypeIcon: undefined,
    urlIcon: extractUrlFromIconJsonLd(jsonLd.icon),
    // We still attempt to follow the icon priority function even if no generator (and therefore provider icon) is defined
    providerIcon: generator && typeof generator !== 'string' && generator['@type'] !== 'Link' && extractProviderIcon(generator.icon),
  })

  return {
    ...provider,
    icon: icon ? icon : provider.icon,
  };
}

export const extractEmbedProps = (
  jsonLd: JsonLd.Data.BaseData,
  meta?: JsonLd.Meta.BaseMeta,
  platform?: CardPlatform,
  iframeUrlType?: EmbedIframeUrlType,
): EmbedCardResolvedViewProps => ({
  link: extractLink(jsonLd) || '',
  title: extractTitle(jsonLd),
  context: getBooleanFF('platform.linking-platform.smart-card.standardise-smart-link-icon-behaviour')
    ? generateContext(jsonLd)
    : extractProvider(jsonLd),
  preview: extractEmbedPreview(jsonLd, platform, iframeUrlType),
  isTrusted: extractIsTrusted(meta),
  isSupportTheming: extractIsSupportTheming(meta),
});
