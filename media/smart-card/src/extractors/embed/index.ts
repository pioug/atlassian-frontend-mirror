import { JsonLd } from 'json-ld-types';
import { EmbedCardResolvedViewProps } from '@atlaskit/media-ui/embeds';
import { extractLink, extractTitle } from '../common/primitives';
import { extractProvider } from '../common/context';
import { extractPreview } from '../common/preview/extractPreview';

const extractEmbedPreview = (
  jsonLd: JsonLd.Data.BaseData,
): string | undefined => {
  const preview = extractPreview(jsonLd);
  if (preview && preview.src) {
    return preview.src;
  }
};

export const extractEmbedProps = (
  jsonLd: JsonLd.Data.BaseData,
): EmbedCardResolvedViewProps => ({
  link: extractLink(jsonLd) || '',
  title: extractTitle(jsonLd),
  context: extractProvider(jsonLd),
  preview: extractEmbedPreview(jsonLd),
});
