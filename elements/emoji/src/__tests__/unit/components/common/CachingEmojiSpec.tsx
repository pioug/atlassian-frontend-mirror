import React from 'react';
import * as sinon from 'sinon';
import { render } from '@testing-library/react';
import CachingEmoji, {
  CachingMediaEmoji,
} from '../../../../components/common/CachingEmoji';
import EmojiResource from '../../../../api/EmojiResource';
import { EmojiContextProvider } from '../../../../context/EmojiContextProvider';
import {
  imageEmoji,
  mediaEmoji,
  loadedMediaEmoji,
  missingMediaEmoji,
} from '../../_test-data';
import { EmojiContextType } from '../../../../context/EmojiContext';
import { EmojiDescription } from '../../../../types';

import { ufoExperiences } from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import * as samplingUfo from '../../../../util/analytics/samplingUfo';
import { mount } from 'enzyme';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { hasSelector } from '../../_emoji-selectors';
import { Emoji } from '../../../../components/common/Emoji';

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
        mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP = 1;
        samplingUfo.clearSampled();
        jest.clearAllMocks();
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

      it('should success rendered emoji UFO experience', () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const successSpy = jest.spyOn(experience, 'success');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const component = mount(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={mediaEmoji} />
          </EmojiContextProvider>,
        );
        return waitUntil(() => hasSelector(component, Emoji)).then(() => {
          const emoji = component.find(Emoji);
          expect(emoji.length).toEqual(1);
          emoji.find('img').simulate('load');
          expect(startSpy).toHaveBeenCalled();
          expect(successSpy).toHaveBeenCalled();
        });
      });

      it('should fail rendered emoji UFO experience when image is failed to load', () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          missingMediaEmoji.id || missingMediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const successSpy = jest.spyOn(experience, 'success');
        const failureSpy = jest.spyOn(experience, 'failure');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const component = mount(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={missingMediaEmoji} />
          </EmojiContextProvider>,
        );
        expect(component.find(CachingMediaEmoji).length).toEqual(1);
        return waitUntil(() => hasSelector(component, Emoji)).then(() => {
          const emoji = component.find(Emoji);
          emoji.find('img').simulate('error');
          expect(startSpy).toHaveBeenCalled();
          expect(successSpy).not.toHaveBeenCalled();
          expect(failureSpy).toHaveBeenCalled();
        });
      });

      it('Failed to Loads emoji via cache (promise) if optimistic rendering false', async () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          missingMediaEmoji.id || missingMediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const successSpy = jest.spyOn(experience, 'success');
        const failureSpy = jest.spyOn(experience, 'failure');
        emojiProviderStub.optimisticMediaRendering.returns(false);
        emojiProviderStub.loadMediaEmoji.returns(Promise.reject());
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const component = mount(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={missingMediaEmoji} />
          </EmojiContextProvider>,
        );
        expect(component.find(CachingMediaEmoji).length).toEqual(1);
        await new Promise((r) => setTimeout(r, 1000));
        const emoji = component.find(Emoji);
        expect(emoji.length).toEqual(0);
        expect(startSpy).toHaveBeenCalled();
        expect(successSpy).not.toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalled();
      });

      it('should fail rendered emoji UFO experience when image is failed to load', () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          missingMediaEmoji.id || missingMediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const successSpy = jest.spyOn(experience, 'success');
        const failureSpy = jest.spyOn(experience, 'failure');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const component = mount(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={missingMediaEmoji} />
          </EmojiContextProvider>,
        );
        expect(component.find(CachingMediaEmoji).length).toEqual(1);
        return waitUntil(() => hasSelector(component, Emoji)).then(() => {
          const emoji = component.find(Emoji);
          emoji.find('img').simulate('error');
          expect(startSpy).toHaveBeenCalled();
          expect(successSpy).not.toHaveBeenCalled();
          expect(failureSpy).toHaveBeenCalled();
        });
      });

      it('shoud fail rendered emoji UFO experience on render issue', async () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const failureSpy = jest.spyOn(experience, 'failure');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const component = mount(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={mediaEmoji} />
          </EmojiContextProvider>,
        );
        const renderError = new Error(`I'm error`);
        component.find(Emoji).simulateError(renderError);
        expect(startSpy).toHaveBeenCalled();
        expect(failureSpy).toHaveBeenCalled();
      });

      it('shoud abort rendered emoji UFO experience on unmount', () => {
        const experience = ufoExperiences['emoji-rendered'].getInstance(
          mediaEmoji.id || mediaEmoji.shortName,
        );
        const startSpy = jest.spyOn(experience, 'start');
        const abourtSpy = jest.spyOn(experience, 'abort');
        emojiProviderStub.optimisticMediaRendering.returns(true);
        const emojiContextValue = {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        };
        const component = mount(
          <EmojiContextProvider emojiContextValue={emojiContextValue}>
            <CachingEmoji emoji={mediaEmoji} />
          </EmojiContextProvider>,
        );
        component.unmount();
        expect(startSpy).toHaveBeenCalled();
        expect(abourtSpy).toHaveBeenCalled();
      });
    });
  });
});
