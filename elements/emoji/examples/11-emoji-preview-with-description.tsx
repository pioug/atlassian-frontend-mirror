import React from 'react';
import EmojiPreview from '../src/components/common/EmojiPreview';
import { emojiPickerWidth } from '../src/util/constants';

const emoji = {
  id: '118608',
  name: 'red star',
  shortName: ':red_star:',
  type: 'ATLASSIAN',
  category: 'ATLASSIAN',
  order: 2147483647,
  skinVariations: [],
  representation: {
    imagePath:
      'https://pf-emoji-service--cdn.ap-southeast-2.dev.public.atl-paas.net/atlassian/red_star_64.png',
    height: 64,
    width: 64,
  },
  hasSkinVariations: false,
  searchable: true,
};

const borderedStyle = {
  margin: '20px',
  border: '1px solid #ddd',
  backgroundColor: 'white',
  width: emojiPickerWidth,
};

export default function Example() {
  return (
    <div style={borderedStyle}>
      <EmojiPreview emoji={emoji} />
    </div>
  );
}
