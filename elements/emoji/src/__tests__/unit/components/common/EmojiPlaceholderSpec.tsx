import { shallow } from 'enzyme';
import React from 'react';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';

describe('<EmojiPlaceholder />', () => {
  describe('render', () => {
    it('should render with fitToHeight', () => {
      const shortName = ':rage:';
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          size={48}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).toEqual('48px');
      expect(spanStyle!.height).toEqual('48px');
    });

    it('should render with default height', () => {
      const shortName = ':rage:';
      const wrapper = shallow(
        <EmojiPlaceholder shortName={shortName} showTooltip={false} />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).toEqual('20px');
      expect(spanStyle!.height).toEqual('20px');
    });

    it('should render with provided size', () => {
      const shortName = ':rage:';
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          size={64}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).toEqual('64px');
      expect(spanStyle!.height).toEqual('64px');
    });

    it('should render image representation with custom size', () => {
      const shortName = ':rage:';
      const rep = {
        imagePath: '/path/bla.png',
        width: 256,
        height: 128,
      };
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          representation={rep}
          size={48}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).toEqual('96px');
      expect(spanStyle!.height).toEqual('48px');
    });

    it('should render media representation with custom size', () => {
      const shortName = ':rage:';
      const rep = {
        mediaPath: '/path/bla.png',
        width: 256,
        height: 128,
      };
      const wrapper = shallow(
        <EmojiPlaceholder
          shortName={shortName}
          showTooltip={false}
          representation={rep}
          size={48}
        />,
      );

      const spanStyle = wrapper.find('span').prop('style');
      expect(spanStyle!.width).toEqual('96px');
      expect(spanStyle!.height).toEqual('48px');
    });
  });
});
