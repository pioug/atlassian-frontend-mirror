import { JsonLd } from 'json-ld-types';
import { EmbedCardResolvedViewProps } from '@atlaskit/media-ui/embeds';

import { CardPlatform } from '../../view/Card/types';
import { extractLink, extractTitle } from '../common/primitives';
import { extractProvider } from '../common/context';
import { extractPreview, LinkPreview } from '../common/preview/extractPreview';
import { extractIsTrusted } from '../common/meta/extractIsTrusted';

const extractEmbedPreview = (
  jsonLd: JsonLd.Data.BaseData,
  platform?: CardPlatform,
): (LinkPreview & { src: string }) | undefined => {
  const preview = extractPreview(jsonLd, platform);
  if (preview && preview.src) {
    return { ...preview, src: preview.src };
  }
};

export const extractEmbedProps = (
  jsonLd: JsonLd.Data.BaseData,
  meta?: JsonLd.Meta.BaseMeta,
  platform?: CardPlatform,
): EmbedCardResolvedViewProps => ({
  link: extractLink(jsonLd) || '',
  title: extractTitle(jsonLd),
  context: extractProvider(jsonLd),
  preview: extractEmbedPreview(jsonLd, platform),
  isTrusted: extractIsTrusted(meta),
});
