import React from 'react';
import { getEmojiRepository } from '@atlaskit/util-data-test/get-emoji-repository';
import { Emoji } from '../src/element';
import { IntlProvider } from 'react-intl-next';

const emojiService = getEmojiRepository();

export const RenderSpriteEmojis = () => {
  const grimacing = emojiService.findByShortName(':grimacing:');

  return <Emoji emoji={grimacing} showTooltip fitToHeight={24} />;
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <RenderSpriteEmojis />
    </IntlProvider>
  );
}
