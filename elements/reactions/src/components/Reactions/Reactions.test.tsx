import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { ReactWrapper } from 'enzyme';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  getReactionSummary,
  ari,
  containerAri,
} from '../../MockReactionsClient';
import { renderWithIntl } from '../../__tests__/_testing-library';
import { constants, i18n } from '../../shared';
import { ReactionStatus, ReactionSummary } from '../../types';
import { Trigger } from '../Trigger';
import { ReactionPicker } from '../ReactionPicker';
import { RENDER_REACTION_TESTID } from '../Reaction';
import { ReactionsProps, Reactions, RENDER_TOOLTIP_TESTID } from './Reactions';
import { RENDER_REACTIONPICKER_TESTID } from '../ReactionPicker';

describe('@atlaskit/reactions/components/Reactions', () => {
  const mockOnReactionsClick = jest.fn();
  const mockOnSelection = jest.fn();
  const mockLoadReaction = jest.fn();

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
  const quickReactionEmojiIds = [constants.DefaultReactions[5].id ?? ''];
  const status = ReactionStatus.ready;

  beforeEach(() => {
    mockOnReactionsClick.mockClear();
    mockOnSelection.mockClear();
    mockLoadReaction.mockClear();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const renderReactions = (extraProps: Partial<ReactionsProps> = {}) => {
    return renderWithIntl(
      <Reactions
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
        ari={ari}
        containerAri={containerAri}
        reactions={reactions}
        status={status}
        onReactionClick={mockOnReactionsClick}
        onSelection={mockOnSelection}
        loadReaction={mockLoadReaction}
        {...extraProps}
      />,
    );
  };

  it('should trigger "onReactionClick" when Reaction is clicked', async () => {
    renderReactions();

    const reactionButtons = await screen.findAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(reactions.length);
    fireEvent.mouseUp(reactionButtons[0]);
    expect(mockOnReactionsClick).toHaveBeenCalled();
  });

  it('should show pre-defined quickReactionEmojiIds list when reactions prop is empty', async () => {
    renderReactions({ reactions: [], quickReactionEmojiIds });
    const reactionButtons = await screen.findAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(quickReactionEmojiIds.length);
    for (let index = 0; index < reactionButtons.length; ++index) {
      expect(reactionButtons[index].title).toEqual(
        quickReactionEmojiIds[index],
      );
    }
  });

  it('should ignore pre-defined quickReactionEmojiIds list when reactions prop is populated with at least one emoji', async () => {
    renderReactions({ reactions, quickReactionEmojiIds });
    const reactionButtons = await screen.findAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(reactions.length);

    const reactionTitles = reactionButtons.map((button) => button.title);
    const intersection = reactionTitles.some((title) =>
      quickReactionEmojiIds.includes(title),
    );
    expect(intersection).toEqual(false);
  });

  it('should return empty reaction list when both pre-defined quickReactionEmojiIds list and reactions prop are empty', async () => {
    renderReactions({ reactions: [], quickReactionEmojiIds: [] });
    const reactionButtons = await screen.queryAllByTestId(
      RENDER_REACTION_TESTID,
    );
    expect(reactionButtons.length).toEqual(0);
  });

  describe('getTooltip', () => {
    it('should show nothing when status was initally set to undefined', async () => {
      const { queryByTestId } = renderReactions({
        status: undefined,
        allowAllEmojis: true,
      });

      const reactionPicker = queryByTestId(RENDER_REACTIONPICKER_TESTID);
      expect(reactionPicker).toBeInTheDocument();
      if (reactionPicker) {
        fireEvent.mouseOver(reactionPicker);
      }

      act(() => {
        jest.runAllTimers();
      });

      const tooltip = queryByTestId(RENDER_TOOLTIP_TESTID);
      expect(tooltip).not.toBeInTheDocument();
    });

    it('should show loading tooltip when status is set to loading', async () => {
      const { getByTestId } = renderReactions({
        status: ReactionStatus.loading,
        allowAllEmojis: true,
      });

      const reactionPicker = getByTestId(RENDER_REACTIONPICKER_TESTID);
      expect(reactionPicker).toBeInTheDocument();
      fireEvent.mouseOver(reactionPicker);

      act(() => {
        jest.runAllTimers();
      });

      const tooltip = getByTestId(RENDER_TOOLTIP_TESTID);
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toEqual(
        i18n.messages.loadingReactions.defaultMessage,
      );
    });

    it('should show loading tooltip when status is set to error', async () => {
      const { getByTestId } = renderReactions({
        status: ReactionStatus.error,
        allowAllEmojis: true,
      });

      const reactionPicker = getByTestId(RENDER_REACTIONPICKER_TESTID);
      expect(reactionPicker).toBeInTheDocument();
      fireEvent.mouseOver(reactionPicker);

      act(() => {
        jest.runAllTimers();
      });

      const tooltip = getByTestId(RENDER_TOOLTIP_TESTID);
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.textContent).toEqual(
        i18n.messages.unexpectedError.defaultMessage,
      );
    });
  });

  it('should render picker after reactions', async () => {
    const { container } = renderReactions({ allowAllEmojis: true });

    const wrapper = container.querySelector('div.miniMode');
    expect(wrapper).toBeDefined();
  });

  describe('with analytics', () => {
    const onEvent = jest.fn();
    const TestComponent = (props: Partial<ReactionsProps>) => (
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reactions
          emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
          ari={ari}
          containerAri={containerAri}
          reactions={[
            getReactionSummary(':fire:', 1, true),
            getReactionSummary(':thumbsup:', 9, false),
          ]}
          allowAllEmojis
          status={ReactionStatus.loading}
          onReactionClick={() => {}}
          onSelection={() => {}}
          loadReaction={() => {}}
          {...props}
        />
      </AnalyticsListener>
    );

    let component: ReactWrapper<ReactionsProps>;

    beforeEach(() => {
      component = mountWithIntl(<TestComponent />);
      component.setProps({ status: ReactionStatus.ready });
    });

    afterEach(() => {
      onEvent.mockClear();
    });

    it('should trigger render', () => {
      expect(onEvent).toHaveBeenCalledWith(
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
      beforeEach(() => {
        component.find(Trigger).simulate('click');
      });

      it('should trigger clicked for Reaction Picker Button', () => {
        expect(onEvent).toHaveBeenCalledWith(
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

      it('should trigger cancelled for ReactionPicker', () => {
        const onCancel = component.find(ReactionPicker).prop('onCancel');
        expect(onCancel).toBeDefined();
        if (onCancel) {
          onCancel();
        }

        expect(onEvent).toHaveBeenCalledWith(
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

      it('should trigger clicked for new emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          'emoji-1',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: 'emoji-1',
                previousState: 'new',
                source: 'quickSelector',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          '1f44d',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f44d',
                previousState: 'existingNotReacted',
                source: 'quickSelector',
                packageName: '@atlaskit/reactions',
                packageVersion: expect.any(String),
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing reacted emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          '1f525',
          'quickSelector',
        );

        return Promise.resolve().then(() => {
          expect(onEvent).toHaveBeenCalledWith(
            expect.objectContaining({
              payload: expect.objectContaining({
                action: 'clicked',
                actionSubject: 'reactionPicker',
                actionSubjectId: 'emoji',
                eventType: 'ui',
                attributes: {
                  duration: expect.any(Number),
                  emojiId: '1f525',
                  previousState: 'existingReacted',
                  source: 'quickSelector',
                  packageName: '@atlaskit/reactions',
                  packageVersion: expect.any(String),
                },
              }),
            }),
            'fabric-elements',
          );
        });
      });

      it('should trigger clicked from emojiPicker', () => {
        const onShowMore = component.find(ReactionPicker).prop('onShowMore');
        expect(onShowMore).toBeDefined();
        if (onShowMore) {
          onShowMore();
        }

        expect(onEvent).toHaveBeenCalledWith(
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

        component.find(ReactionPicker).prop('onSelection')(
          '1f525',
          'emojiPicker',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectId: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f525',
                previousState: 'existingReacted',
                source: 'emojiPicker',
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
