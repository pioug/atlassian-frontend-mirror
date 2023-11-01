import React from 'react';
import * as sinon from 'sinon';
import { fireEvent } from '@testing-library/react';
import CachingEmoji from '../../../../components/common/CachingEmoji';
import EmojiResource from '../../../../api/EmojiResource';
import { EmojiContextProvider } from '../../../../context/EmojiContextProvider';
import { imageEmoji, mediaEmoji } from '../../_test-data';
import type { EmojiContextType } from '../../../../context/EmojiContext';
import type { EmojiDescription } from '../../../../types';
import { ufoExperiences } from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import * as samplingUfo from '../../../../util/analytics/samplingUfo';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import browserSupport from '../../../../util/browser-support';
import { mountWithIntl } from '../../_enzyme';
import { renderWithIntl } from '../../_testing-library';

jest.mock('../../../../util/constants', () => {
  const originalModule = jest.requireActual('../../../../util/constants');
  return {
    ...originalModule,
    SAMPLING_RATE_EMOJI_RENDERED_EXP: 1,
  };
});

const mockConstants = constants as {
  SAMPLING_RATE_EMOJI_RENDERED_EXP: number;
};

describe('<CachingEmoji />', () => {
  beforeAll(() => {
    browserSupport.supportsIntersectionObserver = true;
  });

  describe('Non-media emoji', () => {
    it('CachingMediaEmoji not used, just an Emoji rendered', async () => {
      const result = await renderWithIntl(<CachingEmoji emoji={imageEmoji} />);
      mockAllIsIntersecting(true);
      expect(result).not.toBeNull();
      const image = result.getByAltText(':grimacing:');
      expect(image).not.toBeNull();
      expect(image).toHaveAttribute('src', imageEmoji.representation.imagePath);
    });
  });

  describe('Media emoji', () => {
    beforeEach(() => {
      mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP = 1;
      samplingUfo.clearSampled();
      jest.clearAllMocks();
    });
    it('renders nothing if context is missing', async () => {
      const result = await renderWithIntl(<CachingEmoji emoji={mediaEmoji} />);
      expect(result.container.children.length).toEqual(0);
    });

    describe('with a valid provider', () => {
      const createEmojiContextWrapperRenderer = async (
        emojiContextValue: EmojiContextType,
        emojiDescription: EmojiDescription,
      ) => {
        const component = await renderWithIntl(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={emojiDescription} />
          </EmojiContextProvider>,
        );
        mockAllIsIntersecting(true);
        return component;
      };

      let emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource>;
      beforeEach(() => {
        emojiProviderStub = sinon.createStubInstance(EmojiResource);
      });

      it('Renders placeholder emoji tokenisation transform fails to parse emoji description', async () => {
        emojiProviderStub.getMediaEmojiDescriptionURLWithInlineToken.returns(
          Promise.reject(),
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

        const span = await result.findByTitle('');
        expect(span).toHaveAttribute('aria-label', ':media:');
      });

      it('renders caching emoji when emoji decription can be transformed', async () => {
        emojiProviderStub.getMediaEmojiDescriptionURLWithInlineToken.returns(
          Promise.resolve({
            ...mediaEmoji,
            representation: {
              ...mediaEmoji.representation,
              mediaPath: `${mediaEmoji.representation.mediaPath}&token=abc&client=def`,
            },
          }),
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

        const image = result.queryByAltText(':media:');

        expect(image).toHaveAttribute(
          'src',
          'https://media.example.com/path-to-image.png&token=abc&client=def',
        );
      });

      it('should success rendered emoji UFO experience', async () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const successSpy = jest.spyOn(experience, 'success');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        emojiProviderStub.getMediaEmojiDescriptionURLWithInlineToken.returns(
          Promise.resolve({
            ...mediaEmoji,
            representation: {
              ...mediaEmoji.representation,
              mediaPath: `${mediaEmoji.representation.mediaPath}&token=abc&client=def`,
            },
          }),
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
        const image = result.queryByAltText(':media:');
        expect(image).not.toBeNull();
        if (image) {
          fireEvent(image as Element, new Event('load'));
        }
        expect(startSpy).toHaveBeenCalled();
        expect(successSpy).toHaveBeenCalled();
      });

      it('should fail rendered emoji UFO experience when image is failed to load', async () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const successSpy = jest.spyOn(experience, 'success');
        const failureSpy = jest.spyOn(experience, 'failure');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        emojiProviderStub.getMediaEmojiDescriptionURLWithInlineToken.returns(
          Promise.resolve({
            ...mediaEmoji,
            representation: {
              ...mediaEmoji.representation,
              mediaPath: `${mediaEmoji.representation.mediaPath}&token=abc&client=def`,
            },
          }),
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

        const image = result.queryByAltText(':media:');

        expect(image).not.toBeNull();
        if (image) {
          fireEvent(image as Element, new Event('error'));
        }
        expect(startSpy).toHaveBeenCalled();
        expect(successSpy).not.toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalled();
      });

      it('should abort rendered emoji UFO experience on unmount', async () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const abortSpy = jest.spyOn(experience, 'abort');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        emojiProviderStub.getMediaEmojiDescriptionURLWithInlineToken.returns(
          Promise.resolve({
            ...mediaEmoji,
            representation: {
              ...mediaEmoji.representation,
              mediaPath: `${mediaEmoji.representation.mediaPath}&token=abc&client=def`,
            },
          }),
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

        result.unmount();
        expect(startSpy).toHaveBeenCalled();
        expect(abortSpy).toHaveBeenCalled();
      });

      it('should fail rendered emoji UFO experience on render issue', () => {
        const emojiContext = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );

        const startSpy = jest.spyOn(experience, 'start');
        const failureSpy = jest.spyOn(experience, 'failure');

        emojiProviderStub.optimisticMediaRendering.returns(true);
        emojiProviderStub.getMediaEmojiDescriptionURLWithInlineToken.returns(
          Promise.resolve({
            ...mediaEmoji,
            representation: {
              ...mediaEmoji.representation,
              mediaPath: `${mediaEmoji.representation.mediaPath}&token=abc&client=def`,
            },
          }),
        );

        const component = mountWithIntl(
          <EmojiContextProvider emojiContextValue={emojiContext}>
            <CachingEmoji emoji={mediaEmoji} />
          </EmojiContextProvider>,
        );

        const renderError = new Error(`I'm error`);
        component.find('CachingMediaEmoji').simulateError(renderError);

        expect(startSpy).toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalled();
      });
    });
  });
});
