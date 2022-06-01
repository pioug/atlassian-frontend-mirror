import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { render } from '@testing-library/react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import { EmojiDescription } from '../../../../types';
import Emoji from '../../../../components/common/Emoji';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import { EmojiProvider } from '../../../../api/EmojiResource';

import {
  evilburnsEmoji,
  grinEmoji,
  getEmojiResourcePromise,
  mediaEmoji,
} from '../../_test-data';

import { ufoExperiences } from '../../../../util/analytics';
import * as constants from '../../../../util/constants';
import * as samplingUfo from '../../../../util/analytics/samplingUfo';
import CachingEmoji from '../../../../components/common/CachingEmoji';

const findEmoji = (component: ReactWrapper) =>
  component.update() && component.find(Emoji);
const emojiVisible = (component: ReactWrapper) =>
  findEmoji(component).length === 1;
const emojiVisibleById = (component: ReactWrapper, id: string) =>
  emojiVisible(component) && findEmoji(component).prop('emoji').id === id;
const emojiPlaceHolderVisible = (component: ReactWrapper) =>
  component.update() && component.find(EmojiPlaceholder).length === 1;

jest.mock('../../../../util/constants', () => {
  const originalModule = jest.requireActual('../../../../util/constants');
  return {
    ...originalModule,
    SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI: 1,
  };
});

const mockConstants = constants as {
  SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI: number;
  SAMPLING_RATE_EMOJI_RENDERED_EXP: number;
};

describe('<ResourcedEmoji />', () => {
  beforeEach(() => {
    mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP_RESOURCEEMOJI = 1;
    mockConstants.SAMPLING_RATE_EMOJI_RENDERED_EXP = 1;
    samplingUfo.clearSampled();
    jest.clearAllMocks();
  });

  it('should render emoji', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
    });
  });

  it('should render emoji with correct data attributes', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-id')!.value,
      ).toEqual(grinEmoji.id);
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-short-name')!.value,
      ).toEqual('shouldnotbeused');
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-text')!.value,
      ).toEqual('shouldnotbeused');
    });
  });

  it('should not wrap with a tooltip if there is no showTooltip prop', async () => {
    const result = await render(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={grinEmoji}
      />,
    );

    mockAllIsIntersecting(true);

    const component = await result.findByTestId(
      `sprite-emoji-${grinEmoji.shortName}`,
    );
    expect(component).toHaveAttribute('title', '');
  });

  it('should wrap with tooltip if showTooltip is set to true', async () => {
    const result = await render(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={grinEmoji}
        showTooltip={true}
      />,
    );
    mockAllIsIntersecting(true);
    const component = await result.findByTestId(
      `sprite-emoji-${grinEmoji.shortName}`,
    );
    expect(component).toHaveAttribute('title', ':grin:');
  });

  it('should fallback to shortName if no id', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: grinEmoji.shortName }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
    });
  });

  it('should update emoji on shortName change', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: grinEmoji.shortName }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
      component.setProps({
        emojiId: { shortName: evilburnsEmoji.shortName },
      });

      return waitUntil(() =>
        emojiVisibleById(component, evilburnsEmoji.id),
      ).then(() => {
        expect(findEmoji(component).prop('emoji').id).toEqual(
          evilburnsEmoji.id,
        );
      });
    });
  });

  it('unknown emoji', () => {
    let resolver: (value?: any | PromiseLike<any>) => void;
    // @ts-ignore Unused var never read, should this be deleted?
    let resolverResult;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise((resolve) => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
      />,
    );

    return waitUntil(() => !!resolver).then(() => {
      resolver();
      return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
        expect(true).toEqual(true);
      });
    });
  });

  it('placeholder while loading emoji', () => {
    let resolver: (value?: any | PromiseLike<any>) => void;
    let resolverResult: EmojiDescription;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise((resolve) => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: grinEmoji.shortName, id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => !!resolver).then(() => {
      return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
        resolver(resolverResult);
        return waitUntil(() => emojiVisible(component)).then(() => {
          expect(findEmoji(component).prop('emoji').id).toEqual(grinEmoji.id);
        });
      });
    });
  });

  it('placeholder should be wrapped with a tooltip if showTooltip is set to true', () => {
    // @ts-ignore Unused var never read, should this be deleted?
    let resolver;
    // @ts-ignore Unused var never read, should this be deleted?
    let resolverResult;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise((resolve) => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
        showTooltip={true}
      />,
    );

    return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
      const placeholder = component.find(EmojiPlaceholder);
      expect(placeholder.childAt(0).prop('title')).toBeDefined();
    });
  });

  it('should mark success for UFO experience of rendered emoji event when emoji is loaded', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const successSpy = jest.spyOn(experience, 'success');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      mockAllIsIntersecting(true);
      findEmoji(component).find('img').simulate('load');
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(successSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should mark failure for UFO experience of rendered emoji event when emoji is on error', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const failSpy = jest.spyOn(experience, 'failure');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      mockAllIsIntersecting(true);
      findEmoji(component).find('img').simulate('error');
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(failSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should fail UFO experience of rendered emoji event when emoji have rendering issues', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const failureSpy = jest.spyOn(experience, 'failure');

    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      component.find(CachingEmoji).simulateError(new Error('test error'));
      expect(startSpy).toHaveBeenCalledTimes(1);
      expect(failureSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('should abort UFO experience of rendered emoji event when emoji is unmounted', () => {
    const experience = ufoExperiences['emoji-rendered'].getInstance(
      mediaEmoji.id || mediaEmoji.shortName,
    );
    const startSpy = jest.spyOn(experience, 'start');
    const abortSpy = jest.spyOn(experience, 'abort');
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        emojiId={{ shortName: mediaEmoji.id, id: mediaEmoji.id }}
      />,
    );

    component.unmount();

    expect(startSpy).toHaveBeenCalledTimes(1);
    expect(abortSpy).toHaveBeenCalledTimes(1);
  });
});
