import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import React from 'react';
import { ReactionPicker } from '../src';
import { ReactionsExampleWrapper } from './examples-util';

export default function Example() {
  return (
    <ReactionsExampleWrapper>
      <ReactionPicker
        emojiProvider={getEmojiResource()}
        allowAllEmojis={true}
        onSelection={console.log}
      />
    </ReactionsExampleWrapper>
  );
}
