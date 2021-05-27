import { AnalyticsListener } from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
  mountWithIntl,
  shallowWithIntl,
} from '@atlaskit/editor-test-helpers/enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { reaction } from '../../../client/MockReactionsClient';
import { messages } from '../../../components/i18n';
import { Reaction } from '../../../components/Reaction';
import { ReactionPicker } from '../../../components/ReactionPicker';
import {
  Props,
  Reactions,
  ReactionsWithoutAnalytics,
} from '../../../components/Reactions';
import { Trigger } from '../../../components/Trigger';
import { ReactionStatus } from '../../../types/ReactionStatus';
import { ReactWrapper } from 'enzyme';

describe('@atlaskit/reactions/reactions', () => {
  const renderReactions = (extraProps: Partial<Props> = {}) =>
    shallowWithIntl(
      <ReactionsWithoutAnalytics
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
        reactions={[
          reaction(':fire:', 1, true),
          reaction(':thumbsup:', 9, false),
        ]}
        status={ReactionStatus.ready}
        onReactionClick={() => {}}
        onSelection={() => {}}
        loadReaction={() => {}}
        {...extraProps}
      />,
    );

  it('should trigger "onReactionClick" when Reaction is clicked', () => {
    const onReactionClick = jest.fn();
    const reactions = renderReactions({ onReactionClick });

    reactions.find(Reaction).first().simulate('click');

    expect(onReactionClick).toHaveBeenCalled();
  });

  it('should show loading tooltip and disable picker', () => {
    const reactions = renderReactions({ status: ReactionStatus.loading });
    expect(reactions.find(Tooltip).prop('content')).toEqual(
      <FormattedMessage {...messages.loadingReactions} />,
    );

    expect(reactions.find(ReactionPicker).prop('disabled')).toBeTruthy();
  });

  it('should show loading tooltip and disable picker when there is an error', () => {
    const reactions = renderReactions({
      status: ReactionStatus.error,
      errorMessage: 'Something is wrong',
    });

    expect(reactions.find(Tooltip).prop('content')).toEqual(
      'Something is wrong',
    );
    expect(reactions.find(ReactionPicker).prop('disabled')).toBeTruthy();
  });

  it('should render picker after reactions', () => {
    const reactions = renderReactions();
    const container = reactions.find('div').first().children();
    expect(container.last().find(ReactionPicker)).toHaveLength(1);
  });

  describe('with analytics', () => {
    const onEvent = jest.fn();
    const TestComponent = (props: Partial<Props>) => (
      <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
        <Reactions
          emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
          reactions={[
            reaction(':fire:', 1, true),
            reaction(':thumbsup:', 9, false),
          ]}
          status={ReactionStatus.loading}
          onReactionClick={() => {}}
          onSelection={() => {}}
          loadReaction={() => {}}
          {...props}
        />
      </AnalyticsListener>
    );

    let component: ReactWrapper<Props>;

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
        const onMore = component.find(ReactionPicker).prop('onMore');
        expect(onMore).toBeDefined();
        if (onMore) {
          onMore();
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
