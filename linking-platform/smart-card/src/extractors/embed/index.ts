import { JsonLd } from 'json-ld-types';
import { CardPlatform, EmbedIframeUrlType } from '../../view/Card/types';
import {
  extractLink,
  extractTitle,
  extractProvider,
  extractPreview,
  LinkPreview,
} from '@atlaskit/linking-common/extractors';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';
import { EmbedCardResolvedViewProps } from '../../view/EmbedCard/views/ResolvedView';

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

export const extractEmbedProps = (
  jsonLd: JsonLd.Data.BaseData,
  meta?: JsonLd.Meta.BaseMeta,
  platform?: CardPlatform,
  iframeUrlType?: EmbedIframeUrlType,
): EmbedCardResolvedViewProps => {
  return {
    link: extractLink(jsonLd) || '',
    title: extractTitle(jsonLd),
    context: extractProvider(jsonLd),
    preview: extractEmbedPreview(jsonLd, platform, iframeUrlType),
    isTrusted: extractIsTrusted(meta),
  };
};
