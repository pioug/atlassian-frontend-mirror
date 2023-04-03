import { getVersion, sendableSteps } from '@atlaskit/prosemirror-collab';
import type { EditorState, Transaction } from 'prosemirror-state';
import type { Step as ProseMirrorStep } from 'prosemirror-transform';
import throttle from 'lodash/throttle';
import isEqual from 'lodash/isEqual';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Emitter } from '../emitter';
import { Channel } from '../channel';
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
import { ACK_MAX_TRY, EVENT_ACTION, EVENT_STATUS } from '../helpers/const';
import AnalyticsHelper from '../analytics';
import { catchup } from './catchup';
import { ErrorCodeMapper, errorCodeMapper } from '../errors/error-code-mapper';

import { disconnectedReasonMapper } from '../disconnected-reason-mapper';

import type { SyncUpErrorFunction } from '@atlaskit/editor-common/types';

import {
  MEASURE_NAME,
  startMeasure,
  stopMeasure,
} from '../analytics/performance';
import { commitStep } from './commit-step';
import { telepointerCallback, telepointersFromStep } from './telepointers';

const logger = createLogger('Provider', 'black');

const PARTICIPANT_UPDATE_INTERVAL = 300 * 1000; // 300 seconds
const SEND_PRESENCE_INTERVAL = 150 * 1000; // 150 seconds
const SEND_STEPS_THROTTLE = 500; // 0.5 second
const CATCHUP_THROTTLE = 1 * 1000; // 1 second
const OUT_OF_SYNC_PERIOD = 3 * 1000; // 3 seconds
const noop = () => {};
export const MAX_STEP_REJECTED_ERROR = 15;

export const throttledCommitStep = throttle(commitStep, SEND_STEPS_THROTTLE, {
  leading: false,
  trailing: true,
});

type BaseEvents = Pick<
  CollabEditProvider<CollabEvents>,
  'setup' | 'send' | 'sendMessage'
>;

export type ParticipantsMap = Map<
  string,
  CollabParticipant & { userId: string; clientId: number | string }
>;

export class Provider extends Emitter<CollabEvents> implements BaseEvents {
  private participants: ParticipantsMap = new Map();
  private channel: Channel;
  private config: Config;
  private getState: (() => EditorState) | undefined;
  private metadata: Metadata = {};
  private stepRejectCounter: number = 0;
  private analyticsHelper?: AnalyticsHelper;
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
    this.analyticsHelper = new AnalyticsHelper(
      this.config.documentAri,
      config.analyticsClient,
    );
    this.channel = new Channel(config, this.analyticsHelper);
    this.isChannelInitialized = false;
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
      this.analyticsHelper?.sendErrorEvent(
        initError,
        'Error while initialising the provider',
      );
      // Throw error so consumers are aware the initialisation failed when initialising themselves
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
    const state = this.getState?.();
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
    const unconfirmedStepsData = sendableSteps(newState);
    const version = getVersion(newState);

    // Don't send any steps before we're ready.
    if (!unconfirmedStepsData) {
      return;
    }
    // Don't send steps while the document is locked (eg. when restoring the document)
    if (this.isNamespaceLocked) {
      logger('The document is temporary locked');
      return;
    }

    const unconfirmedSteps = unconfirmedStepsData.steps;
    if (!unconfirmedSteps?.length) {
      return;
    }

    // Avoid reference issues using a
    // method outside of the provider
    // scope
    throttledCommitStep({
      channel: this.channel,
      userId: this.userId!,
      clientId: this.clientId!,
      steps: unconfirmedSteps,
      version,
      onStepsAdded: this.onStepsAdded.bind(this),
      onErrorHandled: this.onErrorHandled.bind(this),
      analyticsHelper: this.analyticsHelper,
    });
  }

  // Triggered when page recovery has emitted an 'init' event on a page client is currently connected to.
  private onRestore = ({ doc, version, metadata }: CollabInitPayload) => {
    // Preserve the unconfirmed steps to prevent data loss.
    const unconfirmedSteps = this.getUnconfirmedSteps();

    try {
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

      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.REINITIALISE_DOCUMENT,
        EVENT_STATUS.SUCCESS,
        { numUnconfirmedSteps: unconfirmedSteps?.length },
      );
      // Re-apply the unconfirmed steps, not 100% of them can be applied, if document is changed significantly.
      if (unconfirmedSteps?.length) {
        this.applyLocalSteps(unconfirmedSteps);
      }
    } catch (restoreError: unknown) {
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.REINITIALISE_DOCUMENT,
        EVENT_STATUS.FAILURE,
        { numUnconfirmedSteps: unconfirmedSteps?.length },
      );
      this.analyticsHelper?.sendErrorEvent(
        restoreError,
        'Error while reinitialising document',
      );
      this.onErrorHandled({
        message: 'Caught error while trying to recover the document',
        data: {
          status: 500, // Meaningless, remove when we review error structure
          code: ErrorCodeMapper.restoreError.code,
        },
      });
    }
  };

  /**
   * Called when we receive steps from the service
   */
  private onStepsAdded = (data: StepsPayload) => {
    logger(`Received steps`, { steps: data.steps, version: data.version });

    if (!data.steps) {
      logger(`No steps.. waiting..`);
      return;
    }

    try {
      const currentVersion = this.getCurrentPmVersion();
      const expectedVersion = currentVersion + data.steps.length;
      if (data.version === currentVersion) {
        logger(`Received steps we already have. Ignoring.`);
      } else if (data.version === expectedVersion) {
        this.processSteps(data);
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
    } catch (stepsAddedError) {
      this.analyticsHelper?.sendErrorEvent(
        stepsAddedError,
        'Error while adding steps in the provider',
      );
      this.onErrorHandled({
        message: 'Error while adding steps in the provider',
        data: {
          status: 500, // Meaningless, remove when we review error structure
          code: ErrorCodeMapper.internalError.code,
        },
      });
    }
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
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('No editor state when calling ProseMirror function'),
        'getCurrentPmVersion called without state',
      );
      return 0;
    }
    return getVersion(state);
  };

  private getUnconfirmedSteps = (): readonly ProseMirrorStep[] | undefined => {
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('No editor state when calling ProseMirror function'),
        'getUnconfirmedSteps called without state',
      );
      return;
    }
    return sendableSteps(state)?.steps;
  };

  private getUnconfirmedStepsOrigins = () => {
    const state = this.getState?.();
    if (!state) {
      this.analyticsHelper?.sendErrorEvent(
        new Error('No editor state when calling ProseMirror function'),
        'getUnconfirmedStepsOrigins called without state',
      );
      return;
    }
    return sendableSteps(state)?.origins;
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
        getUnconfirmedStepsOrigins: this.getUnconfirmedStepsOrigins,
        filterQueue: this.filterQueue,
        updateDocumentWithMetadata: this.updateDocumentWithMetadata,
        applyLocalSteps: this.applyLocalSteps,
      });
      const latency = new Date().getTime() - start;
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.CATCHUP,
        EVENT_STATUS.SUCCESS,
        {
          latency,
        },
      );
    } catch (error) {
      const latency = new Date().getTime() - start;
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.CATCHUP,
        EVENT_STATUS.FAILURE,
        {
          latency,
        },
      );
      this.analyticsHelper?.sendErrorEvent(error, 'Error while catching up');
      logger(`Catch-Up Failed:`, (error as ErrorPayload).message);
    } finally {
      this.pauseQueue = false;
      this.processQueue();
      this.sendStepsFromCurrentState(); // this will eventually retry catchup as it calls commitStep which will either catchup on onStepsAdded or onErrorHandled
      this.stepRejectCounter = 0;
    }
  };

  /**
   * @param error - The error to handle
   */
  private onErrorHandled = (error: ErrorPayload) => {
    // User tried committing steps but they were rejected because:
    // HEAD_VERSION_UPDATE_FAILED: the collab service's latest stored step tail version didn't correspond to the head version of the first step submitted
    // VERSION_NUMBER_ALREADY_EXISTS: while storing the steps there was a conflict meaning someone else wrote steps into the database more quickly
    if (
      error.data?.code === 'HEAD_VERSION_UPDATE_FAILED' ||
      error.data?.code === 'VERSION_NUMBER_ALREADY_EXISTS'
    ) {
      this.stepRejectCounter++;
      logger(`Steps rejected (tries=${this.stepRejectCounter})`);

      if (this.stepRejectCounter >= MAX_STEP_REJECTED_ERROR) {
        logger(
          `The steps were rejected too many times (tries=${this.stepRejectCounter}, limit=${MAX_STEP_REJECTED_ERROR}). Trying to catch-up.`,
        );
        this.throttledCatchup();
      } else {
        // If committing steps failed try again automatically in 1s
        // This makes it more likely that unconfirmed steps trigger a catch-up
        // within 15s even if there is no one editing actively (or draft sync polling)
        // reducing the risk of data loss at the expense of step commits
        setTimeout(() => this.sendStepsFromCurrentState(), 1000);
      }
    } else {
      logger('Error from collab service', error);
      const mappedError = errorCodeMapper(error);
      // Temporarily only emit errors to Confluence very intentionally because they will disconnect the collab provider
      if (mappedError) {
        this.emit('error', mappedError);
      }
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

  private processSteps(data: StepsPayload) {
    const { version, steps } = data;
    logger(`Processing data. Version "${version}".`);

    if (steps?.length) {
      try {
        const clientIds = steps.map(({ clientId }) => clientId);
        this.emit('data', { json: steps, version, userIds: clientIds });
        // If steps can apply to local editor successfully, no need to accumulate the error counter.
        this.stepRejectCounter = 0;
        this.emitTelepointersFromSteps(steps);

        // Resend local steps if none of the received steps originated with us!
        if (clientIds.indexOf(this.clientId!) === -1) {
          setTimeout(() => this.sendStepsFromCurrentState(), 100);
        }
      } catch (error) {
        logger(
          `Processing steps failed with error: ${error}. Triggering catch up call.`,
        );
        this.analyticsHelper?.sendErrorEvent(
          error,
          'Error while processing steps',
        );
        this.throttledCatchup();
      }
    }
  }

  /**
   * Send messages, such as telepointers, to other participants.
   */
  sendMessage(data: any) {
    if (data?.type === 'telepointer') {
      try {
        const payload = {
          userId: this.userId!,
          sessionId: this.sessionId!,
          clientId: this.clientId!,
          selection: data.selection,
        };
        const callback = telepointerCallback(this.config.documentAri);
        this.channel.broadcast('participant:telepointer', payload, callback);
      } catch (error) {
        // We don't want to throw errors for Presence features as they tend to self-restore
        this.analyticsHelper?.sendErrorEvent(
          error,
          'Error while sending message - telepointer',
        );
      }
    }
  }

  private sendPresence = () => {
    try {
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
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while sending presence',
      );
    }
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
    try {
      logger('Participant joined with session: ', sessionId);
      // This expose existing users to the newly joined user
      this.sendPresence();
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while joining presence',
      );
    }
  };

  private onPresence = ({ userId }: PresencePayload) => {
    try {
      logger('onPresence userId: ', userId);
      this.userId = userId;
      this.sendPresence();
      this.channel.sendPresenceJoined();
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while receiving presence',
      );
    }
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
    try {
      logger(`Participant left`);

      this.participants.delete(sessionId);
      this.emit('presence', { left: [{ sessionId }] });
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while participant leaving',
      );
    }
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
    try {
      this.updateParticipant({ sessionId, timestamp, userId, clientId });
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while handling participant updated event',
      );
    }
  };

  /**
   * Called when we receive a telepointer update from another
   * participant.
   */
  private onParticipantTelepointer = (data: TelepointerPayload) => {
    try {
      const { sessionId, selection, timestamp } = data;
      const participant = this.participants.get(sessionId);
      if (
        sessionId === this.sessionId ||
        // Ignore old telepointer events
        (participant && participant.lastActive > timestamp)
      ) {
        return;
      }

      // Set last active
      this.updateParticipant(data);
      this.emit('telepointer', {
        type: 'telepointer',
        selection,
        sessionId,
      });
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while handling participant telepointer event',
      );
    }
  };

  private updateParticipant = async ({
    sessionId,
    timestamp,
    userId,
    clientId,
  }: PresencePayload) => {
    try {
      if (!userId) {
        // If userId does not exist, do nothing here to prevent duplication.
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
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while updating participant',
      );
    }
  };

  /**
   * Keep list of participants up to date. Filter out inactive users etc.
   */
  private updateParticipants = (
    joined: CollabParticipant[] = [],
    userIds: (number | string)[] = [],
  ) => {
    try {
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
        this.analyticsHelper?.sendActionEvent(
          EVENT_ACTION.UPDATE_PARTICIPANTS,
          EVENT_STATUS.SUCCESS,
          { participants: this.participants.size ?? 1 },
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
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while updating participants',
      );
    }
  };

  private emitTelepointersFromSteps(steps: StepJson[]) {
    try {
      steps.forEach((step) => {
        const event = telepointersFromStep(this.participants, step);
        if (event) {
          this.emit('telepointer', event);
        }
      });
    } catch (error) {
      // We don't want to throw errors for Presence features as they tend to self-restore
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while emitting telepointers from steps',
      );
    }
  }

  // Note: this gets triggered on page reload for Firefox (not other browsers) because of closeOnBeforeunload: false
  private onDisconnected = ({ reason }: { reason: string }) => {
    this.disconnectedAt = Date.now();
    const left = Array.from(this.participants.values());
    this.participants.clear();
    this.emit('disconnected', {
      reason: disconnectedReasonMapper(reason),
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

  getCurrentState = async (): Promise<ResolvedEditorState> => {
    try {
      startMeasure(MEASURE_NAME.GET_CURRENT_STATE, this.analyticsHelper);

      // Convert ProseMirror document in Editor state to ADF document
      const state = this.getState!();
      const adfDocument = new JSONTransformer().encode(state.doc);

      const currentState = {
        content: adfDocument,
        title: this.metadata.title?.toString(),
        stepVersion: getVersion(state),
      };

      const measure = stopMeasure(
        MEASURE_NAME.GET_CURRENT_STATE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.GET_CURRENT_STATE,
        EVENT_STATUS.SUCCESS,
        {
          latency: measure?.duration,
        },
      );
      return currentState;
    } catch (error) {
      const measure = stopMeasure(
        MEASURE_NAME.GET_CURRENT_STATE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.GET_CURRENT_STATE,
        EVENT_STATUS.FAILURE,
        {
          latency: measure?.duration,
        },
      );
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while returning ADF version of current draft document',
      );
      throw error; // Reject the promise so the consumer can react to it failing
    }
  };

  private commitUnconfirmedSteps = async () => {
    const unconfirmedSteps = this.getUnconfirmedSteps();
    try {
      if (unconfirmedSteps?.length) {
        startMeasure(
          MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS,
          this.analyticsHelper,
        );

        let count = 0;
        // We use origins here as steps can be rebased. When steps are rebased a new step is created.
        // This means that we can not track if it has been removed from the unconfirmed array or not.
        // Origins points to the original transaction that the step was created in. This is never changed
        // and gets passed down when a step is rebased.
        const unconfirmedTrs = this.getUnconfirmedStepsOrigins();
        const lastTr = unconfirmedTrs?.[unconfirmedTrs.length - 1];
        let isLastTrConfirmed = false;

        while (!isLastTrConfirmed) {
          this.sendStepsFromCurrentState();

          await sleep(1000);

          const nextUnconfirmedSteps = this.getUnconfirmedSteps();
          if (nextUnconfirmedSteps?.length) {
            const nextUnconfirmedTrs = this.getUnconfirmedStepsOrigins();
            isLastTrConfirmed = !nextUnconfirmedTrs?.some(
              (tr) => tr === lastTr,
            );
          } else {
            isLastTrConfirmed = true;
          }

          if (!isLastTrConfirmed && count++ >= ACK_MAX_TRY) {
            if (this.onSyncUpError) {
              const state = this.getState!();

              this.onSyncUpError({
                lengthOfUnconfirmedSteps: nextUnconfirmedSteps?.length,
                tries: count,
                maxRetries: ACK_MAX_TRY,
                clientId: this.clientId,
                version: getVersion(state),
              });
            }

            throw new Error("Can't sync up with Collab Service");
          }
        }

        const measure = stopMeasure(
          MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS,
          this.analyticsHelper,
        );
        this.analyticsHelper?.sendActionEvent(
          EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
          EVENT_STATUS.SUCCESS,
          {
            latency: measure?.duration,
            // upon success, emit the total number of unconfirmed steps we synced
            numUnconfirmedSteps: unconfirmedSteps?.length,
          },
        );
      }
    } catch (error) {
      const measure = stopMeasure(
        MEASURE_NAME.COMMIT_UNCONFIRMED_STEPS,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.COMMIT_UNCONFIRMED_STEPS,
        EVENT_STATUS.FAILURE,
        {
          latency: measure?.duration,
          numUnconfirmedSteps: unconfirmedSteps?.length,
        },
      );
      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while committing unconfirmed steps',
      );
      throw error;
    }
  };

  getFinalAcknowledgedState = async (): Promise<ResolvedEditorState> => {
    try {
      startMeasure(MEASURE_NAME.PUBLISH_PAGE, this.analyticsHelper);

      await this.commitUnconfirmedSteps();

      const currentState = await this.getCurrentState();

      const measure = stopMeasure(
        MEASURE_NAME.PUBLISH_PAGE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.PUBLISH_PAGE,
        EVENT_STATUS.SUCCESS,
        {
          latency: measure?.duration,
        },
      );

      return currentState;
    } catch (error) {
      const measure = stopMeasure(
        MEASURE_NAME.PUBLISH_PAGE,
        this.analyticsHelper,
      );
      this.analyticsHelper?.sendActionEvent(
        EVENT_ACTION.PUBLISH_PAGE,
        EVENT_STATUS.FAILURE,
        {
          latency: measure?.duration,
        },
      );

      this.analyticsHelper?.sendErrorEvent(
        error,
        'Error while returning ADF version of the final draft document',
      );
      throw error; // Reject the promise so the consumer can react to it failing
    }
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
