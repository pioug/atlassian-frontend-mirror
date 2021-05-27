import React from 'react';

import { getEmojis } from '@atlaskit/util-data-test/get-emojis';

import EmojiPreview from '../src/components/common/EmojiPreview';

import { emojiPickerWidth } from '../src/util/constants';
import filters from '../src/util/filters';

const emojis = getEmojis();

const tongueEmoji = filters.byShortName(
  emojis,
  ':stuck_out_tongue_closed_eyes:',
);
const longTongueEmoji = {
  ...tongueEmoji,
  name: `${tongueEmoji.name} ${tongueEmoji.name} ${tongueEmoji.name}`,
  shortName: `${tongueEmoji.shortName}_${tongueEmoji.shortName}_${tongueEmoji.shortName}`,
};

const toneEmoji = filters.toneEmoji(emojis);

const borderedStyle = {
  margin: '20px',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  width: emojiPickerWidth,
};

export default function Example() {
  return (
    <div style={borderedStyle}>
      <EmojiPreview emoji={longTongueEmoji} toneEmoji={toneEmoji} />
    </div>
  );
}
