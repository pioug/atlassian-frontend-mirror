import React from 'react';
import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji } from '../../_test-data';
import { EmojiPreviewComponent } from '../../../../components/common/EmojiPreviewComponent';

const emoji: EmojiDescriptionWithVariations = {
  ...imageEmoji,
};

describe('<EmojiPickerPreview />', () => {
  it('should render an emoji preview if one is selected', () => {
    const wrapper = shallowWithIntl(<EmojiPreviewComponent emoji={emoji} />);

    expect(wrapper.find(EmojiPreviewComponent)).toBeDefined();
  });
});
