import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import ReactionsContainer, {
  Props,
} from '../../../containers/ReactionsContainer';
import { ReactionConsumer } from '../../../reaction-store/ReactionConsumer';
import { ReactionStatus } from '../../../types/ReactionStatus';
import { ReactionSummary } from '../../../../src/types';

describe('ReactionsContainer', () => {
  const containerAri = 'container-ari';
  const ari = 'ari';
  const reactionKey = `${containerAri}|${ari}`;

  const actions = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
  };

  let container: ReactWrapper<Props, {}>;
  let stateMapper: any;
  let actionsMapper: any;

  const store = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
    getState: jest.fn(),
    onChange: jest.fn(),
    removeOnChangeListener: jest.fn(),
    setCreateAnalyticsEvent: jest.fn(),
  };

  beforeAll(() => {
    container = mountWithIntl(
      <ReactionsContainer
        store={store}
        containerAri={containerAri}
        ari={ari}
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
      />,
    ) as ReactWrapper<Props, {}>;

    const props = container.find(ReactionConsumer).props();
    stateMapper = props.stateMapper;
    actionsMapper = props.actionsMapper;
  });

  beforeEach(() =>
    Object.keys(actions).forEach((key) => (actions as any)[key].mockClear()),
  );

  describe('stateMapper', () => {
    it('should map empty state to notLoaded', () => {
      expect(stateMapper).toBeDefined();
      expect(stateMapper!({ reactions: {}, flash: {} })).toMatchObject({
        status: ReactionStatus.notLoaded,
      });
    });

    it('should map ready state', () => {
      const reactions: ReactionSummary[] = [];
      expect(stateMapper).toBeDefined();
      expect(
        stateMapper!({
          reactions: {
            [reactionKey]: { status: ReactionStatus.ready, reactions },
          },
          flash: { [reactionKey]: { emojiA: true } },
        }),
      ).toEqual({
        status: ReactionStatus.ready,
        reactions,
        flash: { emojiA: true },
      });
    });

    it('should map loading state', () => {
      expect(stateMapper).toBeDefined();
      expect(
        stateMapper!({
          reactions: {
            [reactionKey]: { status: ReactionStatus.loading },
          },
          flash: {},
        }),
      ).toEqual({ status: ReactionStatus.loading });
    });
  });

  describe('actions', () => {
    let mappedActions: any;
    beforeAll(() => {
      mappedActions = actionsMapper(actions);
    });

    it('should call getReactions on loadReaction', () => {
      mappedActions.loadReaction();

      expect(actions.getReactions).toHaveBeenCalledTimes(1);
      expect(actions.getReactions).toHaveBeenCalledWith(containerAri, ari);
    });

    it('should call toggleReaction onReactionClick', () => {
      mappedActions.onReactionClick('emojiA');

      expect(actions.toggleReaction).toHaveBeenCalledTimes(1);
      expect(actions.toggleReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });

    it('should call getDetailedReaction onReactionHover', () => {
      mappedActions.onReactionHover('emojiA');

      expect(actions.getDetailedReaction).toHaveBeenCalledTimes(1);
      expect(actions.getDetailedReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });

    it('should call addReaction onSelection', () => {
      mappedActions.onSelection('emojiA');

      expect(actions.addReaction).toHaveBeenCalledTimes(1);
      expect(actions.addReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });
  });

  it('should set store in the consumer', () => {
    expect(container.find(ReactionConsumer).prop('store')).toBe(store);
  });

  it('should set createAnalyticsEvent function in the store in the componentDidMount', () => {
    expect(store.setCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
  });
});
