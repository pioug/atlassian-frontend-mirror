import React from 'react';
import { payloadPublisher, ufologger } from '@atlassian/ufo';
import { IntlProvider } from 'react-intl-next';
import ResourcedEmojiControl, {
  getEmojiConfig,
  getRealEmojiResource,
} from '../example-helpers/demo-resource-control';
import EmojiPicker from '../src';
import { onSelection } from '../example-helpers';
import {
  SAMPLING_RATE_EMOJI_RENDERED_EXP,
  SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI,
} from '../src/util/constants';
import { RenderRealResourcedEmojis } from './22-resourced-emoji-real-resource-backend';
/**
 * The publisher will be set up in product side in the real world
 * We add it in the example here so we can see events coming from UFO in the console
 */
payloadPublisher.setup({
  product: 'examples',
  gasv3: {
    sendOperationalEvent: (event) => {
      console.log('sendOperationalEvent:', event);
    },
  },
  app: { version: { web: 'unknown' } },
});

ufologger.enable();

const provider = getRealEmojiResource();

export default () => (
  <>
    <IntlProvider locale="en">
      <ResourcedEmojiControl
        emojiConfig={getEmojiConfig()}
        customEmojiProvider={provider}
        children={
          <>
            <h3>Sampling is enabled for emoji rendered UFO experience</h3>
            <p>
              CachingEmoji(inside EmojiPicker)'s sampling rate is:{' '}
              {SAMPLING_RATE_EMOJI_RENDERED_EXP}
            </p>
            <br />
            <EmojiPicker emojiProvider={provider} onSelection={onSelection} />
            <hr />
            <p>
              ResourcedEmoji's sampling rate is:{' '}
              {SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI}
            </p>
            <br />
            <RenderRealResourcedEmojis emailProvider={provider} />
          </>
        }
      />
    </IntlProvider>
  </>
);
