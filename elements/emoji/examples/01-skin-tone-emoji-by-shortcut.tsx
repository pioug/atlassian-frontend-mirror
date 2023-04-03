import React from 'react';

import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { EmojiProvider } from '../src/resource';
import { ResourcedEmoji } from '../src/element';
import { IntlProvider } from 'react-intl-next';

export default function Example() {
  return (
    <IntlProvider locale="en">
      <ResourcedEmoji
        emojiId={{ shortName: ':thumbsup:' }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true}
      />
      <ResourcedEmoji
        emojiId={{ shortName: ':thumbsup::skin-tone-2:' }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true}
      />
      <ResourcedEmoji
        emojiId={{ shortName: ':thumbsup::skin-tone-3:' }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true}
      />
      <ResourcedEmoji
        emojiId={{ shortName: ':thumbsup::skin-tone-4:' }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true}
      />
      <ResourcedEmoji
        emojiId={{ shortName: ':thumbsup::skin-tone-5:' }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true}
      />
      <ResourcedEmoji
        emojiId={{ shortName: ':thumbsup::skin-tone-6:' }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true}
      />
      <ResourcedEmoji
        emojiId={{
          shortName:
            ':thumbsup::skin-tone-7:' /* invalid - will fallback to text render */,
        }}
        emojiProvider={getEmojiResource() as Promise<EmojiProvider>}
        showTooltip={true} /* should not show tooltip */
      />
    </IntlProvider>
  );
}
