import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import type { EditorState, Transaction } from 'prosemirror-state';
import type { Step as ProseMirrorStep } from 'prosemirror-transform';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import countBy from 'lodash/countBy';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import {
  ExperiencePerformanceTypes,
  ExperienceTypes,
  UFOExperience,
} from '@atlaskit/ufo';
import { Emitter } from '../emitter';
import { Channel } from '../channel';
import type {
  AcknowledgementErrorPayload,
  AcknowledgementPayload,
  AddStepAcknowledgementPayload,
} from '../types';
import type {
  CollabEditProvider,
  CollabParticipant,
  ResolvedEditorState,
} from '@atlaskit/editor-common/collab';
import type {
  CollabEvents,
  CollabInitPayload,
  Config,
  ErrorPayload,
  Metadata,
  NamespaceStatus,
  PresencePayload,
  StepJson,
  StepsPayload,
  TelepointerPayload,
} from '../types';

import { createLogger, getParticipant, sleep } from '../helpers/utils';
import {
  ACK_MAX_TRY,
  EVENT_ACTION,
  EVENT_STATUS,
  ADD_STEPS_TYPE,
  AnalyticsEvent,
} from '../helpers/const';
import { triggerAnalyticsEvent } from '../analytics';
import { catchup } from './catchup';
import { errorCodeMapper } from '../error-code-mapper';
import { AcknowledgementResponseTypes } from '../types';

import {
  DisconnectReason,
  socketIOReasons,
} from '../disconnected-reason-mapper';

import type { SyncUpErrorFunction } from '@atlaskit/editor-common/types';

import {
  MEASURE_NAME,
  startMeasure,
  stopMeasure,
} from '../analytics/performance';

const logger = createLogger('Provider', 'black');

const PARTICIPANT_UPDATE_INTERVAL = 300 * 1000; // 300 seconds
const SEND_PRESENCE_INTERVAL = 150 * 1000; // 150 seconds
const SEND_STEPS_THROTTLE = 500; // 0.5 second
export const CATCHUP_THROTTLE = 1 * 1000; // 1 second
const OUT_OF_SYNC_PERIOD = 3 * 1000; // 3 seconds
const noop = () => {};
export const MAX_STEP_REJECTED_ERROR = 15;

const commitStep = ({
  channel,
  steps,
  version,
  userId,
  clientId,
  documentAri,
  analyticsClient,
  onStepsAdded,
  onErrorHandled,
}: {
  channel: Channel;
  steps: readonly ProseMirrorStep[];
  version: number;
  userId: string;
  clientId: number | string;
  documentAri: string;
  onStepsAdded: (data: StepsPayload, disableAnalytics: boolean) => void;
  onErrorHandled: (error: ErrorPayload, disableAnalytics: boolean) => void;
  analyticsClient?: AnalyticsWebClient;
}) => {
  const stepsWithClientAndUserId = steps.map((step) => ({
    ...step.toJSON(),
    clientId,
    userId,
  })) as StepJson[];

  const start = new Date().getTime();
  channel.broadcast(
    'steps:commit',
    {
      steps: stepsWithClientAndUserId,
      version,
      userId,
    },
    (response: AddStepAcknowledgementPayload) => {
      const latency = new Date().getTime() - start;

      if (response.type === AcknowledgementResponseTypes.SUCCESS) {
        onStepsAdded(
          {
            steps: stepsWithClientAndUserId,
            version: response.version,
          },
          true,
        );
        let analyticStepEvent: AnalyticsEvent = {
          eventAction: EVENT_ACTION.ADD_STEPS,
          attributes: {
            eventStatus: EVENT_STATUS.SUCCESS,
            type: ADD_STEPS_TYPE.ACCEPTED,
            documentAri,
            latency,
          },
        };
        analyticStepEvent.attributes.stepType = countBy(
          stepsWithClientAndUserId,
          (stepWithClientAndUserId) => stepWithClientAndUserId.stepType!,
        );
        triggerAnalyticsEvent(analyticStepEvent, analyticsClient);
      } else if (response.type === AcknowledgementResponseTypes.ERROR) {
        onErrorHandled(response.error, true);
        triggerAnalyticsEvent(
          {
            eventAction: EVENT_ACTION.ADD_STEPS,
            attributes: {
              eventStatus: EVENT_STATUS.FAILURE,
              // User tried committing steps but they were rejected because:
              // - HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted
              // - VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly
              type:
                response.error?.data?.code === 'HEAD_VERSION_UPDATE_FAILED' ||
                response.error?.data?.code === 'VERSION_NUMBER_ALREADY_EXISTS'
                  ? ADD_STEPS_TYPE.REJECTED
                  : ADD_STEPS_TYPE.ERROR,
              documentAri,
              latency,
              error: response.error,
            },
          },
          analyticsClient,
        );
      } else {
        triggerAnalyticsEvent(
          {
            eventAction: EVENT_ACTION.ADD_STEPS,
            attributes: {
              eventStatus: EVENT_STATUS.FAILURE,
              type: ADD_STEPS_TYPE.ERROR,
              documentAri,
              latency,
              error: {
                message: 'Invalid Acknowledgement',
              },
            },
          },
          analyticsClient,
        );
      }
    },
  );
};

const throttledCommitStep = throttle(commitStep, SEND_STEPS_THROTTLE, {
  leading: false,
  trailing: true,
});

type BaseEvents = Pick<
  CollabEditProvider<CollabEvents>,
  'setup' | 'send' | 'sendMessage'
>;

export class Provider extends Emitter<CollabEvents> implements BaseEvents {
  private participants: Map<
    string,
    CollabParticipant & { userId: string; clientId: number | string }
  > = new Map();
  private channel: Channel;
  private config: Config;
  private getState: (() => EditorState) | undefined;
  private metadata: Metadata = {};
  private stepRejectCounter: number = 0;
  private analyticsClient?: AnalyticsWebClient;
  private isChannelInitialized: boolean = false;

  // To keep track of the namespace event changes from the server.
  private isNamespaceLocked: boolean = false;

  // Fires analytics to editor when collab editor cannot sync up
  private onSyncUpError?: SyncUpErrorFunction;

  // SessionID is the unique socket-session.
  private sessionId?: string;

  // ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
  private clientId?: number | string;

  // UserID is the users actual account id.
  private userId?: string;

  private participantUpdateTimeout?: number;
  private presenceUpdateTimeout?: number;

  private disconnectedAt?: number;

  constructor(config: Config) {
    super();
    this.config = config;
    this.channel = new Channel(config);
    this.isChannelInitialized = false;
    if (config.analyticsClient) {
      this.analyticsClient = config.analyticsClient;
    }
  }

  private initializeChannel = () => {
    this.emit('connecting', { initial: true });
    this.channel
      .on('connected', ({ sid, initialized }) => {
        this.sessionId = sid;
        this.emit('connected', { sid, initial: !initialized });
        // If already initialized, `connected` means reconnected
        if (
          initialized &&
          this.disconnectedAt &&
          // Offline longer than `OUT_OF_SYNC_PERIOD`
          Date.now() - this.disconnectedAt >= OUT_OF_SYNC_PERIOD
        ) {
          this.throttledCatchup();
        }
        this.disconnectedAt = undefined;
      })
      .on('init', ({ doc, version, metadata }) => {
        // Initial document and version
        this.updateDocumentWithMetadata({
          doc,
          version,
          metadata,
        });
      })
      .on('restore', this.onRestore.bind(this))
      .on('steps:added', this.onStepsAdded.bind(this))
      .on('participant:telepointer', this.onParticipantTelepointer.bind(this))
      .on('presence:joined', this.onPresenceJoined.bind(this))
      .on('presence', this.onPresence.bind(this))
      .on('participant:left', this.onParticipantLeft.bind(this))
      .on('participant:updated', this.onParticipantUpdated.bind(this))
      .on('metadata:changed', this.onMetadataChanged.bind(this))
      .on('disconnect', this.onDisconnected.bind(this))
      .on('error', this.onErrorHandled.bind(this))
      .on('status', this.onNamespaceStatusChanged.bind(this))
      .connect();
  };

  /**
   * Called by collab plugin in editor when it's ready to
   * initialize a collab session.
   */
  initialize(getState: () => EditorState) {
    return this.setup({
      getState,
    });
  }

  setup({
    getState,
    onSyncUpError,
  }: {
    getState: () => EditorState;
    onSyncUpError?: SyncUpErrorFunction;
  }): this {
    try {
      this.getState = getState;

      this.onSyncUpError = onSyncUpError || noop;

      this.clientId = (
        getState().plugins.find((p: any) => p.key === 'collab$')!.spec as any
      ).config.clientID;

      if (!this.isChannelInitialized) {
        this.initializeChannel();
        this.isChannelInitialized = true;
      }
    } catch (initError) {
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.ERROR,
          attributes: {
            attemptedAction: EVENT_ACTION.INIT_PROVIDER,
            documentAri: this.config.documentAri,
          },
          nonPrivacySafeAttributes: {
            error: initError as ErrorPayload,
          },
        },
        this.analyticsClient,
      );
      throw initError;
    }

    return this;
  }

  /**
   * We can use this function to throttle/delay
   * Any send steps operation
   *
   * The getState function will return the current EditorState
   * from the EditorView.
   */
  private sendStepsFromCurrentState() {
    const state = this.getState && this.getState();
    if (!state) {
      return;
    }

    this.send(null, null, state);
  }

  /**
   * Send steps from transaction to other participants
   * It needs the superfluous arguments because we keep the interface of the send API the same as the Synchrony plugin
   */
  send(
    _tr: Transaction | null,
    _oldState: EditorState | null,
    newState: EditorState,
  ) {
    const sendable = sendableSteps(newState);
    const version = getVersion(newState);

    // Don't send any steps before we're ready.
    if (!sendable) {
      return;
    }
    if (this.isNamespaceLocked) {
      logger('The document is temporary locked');
      return;
    }

    const { steps } = sendable;
    if (!steps || !steps.length) {
      return;
    }

    // Avoid reference issues using a
    // method outside of the provider
    // scope
    throttledCommitStep({
      channel: this.channel,
      userId: this.userId!,
      clientId: this.clientId!,
      steps,
      version,
      documentAri: this.config.documentAri,
      analyticsClient: this.analyticsClient,
      onStepsAdded: this.onStepsAdded.bind(this),
      onErrorHandled: this.onErrorHandled.bind(this),
    });
  }

  // Triggered when page recovery has emitted an 'init' event on a page client is currently connected to.
  private onRestore = ({ doc, version, metadata }: CollabInitPayload) => {
    // Preserve the unconfirmed steps to prevent data loss.
    const { steps: unconfirmedSteps } = this.getUnconfirmedSteps() || {
      steps: [],
    };

    // Reset the editor,
    //  - Replace the document, keep in sync with the server
    //  - Replace the version number, so editor is in sync with NCS server and can commit new changes.
    //  - Replace the metadata
    //  - Reserve the cursor position, in case a cursor jump.
    this.updateDocumentWithMetadata({
      doc,
      version,
      metadata,
      reserveCursor: true,
    });

    triggerAnalyticsEvent(
      {
        eventAction: EVENT_ACTION.REINITIALISE_DOCUMENT,
        attributes: {
          numUnconfirmedSteps: unconfirmedSteps.length,
          documentAri: this.config.documentAri,
        },
      },
      this.analyticsClient,
    );

    // Re-apply the unconfirmed steps, not 100% of them can be applied, if document is changed significantly.
    if (unconfirmedSteps.length > 0) {
      this.applyLocalSteps(unconfirmedSteps);
    }
  };

  /**
   * Called when we receive steps from the service
   */
  private onStepsAdded = (
    data: StepsPayload,
    disableAnalytics: boolean = false,
  ) => {
    logger(`Received steps`, { steps: data.steps, version: data.version });

    if (!data.steps) {
      logger(`No steps.. waiting..`);
      return;
    }

    const currentVersion = this.getCurrentPmVersion();
    const expectedVersion = currentVersion + data.steps.length;

    if (data.version === currentVersion) {
      logger(`Received steps we already have. Ignoring.`);
    } else if (data.version === expectedVersion) {
      this.processSteps(data, disableAnalytics);
    } else if (data.version > expectedVersion) {
      logger(
        `Version too high. Expected "${expectedVersion}" but got "${data.version}. Current local version is ${currentVersion}.`,
      );
      this.queueSteps(data);
      this.throttledCatchup();
    }
    this.updateParticipants(
      [],
      data.steps.map(({ userId }) => userId),
    );
  };

  private throttledCatchup = throttle(() => this.catchup(), CATCHUP_THROTTLE, {
    leading: false,
    trailing: true,
  });

  private filterQueue = (
    condition: (stepsPayload: StepsPayload) => boolean,
  ) => {
    this.queue = this.queue.filter(condition);
  };

  private updateDocumentWithMetadata = ({
    doc,
    version,
    metadata,
    reserveCursor,
  }: CollabInitPayload) => {
    this.emit('init', {
      doc,
      version: version,
      metadata,
      ...(reserveCursor ? { reserveCursor } : {}),
    });
    if (metadata && Object.keys(metadata).length > 0) {
      this.metadata = metadata;
      this.emit('metadata:changed', metadata);
    }
  };

  private applyLocalSteps = (steps: readonly ProseMirrorStep[]) => {
    // Re-apply local steps
    this.emit('local-steps', { steps });
  };

  private getCurrentPmVersion = () => {
    return getVersion(this.getState!());
  };

  private getUnconfirmedSteps = () => {
    return sendableSteps(this.getState!());
  };

  /**
   * Called when:
   *   * session established(offline -> online)
   *   * try to accept steps but version is behind.
   */
  private catchup = async () => {
    const start = new Date().getTime();
    // if the queue is already paused, we are busy with something else, so don't proceed.
    if (this.pauseQueue) {
      logger(`Queue is paused. Aborting.`);
      return;
    }
    this.pauseQueue = true;
    try {
      await catchup({
        getCurrentPmVersion: this.getCurrentPmVersion,
        fetchCatchup: this.channel.fetchCatchup.bind(this.channel),
        getUnconfirmedSteps: this.getUnconfirmedSteps,
        filterQueue: this.filterQueue,
        updateDocumentWithMetadata: this.updateDocumentWithMetadata,
        applyLocalSteps: this.applyLocalSteps,
      });
      const latency = new Date().getTime() - start;
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.CATCHUP,
          attributes: {
            eventStatus: EVENT_STATUS.SUCCESS,
            latency,
            documentAri: this.config.documentAri,
          },
        },
        this.analyticsClient,
      );
    } catch (error) {
      const latency = new Date().getTime() - start;
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.CATCHUP,
          attributes: {
            eventStatus: EVENT_STATUS.FAILURE,
            error: error as ErrorPayload,
            latency,
            documentAri: this.config.documentAri,
          },
        },
        this.analyticsClient,
      );
      logger(`Catch-Up Failed:`, (error as ErrorPayload).message);
    } finally {
      this.pauseQueue = false;
      this.processQueue();
      this.sendStepsFromCurrentState();
      this.stepRejectCounter = 0;
    }
  };

  /**
   * @param error - The error to handle
   * @param disableAnalytics - If analytics is already dispatched for this error, re-sending it here can be disabled
   */
  private onErrorHandled = (
    error: ErrorPayload,
    disableAnalytics: boolean = false,
  ) => {
    // User tried committing steps but they were rejected because:
    // HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted
    // VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly
    if (
      error.data?.code === 'HEAD_VERSION_UPDATE_FAILED' ||
      error.data?.code === 'VERSION_NUMBER_ALREADY_EXISTS'
    ) {
      // TODO: Remove this analytics logic once we have validated the ack messages and aren't likely to go back to a generic error handler
      if (!disableAnalytics) {
        triggerAnalyticsEvent(
          {
            eventAction: EVENT_ACTION.ADD_STEPS,
            attributes: {
              eventStatus: EVENT_STATUS.FAILURE,
              type: ADD_STEPS_TYPE.REJECTED,
              error,
              documentAri: this.config.documentAri,
            },
          },
          this.analyticsClient,
        );
      }
      this.stepRejectCounter++;
      logger(`Steps rejected (tries=${this.stepRejectCounter})`);

      if (this.stepRejectCounter >= MAX_STEP_REJECTED_ERROR) {
        logger(
          `The steps were rejected too many times (tries=${this.stepRejectCounter}, limit=${MAX_STEP_REJECTED_ERROR}). Trying to catch-up.`,
        );
        this.throttledCatchup();
      }
    } else {
      const mappedError = errorCodeMapper(error);
      // TODO: Remove this analytics logic once we have validated the ack messages and aren't likely to go back to a generic error handler
      if (!disableAnalytics) {
        triggerAnalyticsEvent(
          {
            eventAction: EVENT_ACTION.ERROR,
            attributes: {
              documentAri: this.config.documentAri,
              mappedError,
            },
            nonPrivacySafeAttributes: {
              error,
            },
          },
          this.analyticsClient,
        );
      }
      this.emit('error', mappedError);
      logger('Error from collab service', error);
    }
  };

  private pauseQueue?: boolean;
  private queue: StepsPayload[] = [];

  private queueSteps(data: StepsPayload) {
    logger(`Queueing data for version "${data.version}".`);

    const orderedQueue = [...this.queue, data].sort((a, b) =>
      a.version > b.version ? 1 : -1,
    );

    this.queue = orderedQueue;
  }

  private processQueue() {
    if (this.pauseQueue) {
      logger(`Queue is paused. Aborting.`);
      return;
    }

    logger(`Looking for processable data.`);

    if (this.queue.length > 0) {
      const firstItem = this.queue.shift();
      const currentVersion = this.getCurrentPmVersion();
      const expectedVersion = currentVersion + firstItem!.steps.length;
      if (firstItem!.version === expectedVersion) {
        logger(`Applying data from queue!`);
        this.processSteps(firstItem!);
        // recur
        this.processQueue();
      }
    }
  }

  private processSteps(data: StepsPayload, disableAnalytics: boolean = false) {
    const { version, steps } = data;
    logger(`Processing data. Version "${version}".`);

    if (steps?.length) {
      const clientIds = steps.map(({ clientId }) => clientId);
      this.emit('data', { json: steps, version, userIds: clientIds });
      // If steps can apply to local editor successfully, no need to accumulate the error counter.
      this.stepRejectCounter = 0;
      // TODO: Remove this analytics logic after we've validated the ack call-backs
      if (!disableAnalytics && clientIds.indexOf(this.clientId!) >= 0) {
        let analyticStepEvent: AnalyticsEvent = {
          eventAction: EVENT_ACTION.ADD_STEPS,
          attributes: {
            eventStatus: EVENT_STATUS.SUCCESS,
            type: ADD_STEPS_TYPE.ACCEPTED,
            documentAri: this.config.documentAri,
          },
        };
        analyticStepEvent.attributes.stepType = countBy(
          steps,
          (step) => step.stepType,
        );
        triggerAnalyticsEvent(analyticStepEvent, this.analyticsClient);
      }
      this.emitTelepointersFromSteps(steps);

      // Resend local steps if none of the received steps originated with us!
      if (clientIds.indexOf(this.clientId!) === -1) {
        setTimeout(() => this.sendStepsFromCurrentState(), 100);
      }
    }
  }

  /**
   * Send messages, such as telepointers, to other participants.
   */
  sendMessage(data: any) {
    if (!data) {
      return;
    }

    const { type, ...rest } = data;
    const { userId, sessionId, clientId } = this;
    switch (type) {
      case 'telepointer':
        const telepointerExperience = new UFOExperience(
          'collab-provider.telepointer',
          {
            type: ExperienceTypes.Operation,
            performanceType: ExperiencePerformanceTypes.Custom,
            performanceConfig: {
              histogram: {
                [ExperiencePerformanceTypes.Custom]: {
                  duration: '250_500_1000_1500_2000_3000_4000',
                },
              },
            },
          },
        );
        telepointerExperience.addMetadata({
          documentAri: this.config.documentAri,
        });
        telepointerExperience.start();

        const { selection } = rest;
        this.channel.broadcast(
          'participant:telepointer',
          {
            selection,
            userId: userId!,
            sessionId: sessionId!,
            clientId: clientId!,
          },
          (response: AcknowledgementPayload) => {
            if (response.type === AcknowledgementResponseTypes.SUCCESS) {
              telepointerExperience.success();
            } else if (response.type === AcknowledgementResponseTypes.ERROR) {
              const errorMessage = (response as AcknowledgementErrorPayload)
                .error;
              telepointerExperience.addMetadata({
                error: errorMessage,
              });
              logger(
                'Error from collab service with telepointer broadcast',
                errorMessage,
              );
              telepointerExperience.failure();
            } else {
              // Abort if invalid ACK sent
              telepointerExperience.abort();
            }
          },
        );
        break;
    }
  }

  private sendPresence = () => {
    if (this.presenceUpdateTimeout) {
      clearTimeout(this.presenceUpdateTimeout);
    }
    this.channel.broadcast('participant:updated', {
      sessionId: this.sessionId!,
      userId: this.userId!,
      clientId: this.clientId!,
    });

    this.presenceUpdateTimeout = window.setTimeout(
      () => this.sendPresence(),
      SEND_PRESENCE_INTERVAL,
    );
  };

  /**
   * Called when a participant joins the session.
   *
   * We keep track of participants internally in this class, and emit the `presence` event to update
   * the active avatars in the editor.
   * This method will be triggered from backend to notify all participants to exchange presence
   *
   */
  private onPresenceJoined = ({ sessionId }: PresencePayload) => {
    logger('Participant joined with session: ', sessionId);

    // This expose existing users to the newly joined user
    this.sendPresence();
  };

  private onPresence = ({ userId }: PresencePayload) => {
    logger('onPresence userId: ', userId);
    this.userId = userId;
    this.sendPresence();
    this.channel.sendPresenceJoined();
  };

  /**
   * Called when a metadata is changed.
   *
   */
  private onMetadataChanged = (metadata: Metadata) => {
    if (metadata !== undefined && !isEqual(this.metadata, metadata)) {
      this.metadata = metadata;
      this.emit('metadata:changed', metadata);
    }
  };

  /**
   * Called when a participant leaves the session.
   *
   * We emit the `presence` event to update the active avatars in the editor.
   */
  private onParticipantLeft = ({ sessionId }: PresencePayload) => {
    logger(`Participant left`);

    this.participants.delete(sessionId);
    this.emit('presence', { left: [{ sessionId }] });
  };

  /**
   * Called when we receive an update event from another participant.
   */
  private onParticipantUpdated = ({
    sessionId,
    timestamp,
    userId,
    clientId,
  }: PresencePayload) => {
    this.updateParticipant({ sessionId, timestamp, userId, clientId });
  };

  /**
   * Called when we receive a telepointer update from another
   * participant.
   */
  private onParticipantTelepointer = ({
    sessionId,
    timestamp,
    selection,
    userId,
    clientId,
  }: TelepointerPayload) => {
    if (sessionId === this.sessionId) {
      return;
    }

    const participant = this.participants.get(sessionId);

    // Ignore old telepointer events
    if (participant && participant.lastActive > timestamp) {
      return;
    }

    // Set last active
    this.updateParticipant({ sessionId, timestamp, userId, clientId });
    this.emit('telepointer', { type: 'telepointer', selection, sessionId });
  };

  private updateParticipant = async ({
    sessionId,
    timestamp,
    userId,
    clientId,
  }: PresencePayload) => {
    if (!userId) {
      // If userId does not exsit, does nothing here to prevent duplication.
      return;
    }
    const { getUser } = this.config;
    const {
      name = '',
      email = '',
      avatar = '',
    } = await (getUser ? getUser(userId) : getParticipant(userId));

    const isNewParticipant = !this.participants.has(sessionId);
    if (isNewParticipant) {
      logger('new Participant updated', {
        name,
        avatar,
      });
    }

    this.participants.set(sessionId, {
      name,
      email,
      avatar,
      sessionId,
      lastActive: timestamp,
      userId,
      clientId,
    });

    // Collab-plugin expects an array of users that joined.
    this.updateParticipants(
      isNewParticipant ? [this.participants.get(sessionId)!] : [],
    );
  };

  /**
   * Keep list of participants up to date. Filter out inactive users etc.
   */
  private updateParticipants = (
    joined: CollabParticipant[] = [],
    userIds: (number | string)[] = [],
  ) => {
    if (this.participantUpdateTimeout) {
      clearTimeout(this.participantUpdateTimeout);
    }
    const now = new Date().getTime();

    Array.from(this.participants.values()).forEach((p) => {
      if (userIds.indexOf(p.userId) !== -1) {
        this.participants.set(p.sessionId, {
          ...p,
          lastActive: now,
        });
      }
    });

    // Filter out participants that's been inactive for more than 5 minutes.
    const left = Array.from(this.participants.values()).filter(
      (p) =>
        p.sessionId !== this.sessionId &&
        now - p.lastActive > PARTICIPANT_UPDATE_INTERVAL,
    );

    left.forEach((p) => this.participants.delete(p.sessionId));

    if (joined.length || left.length) {
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.UPDATE_PARTICIPANTS,
          attributes: {
            participants: this.participants.size ?? 1,
            documentAri: this.config.documentAri,
          },
        },
        this.analyticsClient,
      );
      this.emit('presence', {
        ...(joined.length ? { joined } : {}),
        ...(left.length ? { left } : {}),
      });
    }

    this.participantUpdateTimeout = window.setTimeout(
      () => this.updateParticipants(),
      PARTICIPANT_UPDATE_INTERVAL,
    );
  };

  private emitTelepointersFromSteps(steps: StepJson[]) {
    steps.forEach((step) => {
      const [participant] = Array.from(this.participants.values()).filter(
        (p) => p.clientId === step.clientId,
      );
      if (participant) {
        const { stepType, to, from, slice = { content: [] } } = step as any;

        const [node] = slice.content;

        if (
          stepType === 'replace' &&
          to === from &&
          slice.content.length === 1 &&
          node.type === 'text' &&
          node.text.length === 1
        ) {
          this.emit('telepointer', {
            sessionId: participant.sessionId,
            selection: {
              type: 'textSelection',
              anchor: from + 1,
              head: to + 1,
            },
            type: 'telepointer',
          });
        }
      }
    });
  }

  private disconnectedReasonMapper = (reason: string): DisconnectReason => {
    switch (reason) {
      case socketIOReasons.IO_CLIENT_DISCONNECT:
        return DisconnectReason.CLIENT_DISCONNECT;
      case socketIOReasons.IO_SERVER_DISCONNECT:
        return DisconnectReason.SERVER_DISCONNECT;
      case socketIOReasons.TRANSPORT_CLOSED:
        return DisconnectReason.SOCKET_CLOSED;
      case socketIOReasons.TRANSPORT_ERROR:
        return DisconnectReason.SOCKET_ERROR;
      case socketIOReasons.PING_TIMEOUT:
        return DisconnectReason.SOCKET_TIMEOUT;
      default:
        return DisconnectReason.UNKNOWN_DISCONNECT;
    }
  };

  private onDisconnected = ({ reason }: { reason: string }) => {
    this.disconnectedAt = Date.now();
    const left = Array.from(this.participants.values());
    this.participants.clear();
    this.emit('disconnected', {
      reason: this.disconnectedReasonMapper(reason),
      sid: this.sessionId!,
    });
    if (left.length) {
      this.emit('presence', { left });
    }
  };

  destroy() {
    return this.disconnect();
  }

  disconnect() {
    return this.unsubscribeAll();
  }

  setTitle(title: string, broadcast?: boolean) {
    if (broadcast) {
      this.channel.sendMetadata({ title });
    }
    Object.assign(this.metadata, { title });
  }

  setEditorWidth(editorWidth: string, broadcast?: boolean) {
    if (broadcast) {
      this.channel.sendMetadata({ editorWidth });
    }
    Object.assign(this.metadata, { editorWidth });
  }

  setMetadata(metadata: Metadata) {
    this.channel.sendMetadata(metadata);
    Object.assign(this.metadata, metadata);
  }

  getFinalAcknowledgedState = async (): Promise<ResolvedEditorState> => {
    const maxAttemptsToSync = ACK_MAX_TRY;
    let count = 0;
    let unconfirmedState = this.getUnconfirmedSteps();

    if (unconfirmedState && unconfirmedState.steps.length) {
      startMeasure(MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS);
      // We use origins here as steps can be rebased. When steps are rebased a new step is created.
      // This means that we can not track if it has been removed from the unconfirmed array or not.
      // Origins points to the original transaction that the step was created in. This is never changed
      // and gets passed down when a step is rebased.
      const unconfirmedTrs = unconfirmedState.origins;
      const lastTr = unconfirmedTrs[unconfirmedTrs.length - 1];
      let isLastTrConfirmed = false;

      while (!isLastTrConfirmed) {
        this.sendStepsFromCurrentState();

        await sleep(1000);

        const nextUnconfirmedState = this.getUnconfirmedSteps();
        if (nextUnconfirmedState && nextUnconfirmedState.steps.length) {
          const nextUnconfirmedTrs = nextUnconfirmedState.origins;
          isLastTrConfirmed = !nextUnconfirmedTrs.some((tr) => tr === lastTr);
        } else {
          isLastTrConfirmed = true;
        }

        if (!isLastTrConfirmed && count++ >= maxAttemptsToSync) {
          if (this.onSyncUpError) {
            const state = this.getState!();

            this.onSyncUpError({
              lengthOfUnconfirmedSteps: nextUnconfirmedState?.steps.length,
              tries: count,
              maxRetries: maxAttemptsToSync,
              clientId: this.clientId,
              version: getVersion(state),
            });
          }
          const measure = stopMeasure(MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS);
          triggerAnalyticsEvent(
            {
              eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
              attributes: {
                eventStatus: EVENT_STATUS.FAILURE,
                latency: measure?.duration,
                documentAri: this.config.documentAri,
                // upon failure, emit the number of unconfirmed steps we attempted to sync
                numUnconfirmedSteps: nextUnconfirmedState?.steps.length,
              },
            },
            this.analyticsClient,
          );
          throw new Error("Can't sync up with Collab Service");
        }
      }

      const measure = stopMeasure(MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS);
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
          attributes: {
            eventStatus: EVENT_STATUS.SUCCESS,
            latency: measure?.duration,
            documentAri: this.config.documentAri,
            // upon success, emit the total number of unconfirmed steps we synced
            numUnconfirmedSteps: unconfirmedState.steps.length,
          },
        },
        this.analyticsClient,
      );
    }

    const state = this.getState!();
    // Convert ProseMirror document in Editor state to ADF document
    let adfDocument;
    try {
      startMeasure(MEASURE_NAME.CONVERT_PM_TO_ADF);
      adfDocument = new JSONTransformer().encode(state.doc);
      const measure = stopMeasure(MEASURE_NAME.CONVERT_PM_TO_ADF);
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.CONVERT_PM_TO_ADF,
          attributes: {
            eventStatus: EVENT_STATUS.SUCCESS,
            latency: measure?.duration,
            documentAri: this.config.documentAri,
          },
        },
        this.analyticsClient,
      );
    } catch (error) {
      const measure = stopMeasure(MEASURE_NAME.CONVERT_PM_TO_ADF);
      triggerAnalyticsEvent(
        {
          eventAction: EVENT_ACTION.CONVERT_PM_TO_ADF,
          attributes: {
            eventStatus: EVENT_STATUS.FAILURE,
            latency: measure?.duration,
            error: error as ErrorPayload,
            documentAri: this.config.documentAri,
          },
        },
        this.analyticsClient,
      );
      logger(`Error when converting PM document to ADF: `, error);
    }
    return {
      content: adfDocument,
      title: this.metadata.title?.toString(),
      stepVersion: getVersion(state),
    };
  };

  /**
   * Unsubscribe from all events emitted by this provider.
   */
  unsubscribeAll() {
    super.unsubscribeAll();
    this.channel.disconnect();
    return this;
  }

  /**
   * ESS-2916 namespace status event- lock/unlock
   */

  private onNamespaceStatusChanged = async (data: NamespaceStatus) => {
    const { isLocked, waitTimeInMs, timestamp } = data;
    const start = Date.now();
    logger(`Received a namespace status changed event `, { data });
    if (isLocked && waitTimeInMs) {
      this.isNamespaceLocked = true;
      logger(`Received a namespace status change event `, {
        isLocked,
      });

      // To protect the collab editing process from locked out due to BE
      setTimeout(() => {
        logger(`The namespace lock has expired`, {
          waitTime: Date.now() - start,
          timestamp,
        });
        this.isNamespaceLocked = false;
      }, waitTimeInMs);
      return;
    }
    this.isNamespaceLocked = false;
    logger(`The page lock has expired`);
  };
}
