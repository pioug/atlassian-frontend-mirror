import React, { useEffect, useRef } from 'react';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { Reactions, StateMapperProps, UfoErrorBoundary } from '../components';
import {
  ReactionConsumer,
  ReactionStoreProp,
  ReactionStoreState,
} from '../store/ReactionConsumer';
import { ReactionStatus } from '../types/ReactionStatus';
import { ufoExperiences } from '../store/ReactionsStore';
import { Actions } from '../types';
import { WithSamplingUFOExperience } from '@atlaskit/emoji';

export type Props = {
  /**
   * Wrapper id for reactions list
   */
  containerAri: string;
  /**
   * Individual id for a reaction
   */
  ari: string;
  /**
   * Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)
   */
  allowAllEmojis?: boolean;
  /**
   * @deprecated Not been used anymore
   */
  boundariesElement?: string;
  /**
   * Provider for loading emojis
   */
  emojiProvider: Promise<EmojiProvider>;
  /**
   * Reference to the store
   */
  store: ReactionStoreProp;
};

const ReactionsView: React.FC<Props & WithAnalyticsEventsProps> = (props) => {
  // // compose a UFO experience object
  let experienceInstance = useRef<WithSamplingUFOExperience>();
  const { ari, createAnalyticsEvent, store, containerAri } = props;
  useEffect(() => {
    experienceInstance.current = ufoExperiences.render(ari);
  }, [ari]);

  useEffect(() => {
    Promise.resolve(store).then((_store) => {
      if (_store.setCreateAnalyticsEvent && createAnalyticsEvent) {
        _store.setCreateAnalyticsEvent(createAnalyticsEvent);
      }
    });
  }, [createAnalyticsEvent, store]);

  // abort when component gets unmounted
  useEffect(() => {
    return function cleanup() {
      experienceInstance.current?.abort({
        metadata: {
          source: 'Connected-Reactions-View',
          data: { ari, containerAri },
          reason: 'unmount',
        },
      });
    };
  }, [experienceInstance, containerAri, ari]);

  const renderChildren = (innerProps: any) => {
    return (
      <FabricElementsAnalyticsContext data={{ containerAri, ari }}>
        <Reactions
          key={`${props.containerAri}|${props.ari}`}
          {...props}
          {...innerProps}
        />
      </FabricElementsAnalyticsContext>
    );
  };
  const stateMapper: (state?: ReactionStoreState) => StateMapperProps = (
    state,
  ) => {
    const { containerAri, ari } = props;
    const reactionsState = state && state.reactions[`${containerAri}|${ari}`];

    if (!state || !reactionsState) {
      return { status: ReactionStatus.notLoaded, reactions: [] };
    }
    switch (reactionsState.status) {
      case ReactionStatus.ready:
        return {
          reactions: reactionsState.reactions,
          status: reactionsState.status,
          flash: state.flash[`${containerAri}|${ari}`],
        };
      case ReactionStatus.error:
        return {
          status: ReactionStatus.error,
          reactions: [],
        };
      default:
        return { status: ReactionStatus.loading, reactions: [] };
    }
  };

  const actionsMapper = (actions: Actions) => ({
    loadReaction: () => {
      actions.getReactions(props.containerAri, props.ari);
    },
    onReactionClick: (emojiId: string) => {
      actions.toggleReaction(props.containerAri, props.ari, emojiId);
    },
    onReactionHover: (emojiId: string) => {
      actions.getDetailedReaction(props.containerAri, props.ari, emojiId);
    },
    onSelection: (emojiId: string) => {
      actions.addReaction(props.containerAri, props.ari, emojiId);
    },
  });

  return (
    <UfoErrorBoundary
      experiences={
        experienceInstance.current ? [experienceInstance.current] : []
      }
    >
      <ReactionConsumer
        store={props.store}
        actionsMapper={actionsMapper}
        stateMapper={stateMapper}
      >
        {renderChildren}
      </ReactionConsumer>
    </UfoErrorBoundary>
  );
};

export const ConnectedReactionsView = withAnalyticsEvents()(ReactionsView);
