import React from 'react';
import { token } from '@atlaskit/tokens';
import { getEmojis } from '@atlaskit/util-data-test/get-emojis';

import { emojiPickerWidth } from '../src/util/constants';
import filters from '../src/util/filters';
import EmojiPickerPreview from '../src/components/picker/EmojiPickerPreview';
import { IntlProvider } from 'react-intl-next';

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

const borderedStyle = {
  margin: '20px',
  border: `1px solid ${token('color.border', '#ddd')}`,
  backgroundColor: token('elevation.surface', 'white'),
  width: emojiPickerWidth,
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <div style={borderedStyle}>
        <EmojiPickerPreview emoji={longTongueEmoji} />
      </div>
    </IntlProvider>
  );
}
