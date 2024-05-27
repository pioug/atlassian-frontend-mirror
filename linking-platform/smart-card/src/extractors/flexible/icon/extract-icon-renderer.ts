import { type JsonLd } from 'json-ld-types';
import { type CardProviderRenderers } from '@atlaskit/link-provider';

const sanitizeEmojiValue = (value: string | undefined) =>
  (value && value.replace(/['"]+/g, '').replace(/null/, '')) || '';

const extractIconRenderer = (
  data: JsonLd.Data.BaseData,
  renderers?: CardProviderRenderers,
): (() => React.ReactNode) | undefined => {
  const prefix = data['atlassian:titlePrefix'];
  if (prefix?.['@type'] === 'atlassian:Emoji') {
    const emojiId = sanitizeEmojiValue(prefix['text']);
    const emojiRenderer = renderers?.emoji;
    if (emojiId && emojiRenderer) {
      return () => emojiRenderer(emojiId);
    }
  }
};

export default extractIconRenderer;
