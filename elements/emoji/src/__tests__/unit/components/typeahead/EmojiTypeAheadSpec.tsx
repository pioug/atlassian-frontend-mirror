import type {
  AnalyticsEventPayload,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import React, { createRef } from 'react';
import waitForExpect from 'wait-for-expect';

import {
  getEmojiTypeAheadItemById,
  getSelectedEmojiTypeAheadItem,
  isEmojiTypeAheadItemSelected,
} from '../../_emoji-selectors';
import {
  atlassianBoomEmoji,
  blackFlagEmoji,
  getEmojiResourcePromise,
  grinEmoji,
  newEmojiRepository,
  openMouthEmoji,
  standardBoomEmoji,
} from '../../_test-data';

import { type RenderResult, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmojiTypeAhead, {
  type Props,
} from '../../../../components/typeahead/EmojiTypeAhead';
import type { OnLifecycle } from '../../../../components/typeahead/EmojiTypeAheadComponent';
import type { OnEmojiEvent, OptionalEmojiDescription } from '../../../../types';
import {
  recordFailed,
  recordSucceeded,
  typeaheadCancelledEvent,
  typeaheadRenderedEvent,
  typeaheadSelectedEvent,
  ufoExperiences,
} from '../../../../util/analytics';
import { defaultListLimit } from '../../../../util/constants';
import { renderWithIntl } from '../../_testing-library';

const emojiTypeAheadRef = createRef<EmojiTypeAhead>();

const setupTypeAhead = async (props?: Partial<Props>): Promise<RenderResult> =>
  renderWithIntl(
    <EmojiTypeAhead
      emojiProvider={
        props && props.emojiProvider
          ? props.emojiProvider
          : getEmojiResourcePromise()
      }
      query=""
      ref={emojiTypeAheadRef}
      {...props}
    />,
  );

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

const findEmojiItems = async (container: RenderResult['container']) => {
  await screen.findAllByRole('img'); // Make sure they're all loaded
  return container.querySelectorAll('.ak-emoji-typeahead-item');
};

const itemsVisibleCount = async (container: RenderResult['container']) =>
  (await findEmojiItems(container)).length;

const itemsVisible = async (container: RenderResult['container']) =>
  (await itemsVisibleCount(container)) > 0;

describe('EmojiTypeAhead', () => {
  const emojiRecordUFO = ufoExperiences['emoji-selection-recorded'];
  const ufoEmojiRecordedStartSpy = jest.spyOn(emojiRecordUFO, 'start');
  const ufoEmojiRecordedSuccessSpy = jest.spyOn(emojiRecordUFO, 'success');
  const ufoEmojiRecordedFailureSpy = jest.spyOn(emojiRecordUFO, 'failure');

  afterEach(jest.clearAllMocks);

  it('should display max emoji by default', async () => {
    const { container } = await setupTypeAhead();
    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);
  });

  it('should limit results to those matching "thumbs"', async () => {
    const { container } = await setupTypeAhead({
      query: 'thumbs',
    });
    const emojiItems = await findEmojiItems(container);
    expect(emojiItems.length).toEqual(2);
  });

  it('should limit result to matching "ball"', async () => {
    const { container } = await setupTypeAhead({
      query: 'ball',
    });
    const emojiItems = await findEmojiItems(container);
    expect(emojiItems.length).toEqual(2);
  });

  it('should change selection when navigating next', async () => {
    const { container } = await setupTypeAhead();

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    // First emoji selected
    await isEmojiTypeAheadItemSelected(container, allEmojis[0].shortName);
    emojiTypeAheadRef.current?.selectNext();
    // Second emoji selected
    await waitFor(() =>
      isEmojiTypeAheadItemSelected(container, allEmojis[1].shortName),
    );
  });

  it('should change selection when navigating previous', async () => {
    const { container } = await setupTypeAhead();

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    emojiTypeAheadRef.current?.selectPrevious();
    // Last emoji selected
    await waitFor(() =>
      isEmojiTypeAheadItemSelected(
        container,
        allEmojis[defaultListLimit - 1].shortName,
      ),
    );
  });

  it('should choose current selection when chooseCurrentSelection called', async () => {
    let choseEmoji: OptionalEmojiDescription;
    const { container } = await setupTypeAhead({
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
    });

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    emojiTypeAheadRef.current?.selectNext();
    // Second emoji selected
    await waitFor(() =>
      isEmojiTypeAheadItemSelected(container, allEmojis[1].shortName),
    );

    emojiTypeAheadRef.current?.chooseCurrentSelection();
    await waitFor(() => expect(choseEmoji?.id).toEqual(allEmojis[1].id));
  });

  it('should choose clicked selection when item clicked', async () => {
    let choseEmoji: OptionalEmojiDescription;
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    const emojiProvider = getEmojiResourcePromise();
    let selectionRecorded = false;

    const { container } = await setupTypeAhead({
      emojiProvider,
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
    });

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    const provider = await emojiProvider;

    provider.recordSelection = () => {
      selectionRecorded = true;
      return Promise.resolve();
    };

    const item = await getEmojiTypeAheadItemById(
      container,
      allEmojis[2].shortName,
    );
    await userEvent.click(item);

    expect(choseEmoji?.shortName).toEqual(allEmojis[2].shortName);
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

    await waitFor(() => expect(selectionRecorded).toBe(true));
    expect(fireEventSpy).toHaveBeenLastCalledWith(
      expect.objectContaining(withSessionId(recordSucceeded('typeahead'))),
    );

    expect(ufoEmojiRecordedStartSpy).toBeCalled();
    expect(ufoEmojiRecordedSuccessSpy).toBeCalled();
    expect(ufoEmojiRecordedFailureSpy).not.toBeCalled();
  });

  it('should fire insertion failed event if provider recordSelection fails', async () => {
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    const emojiProvider = getEmojiResourcePromise();
    let failureOccurred = false;

    const { container } = await setupTypeAhead({
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
      emojiProvider,
    });
    await findEmojiItems(container);

    const provider = await emojiProvider;

    provider.recordSelection = () => {
      failureOccurred = true;
      return Promise.reject({ code: 403, reason: 'Forbidden' });
    };

    const item = await getEmojiTypeAheadItemById(
      container,
      allEmojis[2].shortName,
    );
    await userEvent.click(item);

    await waitFor(() => expect(failureOccurred).toBe(true));
    await waitForExpect(() => {
      expect(fireEventSpy).toHaveBeenLastCalledWith(
        expect.objectContaining(withSessionId(recordFailed('typeahead'))),
      );

      expect(ufoEmojiRecordedStartSpy).toBeCalled();
      expect(ufoEmojiRecordedSuccessSpy).not.toBeCalled();
      expect(ufoEmojiRecordedFailureSpy).toBeCalled();
    });
  });

  it('should record selection on EmojiProvider even with no onSelection property', async () => {
    const emojiResourcePromise = getEmojiResourcePromise();
    const { container } = await setupTypeAhead({
      emojiProvider: emojiResourcePromise,
    });

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    const item = await getEmojiTypeAheadItemById(
      container,
      allEmojis[2].shortName,
    );
    await userEvent.click(item);

    // now ensure the MockEmojiProvider was called and records selection
    const provider = await emojiResourcePromise;

    expect(provider.recordedSelections).toHaveLength(1);
    expect(provider.recordedSelections[0].shortName).toEqual(
      allEmojis[2].shortName,
    );
  });

  it('should record selection on EmojiProvider and call onSelection property', async () => {
    let choseEmoji: OptionalEmojiDescription;

    const emojiResourcePromise = getEmojiResourcePromise();
    const { container } = await setupTypeAhead({
      emojiProvider: emojiResourcePromise,
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
    });

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    const item = await getEmojiTypeAheadItemById(
      container,
      allEmojis[2].shortName,
    );
    await userEvent.click(item);
    expect(choseEmoji?.id).toEqual(allEmojis[2].id);

    // now ensure the MockEmojiProvider was also called and records selection
    const provider = await emojiResourcePromise;
    expect(provider.recordedSelections).toHaveLength(1);
    expect(provider.recordedSelections[0].shortName).toEqual(
      allEmojis[2].shortName,
    );
  });

  it('should fire onOpen on initial display', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    const { container } = await setupTypeAhead({
      onOpen: onOpen as OnLifecycle,
      onClose: onClose as OnLifecycle,
    });

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should fire onOpen when first result shown', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();
    const emojiProvider = getEmojiResourcePromise();

    const { rerender, container } = await setupTypeAhead({
      onOpen: onOpen as OnLifecycle,
      onClose: onClose as OnLifecycle,
      query: 'zeroresults',
      emojiProvider,
    });

    let emojiItems = container.querySelectorAll('.ak-emoji-typeahead-item');
    expect(emojiItems.length).toBe(0);

    await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
    expect(onClose).toHaveBeenCalledTimes(1);
    rerender(
      <EmojiTypeAhead
        emojiProvider={emojiProvider}
        query=""
        ref={emojiTypeAheadRef}
        onOpen={onOpen as OnLifecycle}
        onClose={onClose as OnLifecycle}
      />,
    );

    emojiItems = await findEmojiItems(container);
    await waitFor(async () => expect(await itemsVisible(container)).toBe(true));

    expect(emojiItems).toHaveLength(defaultListLimit);
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should fire onClose when no matches', async () => {
    const onOpen = jest.fn();
    const onClose = jest.fn();

    const emojiProvider = getEmojiResourcePromise();
    const { rerender, container } = await setupTypeAhead({
      onOpen: onOpen as OnLifecycle,
      onClose: onClose as OnLifecycle,
      emojiProvider,
    });

    let emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(defaultListLimit);

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    rerender(
      <EmojiTypeAhead
        emojiProvider={emojiProvider}
        query="zeroresults"
        ref={emojiTypeAheadRef}
        onOpen={onOpen as OnLifecycle}
        onClose={onClose as OnLifecycle}
      />,
    );

    await waitFor(() =>
      expect(
        container.querySelector('.ak-emoji-typeahead-item'),
      ).not.toBeInTheDocument(),
    );
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should fire cancelled analytic when unmounted', async () => {
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    const { unmount } = await setupTypeAhead({
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
    });
    await waitFor(() =>
      expect(fireEventSpy).toHaveBeenCalledWith(
        withEmojiIds(withSessionId(typeaheadRenderedEvent(expect.any(Number)))),
      ),
    );
    unmount();
    expect(fireEventSpy).toHaveBeenCalledWith(
      withEmojiIds(withSessionId(typeaheadCancelledEvent(expect.any(Number)))),
    );
  });

  it('should find two matches when querying "boom"', async () => {
    // Confirm initial state for later conflicting shortName tests
    const { container } = await setupTypeAhead({
      query: 'boom',
    });

    const emojiItems = await findEmojiItems(container);
    expect(emojiItems).toHaveLength(2);
  });

  it('should highlight emojis by matching on id then falling back to shortName', async () => {
    const { container } = await setupTypeAhead({
      query: 'boom',
    });
    await findEmojiItems(container);

    const item = await getEmojiTypeAheadItemById(
      container,
      standardBoomEmoji.shortName,
    );
    userEvent.hover(item);

    await isEmojiTypeAheadItemSelected(container, standardBoomEmoji.shortName);
  });

  it('should highlight correct emoji regardless of conflicting shortName', async () => {
    const { container } = await setupTypeAhead({
      query: 'boom',
    });
    await findEmojiItems(container);

    const item = await getEmojiTypeAheadItemById(
      container,
      atlassianBoomEmoji.shortName,
    );
    await userEvent.hover(item);

    await isEmojiTypeAheadItemSelected(container, atlassianBoomEmoji.shortName);
  });

  it('should retain selected match across search refinement', async () => {
    const emojiProvider = getEmojiResourcePromise();
    const { container, rerender } = await setupTypeAhead({
      query: 'fla',
      emojiProvider,
    });
    await findEmojiItems(container);

    let item = await getEmojiTypeAheadItemById(
      container,
      blackFlagEmoji.shortName,
    );
    await userEvent.hover(item);

    await isEmojiTypeAheadItemSelected(container, blackFlagEmoji.shortName);

    const itemCount = await itemsVisibleCount(container);
    rerender(
      <EmojiTypeAhead
        emojiProvider={emojiProvider}
        query="flag_b"
        ref={emojiTypeAheadRef}
      />,
    );

    await waitFor(async () =>
      expect((await findEmojiItems(container)).length).toBeLessThan(itemCount),
    );

    await isEmojiTypeAheadItemSelected(container, blackFlagEmoji.shortName);
  });

  it('should default to exact ascii selection first', async () => {
    const { container } = await setupTypeAhead({
      query: ':O',
    });
    expect((await itemsVisibleCount(container)) > 1).toEqual(true);
    await isEmojiTypeAheadItemSelected(container, openMouthEmoji.shortName);
  });

  it('should fire onSelection if a query ends in a colon and has an exact match with one emoji shortName', async () => {
    const onSelection = jest.fn();
    const fireEventSpy: (payload: AnalyticsEventPayload) => void = jest.fn();

    const { container } = await setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':grin:',
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
    });
    await findEmojiItems(container);

    expect(onSelection).toHaveBeenCalledTimes(1);
    await waitFor(() =>
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
      ),
    );
  });

  it('should not fire onSelection if a query ends in a colon and more than one emoji has an exact shortName match', async () => {
    const onSelection = jest.fn();

    const { container } = await setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':boom:',
    });
    expect((await itemsVisibleCount(container)) > 1).toEqual(true);
    expect(onSelection).not.toHaveBeenCalled();
  });

  it('should not fire onSelection if a query ends in a colon and an odd number of emoji have an exact shortName match', async () => {
    const onSelection = jest.fn();

    const { container } = await setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':ftfy:',
    });
    expect(
      (await itemsVisibleCount(container)) > 1 &&
        (await itemsVisibleCount(container)) % 2 === 1,
    ).toEqual(true);
    expect(onSelection).not.toHaveBeenCalled();
  });

  it('should not fire onSelection if a query ends in a colon and no emojis have an exact shortName match', async () => {
    const onSelection = jest.fn();

    await setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':blah:',
    });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(onSelection).not.toHaveBeenCalled();
  });

  it('should perform case insensitive exact shortName matching', async () => {
    const onSelection = jest.fn();

    await setupTypeAhead({
      onSelection: onSelection as OnEmojiEvent,
      query: ':GRIN:',
    });
    await waitFor(() => expect(onSelection).toHaveBeenCalledTimes(1));
  });

  it('should display emojis without skin tone variations by default', async () => {
    const { container } = await setupTypeAhead({
      query: 'raised_hand',
    });
    expect((await itemsVisibleCount(container)) === 1).toEqual(true);
    const typeaheadEmoji = await getSelectedEmojiTypeAheadItem(container);
    expect(typeaheadEmoji).toHaveAttribute('data-emoji-id', ':raised_hand:');
  });

  it('should display emojis using the skin tone preference provided by the EmojiResource', async () => {
    const emojiProvider = getEmojiResourcePromise();
    emojiProvider.then((provider) => provider.setSelectedTone(1));

    const { container } = await setupTypeAhead({
      emojiProvider,
      query: 'raised_hand',
    });
    expect((await itemsVisibleCount(container)) === 1).toEqual(true);
    const typeaheadEmoji = await getSelectedEmojiTypeAheadItem(container);
    expect(typeaheadEmoji).toHaveAttribute(
      'data-emoji-id',
      ':raised_hand::skin-tone-2:',
    );
  });

  it('should include skin tone details for analytics', async () => {
    let choseEmoji: OptionalEmojiDescription;
    const emojiProvider = getEmojiResourcePromise();
    emojiProvider.then((provider) => provider.setSelectedTone(5));
    const fireEventSpy = jest.fn();

    const { container } = await setupTypeAhead({
      emojiProvider,
      query: 'raised_hand',
      createAnalyticsEvent: getCreateAnalyticsSpy(fireEventSpy),
      onSelection: (_emojiId, emoji) => {
        choseEmoji = emoji;
      },
    });
    expect((await itemsVisibleCount(container)) === 1).toEqual(true);
    const typeaheadEmoji = await getSelectedEmojiTypeAheadItem(container);
    expect(typeaheadEmoji).toHaveAttribute(
      'data-emoji-id',
      ':raised_hand::skin-tone-6:',
    );
    const item = await getEmojiTypeAheadItemById(
      container,
      ':raised_hand::skin-tone-6:',
    );
    await userEvent.click(item);
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
  });
});
