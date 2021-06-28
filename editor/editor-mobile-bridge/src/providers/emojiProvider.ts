import { EmojiResource, EmojiResourceConfig } from '@atlaskit/emoji/resource';
import { createPromise } from '../cross-platform-promise';
import { GetConfigPayload } from '../types';
import { FetchProxy } from '../utils/fetch-proxy';

/**
 * To construct an EmojiResourceConfig we need to know the base url
 * and the cloud Id to add provider urls. We request these from Native.
 *
 * Note:
 * Currently, the user must be authenticated to resolve the elements config.
 */
const elementsConfigPromise = createPromise('getConfig');

export function createEmojiProvider(fetchProxy: FetchProxy) {
  return elementsConfigPromise
    .submit()
    .then((elementsConfig) => {
      const emojiConfig = createEmojiConfig(elementsConfig);

      /**
       * iOS has no stable APIs to intercept requests.
       * So we mock out fetch for specific URLs and send them to native.
       * This bypasses a number of issues introduced when working via the
       * file protocol (CORS, cookie support, null origin etc).
       * TODO: We should send all fetch requests to iOS for processing,
       *       to be as consistent as possible.
       */
      if (window.webkit) {
        emojiConfig.providers.forEach((p) => fetchProxy.add(p.url));
      }

      return new EmojiResource(emojiConfig);
    })
    .catch((error: any) => {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to resolve ElementsConfig via `getConfig`. Please authenticate and try again.',
        error,
      );
      return new EmojiResource(createEmojiConfig());
    });
}

function createEmojiConfig(
  elementsConfig?: GetConfigPayload,
): EmojiResourceConfig {
  const providers: { url: string }[] = [];

  if (elementsConfig) {
    let { cloudId, baseUrl } = elementsConfig;
    baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    providers.push({ url: `${baseUrl}emoji/standard` });
    providers.push({ url: `${baseUrl}emoji/atlassian` });
    if (cloudId) {
      providers.push({ url: `${baseUrl}emoji/${cloudId}/site` });
    }
  }

  return { providers };
}
