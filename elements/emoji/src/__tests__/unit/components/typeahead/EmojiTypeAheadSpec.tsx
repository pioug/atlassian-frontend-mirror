import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as sinon from 'sinon';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import {
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import waitForExpect from 'wait-for-expect';

import {
  atlassianBoomEmoji,
  blackFlagEmoji,
  getEmojiResourcePromise,
  grinEmoji,
  newEmojiRepository,
  openMouthEmoji,
  standardBoomEmoji,
} from '../../_test-data';
import {
  hasSelector,
  getEmojiTypeAheadItemById,
  getSelectedEmojiTypeAheadItem,
  isEmojiTypeAheadItemSelected,
} from '../../_emoji-selectors';

import { defaultListLimit } from '../../../../util/constants';
import EmojiTypeAhead, {
  Props,
} from '../../../../components/typeahead/EmojiTypeAhead';
import EmojiTypeAheadComponent from '../../../../components/typeahead/EmojiTypeAheadComponent';
import { OnLifecycle } from '../../../../components/typeahead/EmojiTypeAheadComponent';
import EmojiTypeAheadItem from '../../../../components/typeahead/EmojiTypeAheadItem';
import { OptionalEmojiDescription, OnEmojiEvent } from '../../../../types';
import { toEmojiId } from '../../../../util/type-helpers';
import { Props as TypeAheadProps } from '../../../../components/typeahead/EmojiTypeAhead';
import { State as TypeAheadState } from '../../../../components/typeahead/EmojiTypeAheadComponent';
import {
  typeaheadCancelledEvent,
  typeaheadRenderedEvent,
  typeaheadSelectedEvent,
  insertionSucceeded,
  insertionFailed,
} from '../../../../util/analytics';

function setupTypeAhead(props?: Props): Promise<ReactWrapper<any, any>> {
  const component = mount(
    <EmojiTypeAhead
      emojiProvider={
        props && props.emojiProvider
          ? props.emojiProvider
          : getEmojiResourcePromise()
      }
      query=""
      {...props}
    />,
  );

  return waitUntil(() => hasSelector(component, EmojiTypeAheadComponent)).then(
    () => component,
  );
}

const getCreateAnalyticsSpy = (
  spy: (payload: AnalyticsEventPayload) => void,
): CreateUIAnalyticsEvent => {
  const wrapper: CreateUIAnalyticsEvent = ((payload: AnalyticsEventPayload) => {
    spy(payload);
    return {
      fire: (_: string) => {},
    };
  }) as any;

  return wrapper;
};

const withSessionId = ({ attributes, ...rest }: AnalyticsEventPayload) => ({
  attributes: {
    sessionId: expect.any(String),
    ...attributes,
  },
  ...rest,
});

const withEmojiIds = ({ attributes, ...rest }: AnalyticsEventPayload) => ({
  attributes: {
    ...attributes,
    emojiIds: expect.any(Array),
  },
  ...rest,
});

const allEmojis = newEmojiRepository().all().emojis;

const leftClick = {
  button: 0,
};

const findEmojiItems = (component: ReactWrapper) =>
  component.update() && component.find(EmojiTypeAheadItem);
const itemsVisibleCount = (component: ReactWrapper) =>
  findEmojiItems(component).length;
const itemsVisible = (component: ReactWrapper) =>
  itemsVisibleCount(component) > 0;
const doneLoading = (component: ReactWrapper<TypeAheadProps, TypeAheadState>) =>
  component.update() && !component.state('loading');

describe('EmojiTypeAhead', () => {
  it('should display max emoji by default', () =>
    setupTypeAhead().then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(findEmojiItems(component).length).toEqual(defaultListLimit);
      }),
    ));

  it('should limit results to those matching "thumbs"', () =>
    setupTypeAhead({
      query: 'thumbs',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(findEmojiItems(component).length).toEqual(2);
      }),
    ));

  it('should limit result to matching "ball"', () =>
    setupTypeAhead({
      query: 'ball',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(findEmojiItems(component).length).toEqual(2);
      }),
    ));

  it('should change selection when navigating next', () =>
    setupTypeAhead().then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        const secondItemSelected = () =>
          isEmojiTypeAheadItemSelected(component, allEmojis[1].id);
        expect(defaultEmojiShown()).toEqual(true);

        const instance = component.instance() as EmojiTypeAhead;
        instance.selectNext();

        expect(secondItemSelected()).toEqual(true);
      }),
    ));

  it('should change selection when navigating previous', () =>
    setupTypeAhead().then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        const lastItemSelected = () =>
          isEmojiTypeAheadItemSelected(
            component,
            allEmojis[defaultListLimit - 1].id,
          );
        expect(defaultEmojiShown()).toEqual(true);

        const instance = component.instance() as EmojiTypeAhead;
        instance.selectPrevious();

        expect(lastItemSelected()).toEqual(true);
      }),
    ));

  it('should choose current selection when chooseCurrentSelection called', () => {
    let choseEmoji: OptionalEmojiDescription;
    return setupTypeAhead({
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        const secondItemSelected = () =>
          isEmojiTypeAheadItemSelected(component, allEmojis[1].id);
        const chooseSecondItem = () =>
          choseEmoji && choseEmoji.id === allEmojis[1].id;
        expect(defaultEmojiShown()).toEqual(true);

        const instance = component.instance() as EmojiTypeAhead;
        instance.selectNext();
        expect(secondItemSelected()).toEqual(true);

        instance.chooseCurrentSelection();
        expect(chooseSecondItem()).toEqual(true);
      }),
    );
  });

  it('should choose clicked selection when item clicked', async () => {
    let choseEmoji: OptionalEmojiDescription;
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    const emojiProvider = getEmojiResourcePromise();
    let selectionRecorded = false;

    const component = await setupTypeAhead({
      emojiProvider,
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
    } as Props);

    await waitUntil(() => doneLoading(component));

    const provider = await emojiProvider;

    provider.recordSelection = () => {
      selectionRecorded = true;
      return Promise.resolve();
    };

    const defaultEmojiShown = () =>
      findEmojiItems(component).length === defaultListLimit;
    const chooseThirdItem = () =>
      choseEmoji && choseEmoji.id === allEmojis[2].id;

    expect(defaultEmojiShown()).toEqual(true);

    const item = getEmojiTypeAheadItemById(component, allEmojis[2].id);
    item.simulate('mousedown', leftClick);
    expect(chooseThirdItem()).toEqual(true);
    expect(fireEventSpy).toHaveBeenCalledWith(
      expect.objectContaining(
        withEmojiIds(
          withSessionId(
            typeaheadSelectedEvent(
              false,
              expect.any(Number),
              choseEmoji!,
              allEmojis,
            ),
          ),
        ),
      ),
    );

    await waitUntil(() => selectionRecorded);
    expect(fireEventSpy).toHaveBeenLastCalledWith(
      expect.objectContaining(withSessionId(insertionSucceeded('typeahead'))),
    );
  });

  it('should fire insertion failed event if provider recordSelection fails', async () => {
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    const emojiProvider = getEmojiResourcePromise();
    let failureOccurred = false;

    const component = await setupTypeAhead({
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
      emojiProvider,
    } as Props);
    await waitUntil(() => doneLoading(component));

    const provider = await emojiProvider;

    provider.recordSelection = () => {
      failureOccurred = true;
      return Promise.reject();
    };
    const item = getEmojiTypeAheadItemById(component, allEmojis[2].id);
    item.simulate('mousedown', leftClick);

    await waitUntil(() => failureOccurred);
    await waitForExpect(() => {
      expect(fireEventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining(withSessionId(insertionFailed('typeahead'))),
      );
    });
  });

  it('should record selection on EmojiProvider even with no onSelection property', (done) => {
    const emojiResourcePromise = getEmojiResourcePromise();
    return setupTypeAhead({
      emojiProvider: emojiResourcePromise,
    }).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        expect(defaultEmojiShown()).toEqual(true);

        const item = getEmojiTypeAheadItemById(component, allEmojis[2].id);
        item.simulate('mousedown', leftClick);

        // now ensure the MockEmojiProvider was called and records selection
        emojiResourcePromise.then((provider) => {
          expect(provider.recordedSelections).toHaveLength(1);
          expect(provider.recordedSelections[0].shortName).toEqual(
            allEmojis[2].shortName,
          );
          done();
        });
      }),
    );
  });

  it('should record selection on EmojiProvider and call onSelection property', (done) => {
    let choseEmoji: OptionalEmojiDescription;

    const emojiResourcePromise = getEmojiResourcePromise();
    return setupTypeAhead({
      emojiProvider: emojiResourcePromise,
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
    }).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        const chooseThirdItem = () =>
          choseEmoji && choseEmoji.id === allEmojis[2].id;
        expect(defaultEmojiShown()).toEqual(true);

        const item = getEmojiTypeAheadItemById(component, allEmojis[2].id);
        item.simulate('mousedown', leftClick);
        expect(chooseThirdItem()).toEqual(true);

        // now ensure the MockEmojiProvider was also called and records selection
        emojiResourcePromise.then((provider) => {
          expect(provider.recordedSelections).toHaveLength(1);
          expect(provider.recordedSelections[0].shortName).toEqual(
            allEmojis[2].shortName,
          );
          done();
        });
      }),
    );
  });

  it('should fire onOpen on initial display', () => {
    const onOpen = sinon.spy();
    const onClose = sinon.spy();

    return setupTypeAhead({
      onOpen: onOpen as OnLifecycle,
      onClose: onClose as OnLifecycle,
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        expect(defaultEmojiShown()).toEqual(true);
        expect(onOpen.callCount).toEqual(1);
        expect(onClose.callCount).toEqual(0);
      }),
    );
  });

  it('should fire onOpen when first result shown', () => {
    const onOpen = sinon.spy();
    const onClose = sinon.spy();

    return setupTypeAhead({
      onOpen: onOpen as OnLifecycle,
      onClose: onClose as OnLifecycle,
      query: 'zeroresults',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const noEmojiShown = () => findEmojiItems(component).length === 0;
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        expect(noEmojiShown()).toEqual(true);
        expect(onOpen.callCount).toEqual(1);
        expect(onClose.callCount).toEqual(1);
        component.setProps({ query: '' });

        return waitUntil(() => itemsVisible(component)).then(() => {
          expect(defaultEmojiShown()).toEqual(true);
          expect(onOpen.callCount).toEqual(2);
          expect(onClose.callCount).toEqual(1);
        });
      }),
    );
  });

  it('should fire onClose when no matches', () => {
    const onOpen = sinon.spy();
    const onClose = sinon.spy();

    return setupTypeAhead({
      onOpen: onOpen as OnLifecycle,
      onClose: onClose as OnLifecycle,
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const defaultEmojiShown = () =>
          findEmojiItems(component).length === defaultListLimit;
        const noEmojiShown = () => findEmojiItems(component).length === 0;
        expect(defaultEmojiShown()).toEqual(true);
        expect(onOpen.callCount).toEqual(1);
        expect(onClose.callCount).toEqual(0);
        component.setProps({ query: 'zeroresults' });

        return waitUntil(() => !itemsVisible(component)).then(() => {
          expect(noEmojiShown()).toEqual(true);
          expect(onOpen.callCount).toEqual(1);
          expect(onClose.callCount).toEqual(1);
        });
      }),
    );
  });

  it('should fire cancelled analytic when unmounted', () => {
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    return setupTypeAhead({
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(fireEventSpy).toHaveBeenCalledWith(
          withEmojiIds(
            withSessionId(typeaheadRenderedEvent(expect.any(Number))),
          ),
        );
        component.unmount();
        expect(fireEventSpy).toHaveBeenCalledWith(
          withEmojiIds(
            withSessionId(typeaheadCancelledEvent(expect.any(Number))),
          ),
        );
      }),
    );
  });

  it('should find two matches when querying "boom"', () =>
    // Confirm initial state for later conflicting shortName tests
    setupTypeAhead({
      query: 'boom',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(findEmojiItems(component).length).toEqual(2);
      }),
    ));

  it('should highlight emojis by matching on id then falling back to shortName', () => {
    const standardBoomId = toEmojiId(standardBoomEmoji);

    return setupTypeAhead({
      query: 'boom',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const item = getEmojiTypeAheadItemById(component, standardBoomEmoji.id);
        item.prop('onMouseMove')(
          standardBoomId,
          standardBoomEmoji,
          item.simulate('mouseover'),
        );
        expect(
          isEmojiTypeAheadItemSelected(component, standardBoomEmoji.id),
        ).toEqual(true);
      }),
    );
  });

  it('should highlight correct emoji regardless of conflicting shortName', () => {
    const atlassianBoomId = toEmojiId(atlassianBoomEmoji);

    return setupTypeAhead({
      query: 'boom',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const item = getEmojiTypeAheadItemById(
          component,
          atlassianBoomEmoji.id,
        );
        item.prop('onMouseMove')(
          atlassianBoomId,
          atlassianBoomEmoji,
          item.simulate('mouseover'),
        );
        expect(
          isEmojiTypeAheadItemSelected(component, atlassianBoomEmoji.id),
        ).toEqual(true);
      }),
    );
  });

  it('should retain selected match across search refinement', () => {
    const blackFlagId = toEmojiId(blackFlagEmoji);

    return setupTypeAhead({
      query: 'fla',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        let item = getEmojiTypeAheadItemById(component, blackFlagId.id);
        item.prop('onMouseMove')(
          blackFlagId,
          blackFlagEmoji,
          item.simulate('mouseover'),
        );
        expect(isEmojiTypeAheadItemSelected(component, blackFlagId.id)).toEqual(
          true,
        );

        const itemCount = itemsVisibleCount(component);
        component.setProps({ query: 'flag_b' });

        return waitUntil(() => itemsVisibleCount(component) < itemCount).then(
          () => {
            expect(
              isEmojiTypeAheadItemSelected(component, blackFlagId.id),
            ).toEqual(true);
          },
        );
      }),
    );
  });

  it('should default to exact ascii selection first', () =>
    setupTypeAhead({
      query: ':O',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(itemsVisibleCount(component) > 1).toEqual(true);
        expect(
          isEmojiTypeAheadItemSelected(component, openMouthEmoji.id),
        ).toEqual(true);
      }),
    ));

  it('should fire onSelection if a query ends in a colon and has an exact match with one emoji shortName', () => {
    const onSelection = sinon.spy();
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    return setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':grin:',
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(onSelection.callCount).toEqual(1);
        expect(fireEventSpy).toHaveBeenCalledWith(
          expect.objectContaining(
            withEmojiIds(
              withSessionId(
                typeaheadSelectedEvent(
                  true,
                  expect.any(Number),
                  grinEmoji,
                  [grinEmoji],
                  ':grin:',
                  true,
                ),
              ),
            ),
          ),
        );
      }),
    );
  });

  it('should not fire onSelection if a query ends in a colon and more than one emoji has an exact shortName match', () => {
    const onSelection = sinon.spy();

    return setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':boom:',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(itemsVisibleCount(component) > 1).toEqual(true);
        expect(onSelection.callCount).toEqual(0);
      }),
    );
  });

  it('should not fire onSelection if a query ends in a colon and an odd number of emoji have an exact shortName match', () => {
    const onSelection = sinon.spy();

    return setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':ftfy:',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(
          itemsVisibleCount(component) > 1 &&
            itemsVisibleCount(component) % 2 === 1,
        ).toEqual(true);
        expect(onSelection.callCount).toEqual(0);
      }),
    );
  });

  it('should not fire onSelection if a query ends in a colon and no emojis have an exact shortName match', () => {
    const onSelection = sinon.spy();

    return setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':blah:',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        const noEmojiShown = () => findEmojiItems(component).length === 0;
        expect(noEmojiShown()).toEqual(true);
        expect(onSelection.callCount).toEqual(0);
      }),
    );
  });

  it('should perform case insensitive exact shortName matching', () => {
    const onSelection = sinon.spy();

    return setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':GRIN:',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(onSelection.callCount).toEqual(1);
      }),
    );
  });

  it('should display emojis without skin tone variations by default', () => {
    return setupTypeAhead({
      query: 'raised_hand',
    } as Props).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(itemsVisibleCount(component) === 1).toEqual(true);
        const typeaheadEmoji = getSelectedEmojiTypeAheadItem(component).prop(
          'emoji',
        );
        expect(typeaheadEmoji.shortName).toEqual(':raised_hand:');
      }),
    );
  });

  it('should display emojis using the skin tone preference provided by the EmojiResource', () => {
    const emojiProvider = getEmojiResourcePromise();
    emojiProvider.then((provider) => provider.setSelectedTone(1));

    return setupTypeAhead({
      emojiProvider,
      query: 'raised_hand',
    }).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(itemsVisibleCount(component) === 1).toEqual(true);
        const typeaheadEmoji = getSelectedEmojiTypeAheadItem(component).prop(
          'emoji',
        );
        expect(typeaheadEmoji.shortName).toEqual(':raised_hand::skin-tone-2:');
      }),
    );
  });

  it('should include skin tone details for analytics', () => {
    let choseEmoji: OptionalEmojiDescription;
    const emojiProvider = getEmojiResourcePromise();
    emojiProvider.then((provider) => provider.setSelectedTone(5));
    const fireEventSpy = jest.fn();

    return setupTypeAhead({
      emojiProvider,
      query: 'raised_hand',
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
    }).then((component) =>
      waitUntil(() => doneLoading(component)).then(() => {
        expect(itemsVisibleCount(component) === 1).toEqual(true);
        const typeaheadEmoji = getSelectedEmojiTypeAheadItem(component).prop(
          'emoji',
        );
        expect(typeaheadEmoji.shortName).toEqual(':raised_hand::skin-tone-6:');
        const item = getEmojiTypeAheadItemById(component, '270b-1f3ff');
        item.simulate('mousedown', leftClick);
        expect(fireEventSpy).toHaveBeenCalledWith(
          expect.objectContaining(
            withEmojiIds(
              withSessionId(
                typeaheadSelectedEvent(
                  false,
                  expect.any(Number),
                  choseEmoji!,
                  [choseEmoji!],
                  'raised_hand',
                  false,
                ),
              ),
            ),
          ),
        );
        expect(fireEventSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            attributes: expect.objectContaining({
              skinToneModifier: 'dark',
              baseEmojiId: '270b',
            }),
          }),
        );
      }),
    );
  });
});
