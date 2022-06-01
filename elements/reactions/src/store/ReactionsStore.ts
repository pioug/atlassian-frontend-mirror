import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ReactionClient } from '../client';
import * as Analytics from '../analytics';
import * as Types from '../types';
import { batch, batchByKey } from './batched';
import * as utils from './utils';
import { isRealErrorFromService } from './utils';

export type State = {
  reactions: {
    [key: string]: Types.ReactionsState;
  };
  flash: {
    [key: string]: {
      [emojiId: string]: boolean;
    };
  };
};

export type OnUpdateCallback = (state: State) => void;
export interface StoreMetadata {
  subproduct?: string;
  [k: string]: any;
}

/**
 * Set of all available UFO experiences relating to reaction element
 */
export const ufoExperiences = {
  /**
   * Experience when a reaction emoji gets added
   */
  add: Analytics.UFO.ReactionsAdd,
  /**
   * Experience when a reaction emoji gets removed/decrement
   */
  remove: Analytics.UFO.ReactionsRemove,
  /**
   * Experience when the list of reactions gets rendered
   */
  render: Analytics.UFO.ReactionsRendered,
  /**
   * Experience when a reaction details gets fetched
   */
  fetchDetails: Analytics.UFO.ReactionDetailsFetch,
};

export interface ReactionsStore extends Types.Actions {
  getState: () => State;
  onChange: (callback: OnUpdateCallback) => void;
  removeOnChangeListener: (callback: OnUpdateCallback) => void;
  setCreateAnalyticsEvent?: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
  ) => void;
}

export class MemoryReactionsStore implements ReactionsStore {
  private client: ReactionClient;
  private state: State;
  private metadata: StoreMetadata | undefined;
  private callbacks: OnUpdateCallback[] = [];
  private createAnalyticsEvent?: CreateUIAnalyticsEvent;

  constructor(
    client: ReactionClient,
    state: State = {
      reactions: {},
      flash: {},
    },
    metadata?: StoreMetadata,
  ) {
    this.client = client;
    this.state = state;
    this.metadata = metadata;
  }

  private setState = (newState: Partial<State>) => {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.triggerOnChange();
  };

  // batch calls to onChange using the latest state in it.
  private triggerOnChange = batch(() =>
    this.callbacks.forEach((callback) => callback(this.state)),
  );

  private setReactions = (
    containerAri: string,
    ari: string,
    reactions: Types.ReactionsState,
  ) => {
    this.setState({
      reactions: {
        ...this.state.reactions,
        [`${containerAri}|${ari}`]: reactions,
      },
    });
  };

  private getReactionsState(containerAri: string, ari: string) {
    return this.state.reactions[`${containerAri}|${ari}`];
  }

  private handleDetailedReactionResponse = (
    detailedReaction: Types.ReactionSummary,
  ) => {
    const { containerAri, ari, emojiId } = detailedReaction;
    this.withReaction((reaction) => ({
      ...reaction,
      users: detailedReaction.users,
    }))(containerAri, ari, emojiId);
  };

  private setFlash(
    containerAri: string,
    ari: string,
    emojiId: string,
    flash: boolean,
  ) {
    this.setState({
      flash: {
        ...this.state.flash,
        [`${containerAri}|${ari}`]: {
          ...this.state.flash[`${containerAri}|${ari}`],
          [emojiId]: flash,
        },
      },
    });
  }

  private flash = (reaction: Types.ReactionSummary): void => {
    this.setFlash(reaction.containerAri, reaction.ari, reaction.emojiId, true);
    window.setTimeout(
      () =>
        this.setFlash(
          reaction.containerAri,
          reaction.ari,
          reaction.emojiId,
          false,
        ),
      700,
    );
  };

  private optmisticUpdate = (
    containerAri: string,
    ari: string,
    emojiId: string,
  ) => (updater: Types.Updater<Types.ReactionSummary>) => {
    this.withReadyReaction(
      containerAri,
      ari,
    )((reactionState) => {
      let found = false;
      const reactions = reactionState.reactions.map((reaction) => {
        if (reaction.emojiId === emojiId) {
          found = true;
          const updated = updater(reaction);
          if (updated) {
            return {
              ...updated,
              optimisticallyUpdated: true,
            };
          }
        }
        return reaction;
      });

      if (!found) {
        const updated = updater({
          containerAri,
          ari,
          emojiId,
          count: 0,
          reacted: false,
        });
        if (updated) {
          reactions.push({
            ...updated,
            optimisticallyUpdated: true,
          });
        }
      }

      return utils.readyState(reactions);
    });
  };

  /**
   * Utility function to help execute a callback to Reaction if its state is ready.
   *
   *
   * @param containerAri
   * @param ari
   *
   * @returns (updater: Updater<ReactionsReadyState>) => ReactionsState?
   *  A function that will execute the received callback with the ReactionsState if
   *  ready. If some state is returned, the new state will be applied.
   */
  private withReadyReaction(containerAri: string, ari: string) {
    return (updater: Types.Updater<Types.ReactionsReadyState>) => {
      const reactionsState = this.getReactionsState(containerAri, ari);
      if (reactionsState.status === Types.ReactionStatus.ready) {
        const updated = updater(reactionsState);
        if (updated) {
          this.setReactions(containerAri, ari, updated);
        }
      }
    };
  }

  /**
   * Utility function to help execute actions with a reaction. It handles reaction discovery
   * and branching between reacted and not reacted.
   *
   * @param reactedCallback callback that will be executed when the user has already reacted
   * with the emoji
   * @param notReactedCallback callback that will be executed when the user hasn't reacted
   * with the emoji
   *
   * @returns (containerAri: string, ari: string, emojiId: string) => ReactionsState?
   *  A function that will execute the correct callback to the triple containerAri, ari and
   *  emojiId. If some state is returned, the new state will be applied.
   */
  private withReaction(
    reactedCallback: Types.Updater<Types.ReactionSummary>,
    notReactedCallback?: Types.Updater<Types.ReactionSummary>,
  ) {
    return (containerAri: string, ari: string, emojiId: string) => {
      this.withReadyReaction(
        containerAri,
        ari,
      )((reactionsState) => {
        const reaction: Types.ReactionSummary = reactionsState.reactions.find(
          utils.byEmojiId(emojiId),
        ) || {
          containerAri,
          ari,
          emojiId,
          count: 0,
          reacted: false,
        };
        const callback: Types.Updater<Types.ReactionSummary> =
          reaction.reacted || !notReactedCallback
            ? reactedCallback
            : notReactedCallback;

        const updatedReaction = callback(reaction);
        if (updatedReaction && !(updatedReaction instanceof Function)) {
          return utils.readyState(
            reactionsState.reactions.map(
              utils.updateByEmojiId(emojiId, updatedReaction) as (
                reaction: Types.ReactionSummary,
              ) => Types.ReactionSummary,
            ),
          );
        }
        return;
      });
    };
  }

  private doAddReaction = (reaction: Types.ReactionSummary) => {
    const { containerAri, ari, emojiId } = reaction;
    this.optmisticUpdate(containerAri, ari, emojiId)(utils.addOne);
    this.flash(reaction);

    const exp = ufoExperiences.add.getInstance(`${ari}|${emojiId}`);
    // ufo start reaction experience
    exp.start();

    this.client
      .addReaction(containerAri, ari, emojiId, this.metadata)
      .then((_) => {
        if (this.createAnalyticsEvent) {
          Analytics.createAndFireSafe(
            this.createAnalyticsEvent,
            Analytics.createRestSucceededEvent,
            'addReaction',
          );
        }
        // ufo add reaction success
        exp.success();
      })
      .catch((error) => {
        if (this.createAnalyticsEvent && isRealErrorFromService(error.code)) {
          this.createAnalyticsEvent &&
            Analytics.createAndFireSafe(
              this.createAnalyticsEvent,
              Analytics.createRestFailedEvent,
              'addReaction',
              error.code,
            );
          // ufo add reaction failure
          exp.failure({
            metadata: { error },
          });
        }
        return Promise.reject(error);
      });
  };

  private doRemoveReaction = (reaction: Types.ReactionSummary) => {
    const { containerAri, ari, emojiId } = reaction;
    const exp = ufoExperiences.remove.getInstance(`${ari}|${emojiId}`);

    // ufo start reaction experience

    exp.start();
    this.optmisticUpdate(containerAri, ari, emojiId)(utils.removeOne);
    this.client
      .deleteReaction(containerAri, ari, emojiId, this.metadata)
      .then((_) => {
        // ufo add reaction success
        exp.success();
      })
      .catch((error) => {
        // ufo add reaction failure
        exp.failure({
          metadata: { error },
        });
      });
  };

  setCreateAnalyticsEvent = (
    createAnalyticsEvent?: CreateUIAnalyticsEvent,
  ): void => {
    this.createAnalyticsEvent = createAnalyticsEvent;
  };

  getReactions = batchByKey((containerAri: string, aris: string[][]): void => {
    /**
     * TODO:
     * All reactions are usually fetched in a single call to reactions-service. Need to check why "getReactions" gets called randomly 1-2 times everytime on each fetch request despite using same containerAri.
     */
    const exp = ufoExperiences.render.getInstance(containerAri);
    // ufo start reaction experience
    exp.start();
    this.client
      .getReactions(containerAri, aris.reduce(utils.flattenAris))
      .then((value: Types.Reactions) => {
        Object.keys(value).map((ari) => {
          const reactionsState = this.getReactionsState(containerAri, ari);
          const reactions =
            reactionsState &&
            reactionsState.status === Types.ReactionStatus.ready
              ? reactionsState.reactions
              : undefined;
          this.setReactions(
            containerAri,
            ari,
            utils.readyState(
              value[ari].sort(utils.getReactionsSortFunction(reactions)),
            ),
          );
        });
      })
      .then(() => {
        if (this.createAnalyticsEvent) {
          Analytics.createAndFireSafe(
            this.createAnalyticsEvent,
            Analytics.createRestSucceededEvent,
            'getReactions',
          );
        }
        exp.success();
      })
      .catch((error) => {
        if (isRealErrorFromService(error.code)) {
          if (this.createAnalyticsEvent) {
            Analytics.createAndFireSafe(
              this.createAnalyticsEvent,
              Analytics.createRestFailedEvent,
              'getReactions',
              error.code,
            );
          }
          exp.failure();
          return Promise.reject(error);
        }
      });
  });

  toggleReaction = this.withReaction(this.doRemoveReaction, this.doAddReaction);
  addReaction = this.withReaction(this.flash, this.doAddReaction);

  getDetailedReaction = (
    containerAri: string,
    ari: string,
    emojiId: string,
  ): void => {
    const exp = ufoExperiences.fetchDetails.getInstance(`${ari}|${emojiId}`);

    exp.start();
    this.client
      .getDetailedReaction(containerAri, ari, emojiId)
      .then((summary) => {
        // ufo get reaction details success
        exp.success();
        this.handleDetailedReactionResponse(summary);
      })
      .catch((error) => {
        // ufo get reaction details failure
        exp.failure({
          metadata: { error },
        });
      });
  };

  getState = () => this.state;

  onChange = (callback: OnUpdateCallback): void => {
    this.callbacks.push(callback);
  };

  removeOnChangeListener = (toRemove: OnUpdateCallback): void => {
    this.callbacks = this.callbacks.filter((callback) => callback !== toRemove);
  };
}
