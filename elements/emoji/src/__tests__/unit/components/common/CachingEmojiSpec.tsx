import React from 'react';
import PropTypes from 'prop-types';
import * as sinon from 'sinon';
import { mount, MountRendererProps } from 'enzyme';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import EmojiResource from '../../../../api/EmojiResource';
import CachingEmoji, {
  CachingMediaEmoji,
} from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import { hasSelector } from '../../_emoji-selectors';
import {
  imageEmoji,
  loadedMediaEmoji,
  mediaEmoji,
  missingMediaEmoji,
} from '../../_test-data';

import { ufoExperiences } from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import * as samplingUfo from '../../../../util/analytics/samplingUfo';

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
    it('CachingMediaEmoji not used, just an Emoji rendered', () => {
      const component = mount(<CachingEmoji emoji={imageEmoji} />);
      expect(component.find(CachingMediaEmoji).length).toEqual(0);
      expect(component.find(Emoji).length).toEqual(1);
    });
  });

  describe('Media emoji', () => {
    let contextOptions: MountRendererProps;
    let emojiProviderStub: sinon.SinonStubbedInstance<EmojiResource>;

    beforeEach(() => {
      emojiProviderStub = sinon.createStubInstance(EmojiResource);
      mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP = 1;
      samplingUfo.clearSampled();
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
      jest.clearAllMocks();
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

    it('should success rendered emoji UFO experience', () => {
      const experience = ufoExperiences['emoji-rendered'].getInstance(
        mediaEmoji.id || mediaEmoji.shortName,
      );
      const startSpy = jest.spyOn(experience, 'start');
      const successSpy = jest.spyOn(experience, 'success');
      emojiProviderStub.optimisticMediaRendering.returns(true);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
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
      const component = mount(
        <CachingEmoji emoji={missingMediaEmoji} />,
        contextOptions,
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
      const component = mount(
        <CachingEmoji emoji={missingMediaEmoji} />,
        contextOptions,
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
      const component = mount(
        <CachingEmoji emoji={missingMediaEmoji} />,
        contextOptions,
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

    it('should fail rendered emoji UFO experience on render issue', async () => {
      const experience = ufoExperiences['emoji-rendered'].getInstance(
        mediaEmoji.id || mediaEmoji.shortName,
      );
      const startSpy = jest.spyOn(experience, 'start');
      const failureSpy = jest.spyOn(experience, 'failure');
      emojiProviderStub.optimisticMediaRendering.returns(true);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      const renderError = new Error(`I'm error`);
      component.find(Emoji).simulateError(renderError);
      expect(startSpy).toHaveBeenCalled();
      expect(failureSpy).toHaveBeenCalled();
    });

    it('should abort rendered emoji UFO experience on unmount', () => {
      const experience = ufoExperiences['emoji-rendered'].getInstance(
        mediaEmoji.id || mediaEmoji.shortName,
      );
      const startSpy = jest.spyOn(experience, 'start');
      const abortSpy = jest.spyOn(experience, 'abort');
      emojiProviderStub.optimisticMediaRendering.returns(true);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      component.unmount();
      expect(startSpy).toHaveBeenCalled();
      expect(abortSpy).toHaveBeenCalled();
    });
  });
});
