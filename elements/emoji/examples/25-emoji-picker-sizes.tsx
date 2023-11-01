import React from 'react';
import type { EmojiProvider } from '../src/resource';
import { EmojiPicker } from '../src/picker';
import { IntlProvider } from 'react-intl-next';
// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

export default function Example() {
  const emojiProvider = getEmojiResource() as Promise<EmojiProvider>;
  return (
    <IntlProvider locale="en">
      <div>
        <h3>Emoji Picker with default size</h3>
        <EmojiPicker emojiProvider={emojiProvider} />
        <h3>Emoji Picker with small size</h3>
        <EmojiPicker emojiProvider={emojiProvider} size="small" />
        <h3>Emoji Picker with medium size</h3>
        <EmojiPicker emojiProvider={emojiProvider} size="medium" />
        <h3>Emoji Picker with large size</h3>
        <EmojiPicker emojiProvider={emojiProvider} size="large" />
      </div>
    </IntlProvider>
  );
}
