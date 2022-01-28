import React from 'react';
import { shallowWithIntl } from '@atlaskit/editor-test-helpers/enzyme-next';

import * as styles from '../../../../components/common/styles';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji } from '../../_test-data';
import EmojiPickerPreview from '../../../../components/picker/EmojiPickerPreview';

const emoji: EmojiDescriptionWithVariations = {
  ...imageEmoji,
};

describe('<EmojiPickerPreview />', () => {
  it('should render an emoji preview if one is selected', () => {
    const wrapper = shallowWithIntl(<EmojiPickerPreview emoji={emoji} />);

    expect(wrapper.find(`.${styles.preview}`)).toHaveLength(1);
  });

  it('should not render the emoji preview if one is not selected', () => {
    const wrapper = shallowWithIntl(<EmojiPickerPreview />);

    expect(wrapper.find(`.${styles.preview}`)).toHaveLength(0);
  });
});
