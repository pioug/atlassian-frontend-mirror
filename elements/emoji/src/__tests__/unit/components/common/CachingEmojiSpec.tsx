import * as sinon from 'sinon';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mount, MountRendererProps } from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';
import EmojiResource from '../../../../api/EmojiResource';
import CachingEmoji, {
  CachingMediaEmoji,
} from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import { hasSelector } from '../../_emoji-selectors';
import { imageEmoji, loadedMediaEmoji, mediaEmoji } from '../../_test-data';

describe('<CachingEmoji />', () => {
  describe('Non-media emoji', () => {
    it('CachingMediaEmoji not used, just an Emoji rendered', () => {
      const component = mount(<CachingEmoji emoji={imageEmoji} />);
      expect(component.find(CachingMediaEmoji).length).toEqual(0);
      expect(component.find(Emoji).length).toEqual(1);
    });
  });

  describe('Media emoji', () => {
    let contextOptions: MountRendererProps;
    let emojiProviderStub: any;

    beforeEach(() => {
      emojiProviderStub = sinon.createStubInstance(EmojiResource);
      contextOptions = {
        context: {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        },
        childContextTypes: {
          emoji: PropTypes.object,
        },
      };
    });

    it('Nothing rendered if missing context', () => {
      const component = mount(<CachingEmoji emoji={mediaEmoji} />);
      expect(component.find(CachingMediaEmoji).length).toEqual(1);
      expect(component.find(Emoji).length).toEqual(0);
      expect(component.find(EmojiPlaceholder).length).toEqual(1);
    });

    it('Renders direct url if optimistic rendering true', () => {
      emojiProviderStub.optimisticMediaRendering.returns(true);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      expect(component.find(CachingMediaEmoji).length).toEqual(1);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emoji = component.find(Emoji);
        expect(emoji.length).toEqual(1);
        const emojiDescription = emoji.prop('emoji');
        expect(emojiDescription).toEqual(mediaEmoji);
      });
    });

    it('Loads emoji via cache (promise) if optimistic rendering false', () => {
      emojiProviderStub.optimisticMediaRendering.returns(false);
      emojiProviderStub.loadMediaEmoji.returns(
        Promise.resolve(loadedMediaEmoji),
      );
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      expect(component.find(CachingMediaEmoji).length).toEqual(1);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emoji = component.find(Emoji);
        expect(emoji.length).toEqual(1);
        const emojiDescription = emoji.prop('emoji');
        expect(emojiDescription).toEqual(loadedMediaEmoji);
      });
    });

    it('Loads emoji via cache (non-promise) if optimistic rendering false', () => {
      emojiProviderStub.optimisticMediaRendering.returns(false);
      emojiProviderStub.loadMediaEmoji.returns(loadedMediaEmoji);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      expect(component.find(CachingMediaEmoji).length).toEqual(1);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emoji = component.find(Emoji);
        expect(emoji.length).toEqual(1);
        const emojiDescription = emoji.prop('emoji');
        expect(emojiDescription).toEqual(loadedMediaEmoji);
      });
    });
  });
});
