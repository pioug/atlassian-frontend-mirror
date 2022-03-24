import React from 'react';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { ReactionPicker } from '../src';
import { ReactionsExampleWrapper } from './examples-utils';

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      <ReactionPicker
        emojiProvider={getEmojiResource()}
        allowAllEmojis
        onSelection={console.log}
      />
    </ReactionsExampleWrapper>
  );
}
