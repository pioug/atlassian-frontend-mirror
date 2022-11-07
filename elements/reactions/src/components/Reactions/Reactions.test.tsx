import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
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
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
  useFakeTimers,
} from '../../__tests__/_testing-library';
import { constants, i18n } from '../../shared';
import {
  QuickReactionEmojiSummary,
  ReactionStatus,
  ReactionSummary,
} from '../../types';
import { ReactionPicker } from '../ReactionPicker';
import { RENDER_REACTION_TESTID } from '../Reaction';
import { ReactionsProps, Reactions, getTooltip } from './Reactions';

describe('@atlaskit/reactions/components/Reactions', () => {
  const mockOnReactionsClick = jest.fn();
  const mockOnSelection = jest.fn();
  const mockLoadReaction = jest.fn();

  mockReactDomWarningGlobal();
  useFakeTimers(() => {
    mockOnReactionsClick.mockClear();
    mockOnSelection.mockClear();
    mockLoadReaction.mockClear();
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

  const renderReactions = (extraProps: Partial<ReactionsProps> = {}) => {
    return renderWithIntl(
      <Reactions
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
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
    const onEvent = jest.fn();
    const TestComponent = (props: Partial<ReactionsProps>) => (
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reactions
          emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
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
        component.find('[type="button"]').last().simulate('click');
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
