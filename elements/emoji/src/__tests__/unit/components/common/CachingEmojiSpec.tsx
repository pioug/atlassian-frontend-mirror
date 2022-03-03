import React from 'react';
import * as sinon from 'sinon';
import { render } from '@testing-library/react';
import CachingEmoji from '../../../../components/common/CachingEmoji';
import EmojiResource from '../../../../api/EmojiResource';
import { EmojiContextProvider } from '../../../../context/EmojiContextProvider';
import { imageEmoji, mediaEmoji, loadedMediaEmoji } from '../../_test-data';
import { EmojiContextType } from '../../../../context/EmojiContext';
import { EmojiDescription } from '../../../../types';

describe('<CachingEmoji />', () => {
  describe('Non-media emoji', () => {
    it('CachingMediaEmoji not used, just an Emoji rendered', async () => {
      const result = await render(<CachingEmoji emoji={imageEmoji} />);
      expect(result).not.toBeNull();
      const image = result.getByAltText(':grimacing:');
      expect(image).not.toBeNull();
      expect(image).toHaveAttribute('src', imageEmoji.representation.imagePath);
    });
  });

  describe('Media emoji', () => {
    it('renders nothing if context is missing', async () => {
      const result = await render(<CachingEmoji emoji={mediaEmoji} />);
      expect(result).not.toBeNull();
      expect(result.container.children.length).toEqual(1);
    });

    describe('with a valid provider', () => {
      const createEmojiContextWrapperRenderer = async (
        emojiContextValue: EmojiContextType,
        emojiDescription: EmojiDescription,
      ) => {
        return render(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={mediaEmoji} />
          </EmojiContextProvider>,
        );
      };

      let emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource>;
      beforeEach(() => {
        emojiProviderStub = sinon.createStubInstance(EmojiResource);
      });

      it('has lazyload defined on the image attribute', async () => {
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const result = await createEmojiContextWrapperRenderer(
          emojiContextValue,
          mediaEmoji,
        );
        const image = result.container.firstChild?.firstChild;

        expect(image).toHaveAttribute('loading', 'lazy');
      });

      it('renders direct url if optimistic rendering is true', async () => {
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const result = await createEmojiContextWrapperRenderer(
          emojiContextValue,
          mediaEmoji,
        );
        const image = result.container.firstChild?.firstChild;

        expect(image).not.toBeNull();
        expect(image).toHaveAttribute(
          'src',
          mediaEmoji.representation.mediaPath,
        );
        expect(image).toHaveAttribute('alt', mediaEmoji.shortName);
      });

      it('loads emoji via cache (promise) if optimistic rendering is false', async () => {
        emojiProviderStub.optimisticMediaRendering.returns(false);
        emojiProviderStub.loadMediaEmoji.returns(
          Promise.resolve(loadedMediaEmoji),
        );
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const result = await createEmojiContextWrapperRenderer(
          emojiContextValue,
          mediaEmoji,
        );
        const image = result.container.firstChild?.firstChild;

        expect(image).not.toBeNull();
        expect(image).toHaveAttribute('src', expect.stringContaining('base64'));
        expect(image).toHaveAttribute('alt', loadedMediaEmoji.shortName);
      });

      it('loads emoji via cache (non promise) if optimistic rendering is false', async () => {
        emojiProviderStub.optimisticMediaRendering.returns(false);
        emojiProviderStub.loadMediaEmoji.returns(loadedMediaEmoji);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const result = await createEmojiContextWrapperRenderer(
          emojiContextValue,
          mediaEmoji,
        );
        const image = result.container.firstChild?.firstChild;

        expect(image).not.toBeNull();
        expect(image).toHaveAttribute('src', expect.stringContaining('base64'));
        expect(image).toHaveAttribute('alt', loadedMediaEmoji.shortName);
      });
    });
  });
});
