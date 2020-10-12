import * as sinon from 'sinon';
import { mount } from 'enzyme';
import React from 'react';

import * as styles from '../../../../components/common/styles';
import EmojiButton from '../../../../components/common/EmojiButton';
import { spriteEmoji, imageEmoji } from '../../_test-data';

describe('<EmojiButton />', () => {
  describe('as sprite', () => {
    it('should call onClick on click', () => {
      const onClickSpy = sinon.spy();
      const wrapper = mount(
        <EmojiButton emoji={spriteEmoji} onSelected={onClickSpy} />,
      );

      wrapper
        .find(`.${styles.emojiButton}`)
        .simulate('mousedown', { button: 0 });
      expect(onClickSpy.called).toEqual(true);
    });
  });

  describe('as image', () => {
    it('should call onClick on click', () => {
      const onClickSpy = sinon.spy();
      const wrapper = mount(
        <EmojiButton emoji={imageEmoji} onSelected={onClickSpy} />,
      );

      wrapper
        .find(`.${styles.emojiButton}`)
        .simulate('mousedown', { button: 0 });
      expect(onClickSpy.called).toEqual(true);
    });
  });
});
