import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  createAndFireSafe,
  createRestFailedEvent,
  createRestSucceededEvent,
  extractErrorInfo,
} from '../analytics';
import {
  type Client,
  type OnChangeCallback,
  ReactionStatus,
  type ReactionSummary,
  type Reactions,
  type ReactionsReadyState,
  type ReactionsState,
  type State,
  type Store,
  type Updater,
} from '../types';
import { batch, batchByKey } from './batched';
import {
  addOne,
  byEmojiId,
  flattenAris,
  getReactionsSortFunction,
  isRealErrorFromService,
  readyState,
  removeOne,
  updateByEmojiId,
} from './utils';
import { SAMPLING_RATE_REACTIONS_RENDERED_EXP } from '../shared/constants';
import {
  ReactionsAdd,
  ReactionDetailsFetch,
  ReactionsRemove,
  sampledReactionsRendered,
} from '../ufo';

/**
 * Set of all available UFO experiences relating to reaction element
 */
export const ufoExperiences = {
  /**
   * Experience when a reaction emoji gets added
   */
  add: ReactionsAdd,
  /**
   * Experience when a reaction emoji gets removed/decrement
   */
  remove: ReactionsRemove,
  /**
   * Experience when the list of reactions gets rendered with sampling
   */
  render: (instanceId: string) => sampledReactionsRendered(instanceId),
  /**
   * Experience when a reaction details gets fetched
   */
  fetchDetails: ReactionDetailsFetch,
};

/**
 * Optional metadata information in the store used in sending the API client requests
 */
interface StoreMetadata {
  subproduct?: string;
  [k: string]: any;
}

export class MemoryReactionsStore implements Store {
  private client: Client;
  private state: State;
  private metadata: StoreMetadata | undefined;
  private callbacks: OnChangeCallback[] = [];
  private createAnalyticsEvent?: CreateUIAnalyticsEvent;

  /**
   * default initial store data
   */
  private initialState: State = {
    reactions: {},
    flash: {},
  };

  constructor(client: Client, state?: State, metadata?: StoreMetadata) {
    this.client = client;
    this.state = state ?? this.initialState;
    this.metadata = metadata;
  }

  /**
   * Update the store state data with a new data
   * @param newState new store data
   */
  private setState = (newState: Partial<State>) => {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.triggerOnChange();
  };

  /**
   * Calls any onChange callbacks in the store using latest state data.
   */
  private triggerOnChange = batch(() =>
    this.callbacks.forEach((callback) => callback(this.state)),
  );

  private setReactions = (
    containerAri: string,
    ari: string,
    reactions: ReactionsState,
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
    detailedReaction: ReactionSummary,
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

  private flash = (reaction: ReactionSummary): void => {
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

  private optmisticUpdate =
    (containerAri: string, ari: string, emojiId: string) =>
    (updater: Updater<ReactionSummary>) => {
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

        return readyState(reactions);
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
    return (updater: Updater<ReactionsReadyState>) => {
      const reactionsState = this.getReactionsState(containerAri, ari);
      if (reactionsState && reactionsState.status === ReactionStatus.ready) {
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
    reactedCallback: Updater<ReactionSummary>,
    notReactedCallback?: Updater<ReactionSummary>,
  ) {
    return (containerAri: string, ari: string, emojiId: string) => {
      this.withReadyReaction(
        containerAri,
        ari,
      )((reactionsState) => {
        const reaction: ReactionSummary = reactionsState.reactions.find(
          byEmojiId(emojiId),
        ) || {
          containerAri,
          ari,
          emojiId,
          count: 0,
          reacted: false,
        };
        const callback: Updater<ReactionSummary> =
          reaction.reacted || !notReactedCallback
            ? reactedCallback
            : notReactedCallback;

        const updatedReaction = callback(reaction);
        if (updatedReaction && !(updatedReaction instanceof Function)) {
          return readyState(
            reactionsState.reactions.map(
              updateByEmojiId(emojiId, updatedReaction) as (
                reaction: ReactionSummary,
              ) => ReactionSummary,
            ),
          );
        }
        return;
      });
    };
  }

  private doAddReaction = (reaction: ReactionSummary) => {
    const { containerAri, ari, emojiId } = reaction;
    this.optmisticUpdate(containerAri, ari, emojiId)(addOne);
    this.flash(reaction);

    const exp = ufoExperiences.add.getInstance(`${ari}|${emojiId}`);
    // ufo start reaction experience
    exp.start();
    exp.addMetadata({
      source: 'MemoryReactionsStore',
      storeMetadata: this.metadata,
      ari,
      containerAri,
      emojiId,
    });

    this.client
      .addReaction(containerAri, ari, emojiId, this.metadata)
      .then((_) => {
        if (this.createAnalyticsEvent) {
          createAndFireSafe(
            this.createAnalyticsEvent,
            createRestSucceededEvent,
            'addReaction',
          );
        }
        // ufo add reaction success
        exp.success();
      })
      .catch((error) => {
        if (isRealErrorFromService(error.code)) {
          this.createAnalyticsEvent &&
            createAndFireSafe(
              this.createAnalyticsEvent,
              createRestFailedEvent,
              'addReaction',
              error.code,
            );
          // ufo add reaction failure
          exp.failure({
            metadata: {
              error: extractErrorInfo(error),
              reason: 'addReaction fetch failed',
            },
          });
        }
        return Promise.reject(error);
      });
  };

  private doRemoveReaction = (reaction: ReactionSummary) => {
    const { containerAri, ari, emojiId } = reaction;
    const exp = ufoExperiences.remove.getInstance(`${ari}|${emojiId}`);

    // ufo start reaction experience

    exp.start();
    exp.addMetadata({
      source: 'MemoryReactionsStore',
      storeMetadata: this.metadata,
      ari,
      containerAri,
      emojiId,
    });
    this.optmisticUpdate(containerAri, ari, emojiId)(removeOne);
    this.client
      .deleteReaction(containerAri, ari, emojiId, this.metadata)
      .then((_) => {
        // ufo add reaction success
        exp.success();
      })
      .catch((error) => {
        // ufo add reaction failure
        exp.failure({
          metadata: {
            error: extractErrorInfo(error),
            reason: 'deleteReaction fetch failed',
          },
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
    const sampledExp = ufoExperiences.render(containerAri);
    const arisArr = aris.reduce(flattenAris);
    // ufo start reaction experience
    sampledExp.start({ samplingRate: SAMPLING_RATE_REACTIONS_RENDERED_EXP });
    sampledExp.addMetadata({
      source: 'MemoryReactionsStore',
      storeMetadata: this.metadata,
      containerAri,
      aris: arisArr.join(','),
    });
    this.client
      .getReactions(containerAri, arisArr)
      .then((value: Reactions) => {
        Object.keys(value).map((ari) => {
          const reactionsState = this.getReactionsState(containerAri, ari);
          const reactions =
            reactionsState && reactionsState.status === ReactionStatus.ready
              ? reactionsState.reactions
              : undefined;
          this.setReactions(
            containerAri,
            ari,
            readyState(value[ari].sort(getReactionsSortFunction(reactions))),
          );
        });
      })
      .then(() => {
        if (this.createAnalyticsEvent) {
          createAndFireSafe(
            this.createAnalyticsEvent,
            createRestSucceededEvent,
            'getReactions',
          );
        }
        sampledExp.success();
      })
      .catch((error) => {
        if (isRealErrorFromService(error.code)) {
          if (this.createAnalyticsEvent) {
            createAndFireSafe(
              this.createAnalyticsEvent,
              createRestFailedEvent,
              'getReactions',
            );
          }
          sampledExp.failure({
            metadata: {
              error: extractErrorInfo(error),
              reason: 'getReactions fetch failed',
            },
          });
        }

        const reactionsState = arisArr.reduce(
          (acc, ari) =>
            ({
              ...acc,
              [`${containerAri}|${ari}`]: {
                reactions: [],
                status: ReactionStatus.error,
              },
            } as State['reactions']),
          {},
        );
        this.setState({
          ...this.state,
          reactions: {
            ...this.state.reactions,
            ...reactionsState,
          },
        });
      });
  });

  public toggleReaction = this.withReaction(
    this.doRemoveReaction,
    this.doAddReaction,
  );
  public addReaction = this.withReaction(this.flash, this.doAddReaction);

  public getDetailedReaction = (
    containerAri: string,
    ari: string,
    emojiId: string,
  ): void => {
    const exp = ufoExperiences.fetchDetails.getInstance(`${ari}|${emojiId}`);
    exp.start();
    exp.addMetadata({
      source: 'MemoryReactionsStore',
      storeMetadata: this.metadata,
      ari,
      containerAri,
      emojiId,
    });
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
          metadata: {
            error: extractErrorInfo(error),
            reason: 'getDetailedReaction fetch failed',
          },
        });
      });
  };

  getState = () => this.state;

  onChange = (callback: OnChangeCallback): void => {
    this.callbacks.push(callback);
  };

  removeOnChangeListener = (toRemove: OnChangeCallback): void => {
    this.callbacks = this.callbacks.filter((callback) => callback !== toRemove);
  };
}
