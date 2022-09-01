import React from 'react';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { EmojiProvider } from '@atlaskit/emoji';
import {
  ConnectedReactionsView,
  mapDispatchToPropsHelper,
  mapStateToPropsHelper,
} from './ConnectedReactionsView';
import { renderWithIntl } from '../../__tests__/_testing-library';
import {
  Actions,
  ReactionStatus,
  ReactionSummary,
  StorePropInput,
} from '../../types';

describe('@atlaskit/reactions/containers/ConnectedReactionsView', () => {
  const containerAri = 'container-ari';
  const ari = 'ari';
  const reactionKey = `${containerAri}|${ari}`;

  const actions: Actions = {
    getReactions: jest.fn(),
    toggleReaction: jest.fn(),
    addReaction: jest.fn(),
    getDetailedReaction: jest.fn(),
  };

  const store: StorePropInput = new Promise((resolve) =>
    resolve({
      getReactions: jest.fn(),
      toggleReaction: jest.fn(),
      addReaction: jest.fn(),
      getDetailedReaction: jest.fn(),
      getState: jest.fn(),
      onChange: jest.fn(),
      removeOnChangeListener: jest.fn(),
      setCreateAnalyticsEvent: jest.fn(),
    }),
  );

  beforeEach(() =>
    Object.keys(actions).forEach((key) => (actions as any)[key].mockClear()),
  );

  describe('mapStateToPropsHelper', () => {
    it('should map empty state to notLoaded', () => {
      expect(
        mapStateToPropsHelper(containerAri, ari, { reactions: {}, flash: {} }),
      ).toMatchObject({
        status: ReactionStatus.notLoaded,
        reactions: [],
      });
    });

    it('should map ready state', () => {
      const reactions: ReactionSummary[] = [];
      expect(
        mapStateToPropsHelper(containerAri, ari, {
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
      expect(
        mapStateToPropsHelper(containerAri, ari, {
          reactions: {
            [reactionKey]: { status: ReactionStatus.loading },
          },
          flash: {},
        }),
      ).toEqual({ status: ReactionStatus.loading, reactions: [] });
    });

    it('should map error state', () => {
      expect(
        mapStateToPropsHelper(containerAri, ari, {
          reactions: {
            [reactionKey]: {
              status: ReactionStatus.error,
              message: 'Failed to download reactions',
            },
          },
          flash: {},
        }),
      ).toEqual({ status: ReactionStatus.error, reactions: [] });
    });
  });

  describe('mapDispatchToPropsHelper', () => {
    it('should call getReactions on loadReaction', () => {
      mapDispatchToPropsHelper(actions, containerAri, ari).loadReaction();

      expect(actions.getReactions).toHaveBeenCalledTimes(1);
      expect(actions.getReactions).toHaveBeenCalledWith(containerAri, ari);
    });

    it('should call toggleReaction onReactionClick', () => {
      mapDispatchToPropsHelper(actions, containerAri, ari).onReactionClick(
        'emojiA',
      );

      expect(actions.toggleReaction).toHaveBeenCalledTimes(1);
      expect(actions.toggleReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });

    it('should call getDetailedReaction onReactionHover', () => {
      mapDispatchToPropsHelper(actions, containerAri, ari).onReactionHover(
        'emojiA',
      );

      expect(actions.getDetailedReaction).toHaveBeenCalledTimes(1);
      expect(actions.getDetailedReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });

    it('should call addReaction onSelection', () => {
      mapDispatchToPropsHelper(actions, containerAri, ari).onSelection(
        'emojiA',
      );

      expect(actions.addReaction).toHaveBeenCalledTimes(1);
      expect(actions.addReaction).toHaveBeenCalledWith(
        containerAri,
        ari,
        'emojiA',
      );
    });
  });

  it('should set createAnalyticsEvent function in the store in the componentDidMount', async () => {
    renderWithIntl(
      <ConnectedReactionsView
        store={store}
        containerAri={containerAri}
        ari={ari}
        emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
      />,
    );
    const _store = await Promise.resolve(store);
    expect(_store.setCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
  });
});
