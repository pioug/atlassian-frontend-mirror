import { shallow } from 'enzyme';
import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import * as styles from '../../../../components/common/styles';
import Emoji from '../../../../components/common/Emoji';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import DeleteButton from '../../../../components/common/DeleteButton';

describe('<Emoji />', () => {
  describe('as sprite', () => {
    it('should use spritesheet if present', () => {
      const wrapper = shallow(<Emoji emoji={spriteEmoji} />);

      const sprite = wrapper.find(`.${styles.emojiSprite}`);
      expect((sprite.prop('style') || {}).backgroundImage).toEqual(
        'url(https://path-to-spritesheet.png)',
      );
    });

    it('should use percentage for background-position', () => {
      const wrapper = shallow(<Emoji emoji={spriteEmoji} />);

      const sprite = wrapper.find(`.${styles.emojiSprite}`);
      expect((sprite.prop('style') || {}).backgroundPosition).toEqual(
        '20% 20%',
      );
    });

    it('should use zoom the background image', () => {
      const wrapper = shallow(<Emoji emoji={spriteEmoji} />);

      const sprite = wrapper.find(`.${styles.emojiSprite}`);
      const size = ((sprite.prop('style') || {}) as any).backgroundSize;
      expect(size).toEqual('600% 600%');
    });

    it('should be selected', () => {
      const wrapper = shallow(<Emoji emoji={spriteEmoji} selected={true} />);

      expect(
        wrapper.find(`.${styles.emojiContainer}`).hasClass(styles.selected),
      ).toEqual(true);
    });

    it('should be wrapped in a tooltip if showTooltip is set to true', () => {
      const wrapper = shallow(<Emoji emoji={spriteEmoji} showTooltip={true} />);

      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(1);
    });

    it('should not be wrapped in a tooltip if showTooltip is not set', () => {
      const wrapper = shallow(<Emoji emoji={spriteEmoji} />);

      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(0);
    });
  });

  describe('as image', () => {
    it('should use image by default', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} />);

      const image = wrapper.find(`.${styles.emoji} img`);
      expect(image.prop('src') || {}).toEqual('https://path-to-image.png');
    });

    it('should have emoji class', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} />);

      const image = wrapper.find(`.${styles.emoji} img`);
      expect(image.hasClass('emoji')).toEqual(true);
    });

    it('should have "data-emoji-short-name" attribute', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} />);

      const image = wrapper.find(`.${styles.emoji} img`);
      expect(image.prop('data-emoji-short-name') || {}).toEqual(':grimacing:');
    });

    it('should use altRepresentation image if fitToHeight is larger than representation height', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} fitToHeight={26} />);

      const image = wrapper.find(`.${styles.emoji} img`);
      expect(image.prop('src') || {}).toEqual('https://alt-path-to-image.png');
    });

    it('should be selected', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} selected={true} />);

      const image = wrapper.find(`.${styles.emoji}`);
      expect(image.hasClass(styles.selected)).toEqual(true);
    });

    it('should be wrapped in a tooltip if showTooltip is set to true', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} showTooltip={true} />);

      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(1);
    });

    it('should not be wrapped in a tooltip if showTooltip is not set', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} />);

      const tooltip = wrapper.find(Tooltip);
      expect(tooltip).toHaveLength(0);
    });

    it('should show delete button is showDelete is passed in', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} showDelete={true} />);
      expect(wrapper.find(DeleteButton)).toHaveLength(1);
    });

    it('should not show delete button if showDelete is not passed in', () => {
      const wrapper = shallow(<Emoji emoji={imageEmoji} />);
      expect(wrapper.find(DeleteButton)).toHaveLength(0);
    });
  });
});
