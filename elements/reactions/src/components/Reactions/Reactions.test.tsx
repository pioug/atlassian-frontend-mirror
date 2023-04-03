import React from 'react';
import { act, fireEvent, screen, within } from '@testing-library/react';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  getReactionSummary,
  ari,
  containerAri,
} from '../../MockReactionsClient';
import {
  mockReactDomWarningGlobal,
  mockResetUFOInstance,
  renderWithIntl,
  useFakeTimers,
} from '../../__tests__/_testing-library';
import type { FakeUFOInstance } from '../../__tests__/_testing-library';
import { constants, i18n } from '../../shared';
import {
  QuickReactionEmojiSummary,
  ReactionStatus,
  ReactionSummary,
} from '../../types';
import { RENDER_REACTIONPICKER_TESTID } from '../ReactionPicker';
import { RENDER_REACTION_TESTID } from '../Reaction';
import {
  ReactionsProps,
  Reactions,
  getTooltip,
  RENDER_VIEWALL_REACTED_USERS_DIALOG,
  ufoExperiences,
} from './Reactions';
import { RENDER_MODAL_TESTID } from '../ReactionDialog/ReactionsDialog';
import { RENDER_SELECTOR_TESTID } from '../Selector';
import { RENDER_SHOWMORE_TESTID } from '../ShowMore';
import { RENDER_REACTIONPICKERPANEL_TESTID } from '../ReactionPicker/ReactionPicker';

describe('@atlaskit/reactions/components/Reactions', () => {
  const mockOnReactionsClick = jest.fn();
  const mockOnSelection = jest.fn();
  const mockLoadReaction = jest.fn();

  const fakeOpenDialogUFOExperience: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
    addMetadata: jest.fn(),
  };

  const fakeCloseDialogUFOExperience: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
    addMetadata: jest.fn(),
  };

  const fakeSelectedReactionChangeInsideDialogUFOExperience: FakeUFOInstance = {
    start: jest.fn(),
    success: jest.fn(),
    failure: jest.fn(),
    abort: jest.fn(),
    addMetadata: jest.fn(),
  };
  mockReactDomWarningGlobal(() => {
    // Mock the experiences for all dialog UfoExperience instances
    ufoExperiences.openDialog = fakeOpenDialogUFOExperience as any;
    ufoExperiences.closeDialog = fakeCloseDialogUFOExperience as any;
    ufoExperiences.selectedReactionChangeInsideDialog =
      fakeSelectedReactionChangeInsideDialogUFOExperience as any;
  });
  useFakeTimers(() => {
    mockOnReactionsClick.mockClear();
    mockOnSelection.mockClear();
    mockLoadReaction.mockClear();

    // dialog opening UFO experience mock reset
    mockResetUFOInstance(fakeOpenDialogUFOExperience);
    // dialog close UFO experience mock reset
    mockResetUFOInstance(fakeCloseDialogUFOExperience);
    // changed Reaction inside dialog UFO experience mock reset
    mockResetUFOInstance(fakeSelectedReactionChangeInsideDialogUFOExperience);
  });

  /**
   * Pre defined selected emoji ids
   */
  const reactions: ReactionSummary[] = [
    getReactionSummary(constants.DefaultReactions[0].shortName, 9, false),
    getReactionSummary(constants.DefaultReactions[2].shortName, 1, true),
  ];
  /**
   * Custom quick Reaction list to pick from
   */
  const quickReactionEmojis: QuickReactionEmojiSummary = {
    ari,
    containerAri,
    emojiIds: [constants.DefaultReactions[5].id ?? ''],
  };
  const status = ReactionStatus.ready;

  const renderReactions = (
    extraProps: Partial<ReactionsProps> = {},
    onEvent: (event: UIAnalyticsEvent, channel?: string) => void = () => {},
  ) => {
    return renderWithIntl(
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reactions
          emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
          reactions={reactions}
          status={status}
          onReactionClick={mockOnReactionsClick}
          onSelection={mockOnSelection}
          loadReaction={mockLoadReaction}
          {...extraProps}
        />
      </AnalyticsListener>,
    );
  };

  it('should trigger "onReactionClick" when Reaction is clicked', async () => {
    renderReactions();

    const reactionButtons = await screen.findAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(reactions.length);
    fireEvent.click(reactionButtons[0]);
    expect(mockOnReactionsClick).toHaveBeenCalled();
  });

  it('should show pre-defined quickReactionEmojis type when reactions prop is empty', async () => {
    renderReactions({ reactions: [], quickReactionEmojis });
    const reactionButtons = await screen.findAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(quickReactionEmojis.emojiIds.length);
    for (let index = 0; index < reactionButtons.length; ++index) {
      expect(reactionButtons[index].dataset.emojiId).toEqual(
        quickReactionEmojis.emojiIds[index],
      );
    }
  });

  it('should ignore pre-defined quickReactionEmojis type when reactions prop is populated with at least one emoji', async () => {
    renderReactions({ reactions, quickReactionEmojis });
    const reactionButtons = await screen.findAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(reactions.length);

    const reactionEmojiIds = reactionButtons.map(
      (button) => button.dataset.emojiId || '',
    );
    const intersection = reactionEmojiIds.some((id) =>
      quickReactionEmojis.emojiIds.includes(id),
    );
    expect(intersection).toEqual(false);
  });

  it('should return empty reaction list when both pre-defined quickReactionEmojis.emojiIds list and reactions prop are empty', async () => {
    renderReactions({
      reactions: [],
      quickReactionEmojis: { ...quickReactionEmojis, emojiIds: [] },
    });
    const reactionButtons = await screen.queryAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(0);
  });

  it('should not show see who reacted button if allowUserDialog is disabled', async () => {
    renderReactions({
      reactions,
      allowUserDialog: false,
    });
    const seeWhoReactedButton = await screen.queryByTestId(
      RENDER_VIEWALL_REACTED_USERS_DIALOG,
    );
    expect(seeWhoReactedButton).not.toBeInTheDocument();
  });

  it('should open reactions users dialog if allowUserDialog is enabled and see who reacted button is clicked', async () => {
    const onDialogOpenCallback = jest.fn();
    const onDialogCloseCallback = jest.fn();
    const onDialogSelectReactionCallback = jest.fn();
    renderReactions({
      reactions,
      allowUserDialog: true,
      onDialogOpenCallback,
      onDialogCloseCallback,
      onDialogSelectReactionCallback,
    });

    const seeWhoReactedButton = await screen.findByTestId(
      RENDER_VIEWALL_REACTED_USERS_DIALOG,
    );

    // click see who reacted button
    act(() => {
      fireEvent.click(seeWhoReactedButton);
    });

    const reactionDialog = await screen.getByTestId(RENDER_MODAL_TESTID);

    // get reaction tab from reactions dialog
    const modalBody = await screen.getByTestId('render-reactions-modal--body');
    const reactionToClick = within(modalBody).getByTestId(reactions[1].emojiId);
    const reactionTabToClick = within(reactionToClick).getByRole('tab');
    // click a different reaction tab
    act(() => {
      fireEvent.click(reactionTabToClick);
    });

    // get close button in reactions dialog
    const modalFooter = await screen.getByTestId(
      'render-reactions-modal--footer',
    );
    const closeBtn = within(modalFooter).getByText('Close');
    // click close button in reactions dialog
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(reactionDialog).not.toBeUndefined();
    expect(seeWhoReactedButton).toBeDefined();
    expect(onDialogOpenCallback).toBeCalledWith(reactions[0].emojiId, 'button');
    expect(onDialogCloseCallback).toBeCalled();
    expect(onDialogSelectReactionCallback).toBeCalledWith(
      reactions[1].emojiId,
      expect.any(UIAnalyticsEvent),
    );

    expect(fakeOpenDialogUFOExperience.success).toBeCalledWith({
      metadata: {
        emojiId: reactions[0].emojiId,
        source: 'Reactions',
        reason: 'Opening all reactions dialog link successfully',
      },
    });
    expect(
      fakeSelectedReactionChangeInsideDialogUFOExperience.success,
    ).toBeCalledWith({
      metadata: {
        emojiId: reactions[1].emojiId,
        source: 'Reactions',
        reason: 'Selected Emoji changed',
      },
    });
    expect(fakeCloseDialogUFOExperience.success).toBeCalledWith({
      metadata: {
        source: 'Reactions',
        reason: 'Closing reactions dialog successfully',
      },
    });
  });

  describe('getTooltip', () => {
    it('status is set to loading', async () => {
      renderWithIntl(getTooltip(ReactionStatus.loading) as JSX.Element);
      const element = screen.queryByText(
        i18n.messages.loadingReactions.defaultMessage,
      );
      expect(element).toBeDefined();
    });

    it('status is set to error', async () => {
      renderWithIntl(getTooltip(ReactionStatus.error) as JSX.Element);
      const element = screen.queryByText(
        i18n.messages.unexpectedError.defaultMessage,
      );
      expect(element).toBeDefined();
    });

    it('status is set to ready', async () => {
      renderWithIntl(getTooltip(ReactionStatus.ready) as JSX.Element);
      const element = screen.queryByText(
        i18n.messages.addReaction.defaultMessage,
      );
      expect(element).toBeDefined();
    });

    it('status is set to notLoaded', async () => {
      renderWithIntl(getTooltip(ReactionStatus.notLoaded) as JSX.Element);
      const element = screen.queryByText(
        i18n.messages.loadingReactions.defaultMessage,
      );
      expect(element).toBeDefined();
    });

    it('status is set to disabled', async () => {
      const tooltip = getTooltip(ReactionStatus.disabled);
      expect(tooltip).toBeNull();
    });
  });

  it('should render picker after reactions', async () => {
    const { container } = renderReactions({ allowAllEmojis: true });

    const wrapper = container.querySelector('div.miniMode');
    expect(wrapper).toBeDefined();
  });

  describe('with analytics', () => {
    it('should trigger render', async () => {
      Object.defineProperty(constants, 'SAMPLING_RATE_REACTIONS_RENDERED_EXP', {
        value: 1,
      });

      const mockOnEvent = jest.fn();
      renderReactions({}, mockOnEvent);

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'rendered',
            actionSubject: 'reactionView',
            eventType: 'operational',
            attributes: {
              duration: expect.any(Number),
              packageName: '@atlaskit/reactions',
              packageVersion: expect.any(String),
            },
          }),
        }),
        'fabric-elements',
      );
    });

    describe('with ReactionPicker open', () => {
      it('should trigger clicked for Reaction Picker Button', async () => {
        const mockOnEvent = jest.fn();
        renderReactions({}, mockOnEvent);

        const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
        expect(picker).toBeInTheDocument();

        const pickerButton = within(picker).getByRole('button');
        expect(pickerButton).toBeInTheDocument();
        // click to open the reaction picker
        act(() => {
          fireEvent.click(pickerButton);
        });
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPickerButton',
              eventType: 'ui',
              attributes: {
                reactionEmojiCount: 2,
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should not trigger cancelled event for ReactionPicker on second trigger click', async () => {
        const mockOnEvent = jest.fn();
        renderReactions({}, mockOnEvent);

        // triggger the picker button to show
        const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
        expect(picker).toBeInTheDocument();
        const pickerButton = within(picker).getByRole('button');
        expect(pickerButton).toBeInTheDocument();
        // click to open the reaction picker
        act(() => {
          fireEvent.click(pickerButton);
        });
        // close the reaction picker by click it again
        act(() => {
          fireEvent.click(pickerButton);
        });
        expect(mockOnEvent).not.toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'cancelled',
              actionSubject: 'reactionPicker',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for new emoji', async () => {
        const mockOnEvent = jest.fn();
        renderReactions({}, mockOnEvent);

        // triggger the picker button to show
        const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
        expect(picker).toBeInTheDocument();
        const pickerButton = within(picker).getByRole('button');
        expect(pickerButton).toBeInTheDocument();
        // click to open the reaction picker
        act(() => {
          fireEvent.click(pickerButton);
        });

        const pickerPopup = await screen.findByTestId(
          RENDER_REACTIONPICKERPANEL_TESTID,
        );

        // render the selectors list insider <ReactionPicker />
        const selectors = await within(pickerPopup).findAllByTestId(
          RENDER_SELECTOR_TESTID,
        );
        expect(selectors.length).toBeGreaterThan(1);
        expect(selectors[1]).toBeInTheDocument();

        // pick the button inside the list of emojis to select
        const selectedButton = within(selectors[1]).getByRole('button');
        expect(selectedButton).toBeInTheDocument();

        act(() => {
          fireEvent.click(selectedButton);
        });

        act(() => {
          jest.runOnlyPendingTimers();
        });
        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              eventType: 'ui',
              attributes: expect.objectContaining({
                duration: expect.any(Number),
                emojiId: constants.DefaultReactions[1].id,
                previousState: 'new',
                source: 'quickSelector',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              }),
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing emoji', async () => {
        const mockOnEvent = jest.fn();
        renderReactions({}, mockOnEvent);

        // triggger the picker button to show
        const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
        expect(picker).toBeInTheDocument();
        const pickerButton = within(picker).getByRole('button');
        expect(pickerButton).toBeInTheDocument();
        // click to open the reaction picker
        act(() => {
          fireEvent.click(pickerButton);
        });
        const pickerPopup = await screen.findByTestId(
          RENDER_REACTIONPICKERPANEL_TESTID,
        );
        // render the selectors list insider <ReactionPicker />
        const selectors = await within(pickerPopup).findAllByTestId(
          RENDER_SELECTOR_TESTID,
        );
        expect(selectors.length).toBeGreaterThan(1);
        expect(selectors[0]).toBeInTheDocument();

        // pick the button inside the list of emojis to select
        const selectedButton = within(selectors[0]).getByRole('button');
        expect(selectedButton).toBeInTheDocument();

        act(() => {
          fireEvent.click(selectedButton);
        });

        act(() => {
          jest.runOnlyPendingTimers();
        });

        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              eventType: 'ui',
              attributes: expect.objectContaining({
                duration: expect.any(Number),
                emojiId: constants.DefaultReactions[0].id,
                previousState: 'existingNotReacted',
                source: 'quickSelector',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              }),
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked from emojiPicker', async () => {
        const mockOnEvent = jest.fn();
        const { container } = renderReactions(
          { allowAllEmojis: true },
          mockOnEvent,
        );

        const wrapper = container.querySelector('div.miniMode');
        expect(wrapper).toBeDefined();

        // triggger the picker button to show
        const picker = await screen.findByTestId(RENDER_REACTIONPICKER_TESTID);
        expect(picker).toBeInTheDocument();
        const pickerButton = within(picker).getByRole('button');
        expect(pickerButton).toBeInTheDocument();
        // click to open the reaction picker
        act(() => {
          fireEvent.click(pickerButton);
        });

        const pickerPopup = await screen.findByTestId(
          RENDER_REACTIONPICKERPANEL_TESTID,
        );

        // render the selectors list insider <ReactionPicker />
        const selectors = await within(pickerPopup).findAllByTestId(
          RENDER_SELECTOR_TESTID,
        );
        expect(selectors.length).toBeGreaterThan(1);
        expect(selectors[0]).toBeInTheDocument();

        // pick the button inside the list of emojis to select
        const selectedButton = within(selectors[0]).getByRole('button');
        expect(selectedButton).toBeInTheDocument();

        const showMoreButton = await screen.findByTestId(
          RENDER_SHOWMORE_TESTID,
        );
        expect(showMoreButton).toBeInTheDocument();

        act(() => {
          fireEvent.click(showMoreButton);
        });

        expect(mockOnEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'more',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });
    });
  });
});
