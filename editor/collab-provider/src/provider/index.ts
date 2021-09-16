import { getVersion, sendableSteps } from 'prosemirror-collab';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import throttle from 'lodash/throttle';
import isequal from 'lodash/isEqual';

import { Emitter } from '../emitter';
import {
  Channel,
  ErrorPayload,
  Metadata,
  ParticipantPayload,
  StepJson,
  StepsPayload,
  TelepointerPayload,
} from '../channel';
import {
  CollabEditProvider,
  CollabParticipant,
  CollabEventTelepointerData as EditorCollabTelepointerData,
  CollabEventConnectionData as EditorCollabConnetedData,
  CollabEventInitData as EditorCollabInitData,
  CollabEventRemoteData as EditorCollabData,
  CollabEventPresenceData as EditorCollabPresenceData,
} from '@atlaskit/editor-common/collab';
import { Config } from '../types';

import { createLogger, getParticipant, sleep } from '../helpers/utils';
import { ACK_MAX_TRY } from '../helpers/const';
import {
  triggerAnalyticsForCatchupFailed,
  triggerAnalyticsForStepsRejected,
  triggerAnalyticsForStepsAddedSuccessfully,
} from '../analytics';
import { catchup } from './catchup';
import { errorCodeMapper } from '../error-code-mapper';
import {
  DisconnectReason,
  socketIOReasons,
} from '../disconnected-reason-mapper';

const logger = createLogger('Provider', 'black');

const PARTICIPANT_UPDATE_INTERVAL = 300 * 1000; // 300 seconds
const SEND_PRESENCE_INTERVAL = 150 * 1000; // 150 seconds
const SEND_STEPS_THROTTLE = 500; // 0.5 second
export const CATCHUP_THROTTLE = 1 * 1000; // 1 second
const OUT_OF_SYNC_PERIOD = 3 * 1000; // 3 seconds

export const MAX_STEP_REJECTED_ERROR = 15;

export type CollabConnectedPayload = EditorCollabConnetedData;
export interface CollabDisconnectedPayload {
  reason: DisconnectReason;
  sid: string;
}
export interface CollabErrorPayload {
  status: number;
  code: string;
  message: string;
}
export interface CollabInitPayload extends EditorCollabInitData {
  doc: any;
  version: number;
  userId?: string;
  metadata?: Metadata;
}

export interface CollabDataPayload extends EditorCollabData {
  version: number;
  json: StepJson[];
  userIds: string[];
}

export type CollabTelepointerPayload = EditorCollabTelepointerData;
export type CollabPresencePayload = EditorCollabPresenceData;
export type CollabMetadataPayload = Metadata;
export type CollabLocalStepsPayload = {
  steps: Step[];
};

export interface CollabEvents {
  'metadata:changed': CollabMetadataPayload;
  init: CollabInitPayload;
  connected: CollabConnectedPayload;
  disconnected: CollabDisconnectedPayload;
  data: CollabDataPayload;
  telepointer: CollabTelepointerPayload;
  presence: CollabPresencePayload;
  'local-steps': CollabLocalStepsPayload;
  error: CollabErrorPayload;
  entity: any;
}

const commitStep = ({
  channel,
  steps,
  version,
  userId,
  clientId,
}: {
  channel: Channel;
  steps: Step[];
  version: number;
  userId: string;
  clientId: string;
}) => {
  const stepsWithClientAndUserId = steps.map((step) => ({
    ...step.toJSON(),
    clientId,
    userId,
  }));

  channel.broadcast('steps:commit', {
    steps: stepsWithClientAndUserId,
    version,
    userId,
  });
};

const throttledCommitStep = throttle(commitStep, SEND_STEPS_THROTTLE, {
  leading: false,
  trailing: true,
});

type EditorStateGetter = () => EditorState;

type InitializeOptions = {
  getState: EditorStateGetter;
  clientId: string;
};

type BaseEvents = Pick<
  CollabEditProvider<CollabEvents>,
  'initialize' | 'send' | 'sendMessage'
>;

export class Provider extends Emitter<CollabEvents> implements BaseEvents {
  private participants: Map<
    string,
    CollabParticipant & { userId: string; clientId: string }
  > = new Map();
  private channel: Channel;
  private config: Config;
  private getState: (() => EditorState) | undefined;
  private metadata: Metadata = {};
  private stepRejectCounter: number = 0;
  private analyticsClient?: AnalyticsWebClient;

  // SessionID is the unique socket-session.
  private sessionId?: string;

  // ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
  private clientId?: string;

  // UserID is the users actual account id.
  private userId?: string;

  private participantUpdateTimeout?: number;
  private presenceUpdateTimeout?: number;

  private disconnectedAt?: number;

  constructor(config: Config) {
    super();
    this.config = config;
    this.channel = new Channel(config);
    if (config.analyticsClient) {
      this.analyticsClient = config.analyticsClient;
    }
  }

  /**
   * Called by collab plugin in editor when it's ready to
   * initialize a collab session.
   */
  initialize(getState: EditorStateGetter): this;
  initialize(options: InitializeOptions): this;
  initialize(optionsOrGetState: InitializeOptions | EditorStateGetter): this {
    this.getState =
      typeof optionsOrGetState === 'function'
        ? optionsOrGetState
        : optionsOrGetState.getState;

    this.clientId =
      typeof optionsOrGetState === 'function'
        ? // Quick-hack to get clientID from native collab-plugin.
          (this.getState().plugins.find((p: any) => p.key === 'collab$')!
            .spec as any).config.clientID
        : optionsOrGetState.clientId;

    this.channel
      .on('connected', ({ sid, initialized }) => {
        this.sessionId = sid;
        this.emit('connected', { sid });
        this.sendPresence();
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
      .on('init', ({ doc, version, userId, metadata }) => {
        this.userId = userId;
        this.sendPresence();
        // Initial document and version
        this.updateDocumentWithMetadata({
          doc,
          version,
          metadata,
        });
      })
      .on('steps:added', this.onStepsAdded)
      .on('participant:telepointer', this.onParticipantTelepointer)
      .on('participant:joined', this.onParticipantJoined)
      .on('participant:left', this.onParticipantLeft)
      .on('participant:updated', this.onParticipantUpdated)
      .on('metadata:changed', this.onMetadataChanged)
      .on('disconnect', this.onDisconnected)
      .on('error', this.onErrorHandled)
      .connect();

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
    });
  }

  /**
   * Called when we receive steps from the service
   */
  private onStepsAdded = (data: StepsPayload) => {
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
  };

  private throttledCatchup = throttle(() => this.catchup(), CATCHUP_THROTTLE, {
    leading: false,
    trailing: true,
  });

  private fitlerQueue = (
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

  private applyLocalsteps = (steps: Step[]) => {
    // Re-aply local steps
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
        fitlerQueue: this.fitlerQueue,
        updateDocumentWithMetadata: this.updateDocumentWithMetadata,
        applyLocalsteps: this.applyLocalsteps,
      });
    } catch (err) {
      triggerAnalyticsForCatchupFailed(this.analyticsClient, err);
      logger(`Catch-Up Failed:`, err.message);
    } finally {
      this.pauseQueue = false;
      this.processQueue();
      this.sendStepsFromCurrentState();
      this.stepRejectCounter = 0;
    }
  };

  private onErrorHandled = (error: ErrorPayload) => {
    if (error && error.data) {
      if (
        error.data.code === 'HEAD_VERSION_UPDATE_FAILED' ||
        error.data.code === 'VERSION_NUMBER_ALREADY_EXISTS'
      ) {
        triggerAnalyticsForStepsRejected(
          this.analyticsClient,
          error as ErrorPayload,
        );
        this.stepRejectCounter++;
      }
      logger(`The stepRejectCounter("${this.stepRejectCounter}")`);
      if (this.stepRejectCounter >= MAX_STEP_REJECTED_ERROR) {
        logger(
          `The stepRejected("${this.stepRejectCounter}") exceed maximun("${MAX_STEP_REJECTED_ERROR}"), trigger catch`,
        );
        this.throttledCatchup();
      }
      const errorToEmit = errorCodeMapper(error);
      if (errorToEmit) {
        this.emit('error', errorToEmit);
      }
    }

    logger(`Error from collab service`, error);
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

    if (steps && steps.length) {
      const clientIds = steps.map(({ clientId }) => clientId);
      this.emit('data', { json: steps, version, userIds: clientIds });
      // If steps can apply to local editor sucessfully, no need to accumulate the error counter.
      this.stepRejectCounter = 0;
      triggerAnalyticsForStepsAddedSuccessfully(this.analyticsClient);
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
        const { selection } = rest;
        this.channel.broadcast('participant:telepointer', {
          selection,
          userId: userId!,
          sessionId: sessionId!,
          clientId: clientId!,
        });
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
  private onParticipantJoined = ({ sessionId }: ParticipantPayload) => {
    logger('Participant joined with session: ', sessionId);

    // This expose existing users to the newly joined user
    this.sendPresence();
  };
  /**
   * Called when a metadata is changed.
   *
   */
  private onMetadataChanged = (metadata: Metadata) => {
    if (metadata !== undefined && !isequal(this.metadata, metadata)) {
      this.emit('metadata:changed', metadata);
    }
  };

  /**
   * Called when a participant leaves the session.
   *
   * We emit the `presence` event to update the active avatars in the editor.
   */
  private onParticipantLeft = ({ sessionId }: ParticipantPayload) => {
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
  }: ParticipantPayload) => {
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
  }: ParticipantPayload) => {
    const { getUser } = this.config;
    const { name = '', email = '', avatar = '' } = await (getUser
      ? getUser(userId)
      : getParticipant(userId));

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
    userIds: string[] = [],
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

  /**
   * Get latest state.
   *
   * NOTE: Should this actually convert to ADF instead?
   */
  async getFinalAcknowledgedState() {
    const state = this.getState!();
    let count = 0;
    let unconfirmedSteps =
      this.getUnconfirmedSteps() && this.getUnconfirmedSteps()?.steps;

    while (unconfirmedSteps && unconfirmedSteps.length) {
      this.sendStepsFromCurrentState();
      await sleep(500);
      unconfirmedSteps =
        this.getUnconfirmedSteps() && this.getUnconfirmedSteps()?.steps;
      if (count++ >= ACK_MAX_TRY) {
        throw new Error("Can't syncup with Collab Service");
      }
    }

    return {
      content: state.doc.toJSON(),
      title: this.metadata.title,
      stepVersion: getVersion(state),
    };
  }

  /**
   * Unsubscribe from all events emitted by this provider.
   */
  unsubscribeAll() {
    super.unsubscribeAll();
    this.channel.disconnect();
    return this;
  }
}
