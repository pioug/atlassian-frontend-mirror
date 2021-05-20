import { getVersion, sendableSteps } from 'prosemirror-collab';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step, StepMap, Mapping } from 'prosemirror-transform';
import { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import throttle from 'lodash/throttle';

import { Emitter } from './emitter';
import {
  Channel,
  EditorWidthPayload,
  ErrorPayload,
  Metadata,
  ParticipantPayload,
  StepJson,
  StepsPayload,
  TelepointerPayload,
  TitlePayload,
} from './channel';
import {
  CollabEditProvider,
  CollabParticipant,
  CollabEventTelepointerData as EditorCollabTelepointerData,
  CollabEventConnectionData as EditorCollabConnetedData,
  CollabEventInitData as EditorCollabInitData,
  CollabEventRemoteData as EditorCollabData,
  CollabEventPresenceData as EditorCollabPresenceData,
} from '@atlaskit/editor-common/collab';
import { Config } from './types';

import { buildAnalyticsPayload, createLogger, getParticipant } from './utils';
import { GasPurePayload } from '@atlaskit/analytics-gas-types';
import {
  CATCHUP_FAILURE,
  CATCHUP_SUCCESS,
  STEPS_REJECTED,
  STEPS_ADDED,
  ACK_MAX_TRY,
} from './const';
import { ErrorCodeMapper } from './error-code-mapper';

const logger = createLogger('Provider', 'yellow');

const PARTICIPANT_UPDATE_INTERVAL = 300; // seconds
const SEND_PRESENCE_INTERVAL = 150; // seconds
export const MAX_STEP_REJECTED_ERROR = 10;
export const CATCHUP_THROTTLE_TIMEOUT = 5000; // 5 seconds
const SEND_STEPS_THROTTLE = 0.1; // seconds
const FIVE_HUNDRED_MILLISECONDS = SEND_STEPS_THROTTLE * 500; // 500 ms

const CATCHUP_THROTTLE = 1; // One seconds
const TEN_SECONDS = CATCHUP_THROTTLE * 1000; // 10 seconds

export type CollabConnectedPayload = EditorCollabConnetedData;
export type CollabErrorPayload = ErrorPayload;
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
  const stepsWithClientAndUserId = steps.map(step => ({
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

const throttledCommitStep = throttle(commitStep, FIVE_HUNDRED_MILLISECONDS, {
  leading: false,
  trailing: true,
});
/**
 * Rebase the steps based on the mapping pipeline.
 * Some steps could be lost, if they are no longer
 * invalid after rebased.
 */
function rebaseSteps(steps: Step[], mapping: Mapping): Step[] {
  const newSteps: Step[] = [];
  for (const step of steps) {
    const newStep = step.map(mapping);
    // newStep could be null(means invalid after rebase) when can't rebase.
    if (newStep) {
      newSteps.push(newStep);
    }
  }
  return newSteps;
}

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
  private catchupTimeout?: NodeJS.Timeout;
  private analyticsClient?: AnalyticsWebClient;

  // SessionID is the unique socket-session.
  private sessionId?: string;

  // ClientID is the unique ID for a prosemirror client. Used for step-rebasing.
  private clientId?: string;

  // UserID is the users actual account id.
  private userId?: string;

  private participantUpdateTimeout?: NodeJS.Timeout;
  private presenceUpdateTimeout?: NodeJS.Timeout;

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
      .on('connected', ({ sid }) => {
        this.sessionId = sid;
        this.emit('connected', { sid });
      })
      .on('reconnected', () => {
        this.sendPresence();
        this.throttledCatchup();
      })
      .on('init', ({ doc, version, userId, metadata }) => {
        this.userId = userId;
        this.sendPresence();
        this.emit('init', { doc, version, metadata }); // Initial document and version
        // Initialise metadata
        if (metadata) {
          this.metadata = metadata;
          this.emit('metadata:changed', metadata);
        }
      })
      .on('steps:added', this.onStepsAdded)
      .on('participant:telepointer', this.onParticipantTelepointer)
      .on('participant:joined', this.onParticipantJoined)
      .on('participant:left', this.onParticipantLeft)
      .on('participant:updated', this.onParticipantUpdated)
      .on('title:changed', this.onTitleChanged)
      .on('width:changed', this.onWidthChanged)
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

  private fireAnalyticsEvent = (analyticsEvent?: GasPurePayload) => {
    if (!this.analyticsClient || !analyticsEvent) {
      return;
    }

    const client = this.analyticsClient;
    const requestIdleCallbackFunction = (window as any).requestIdleCallback;
    const runItLater =
      typeof requestIdleCallbackFunction === 'function'
        ? requestIdleCallbackFunction
        : window.requestAnimationFrame;

    // Let the browser figure out
    // when it should send those events
    runItLater(() => {
      client.sendOperationalEvent({
        action: 'collab',
        ...analyticsEvent,
        source: analyticsEvent.source || 'unknown',
      });
    });
  };

  /**
   * Called when we receive steps from the service
   */
  private onStepsAdded = (data: StepsPayload, forceApply?: boolean) => {
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
      this.processSteps(data, forceApply);
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

  private getCurrentPmVersion = () => {
    return getVersion(this.getState!());
  };

  private throttledCatchup = throttle(() => this.catchup(), TEN_SECONDS, {
    leading: false,
    trailing: true,
  });
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
      const {
        doc,
        stepMaps: serverStepMaps,
        version: serverVersion,
        metadata,
      } = await this.channel.fetchCatchup(this.getCurrentPmVersion());
      if (doc) {
        const currentPmVersion = this.getCurrentPmVersion();
        if (typeof serverVersion === 'undefined') {
          logger(`Could not determine server version`);
        } else if (serverVersion <= currentPmVersion) {
          logger(`Catchup steps we already have. Ignoring.`);
        } else {
          // Please, do not use those steps inside of async
          // method. That will lead to outdated steps
          const { steps: unconfirmedSteps } = sendableSteps(
            this.getState!(),
          ) || {
            steps: [],
          };
          logger(
            `Too far behind[current: v${currentPmVersion}, server: v${serverVersion}. ${serverStepMaps.length} steps need to catchup]`,
          );
          /**
           * Remove steps from queue where the version is older than
           * the version we received from service. Keep steps that might be
           * newer.
           */
          this.queue = this.queue.filter(data => data.version > serverVersion);
          // We are too far behind - replace the entire document
          logger(`Replacing document: ${doc}`);
          logger(`getting metadata: ${metadata}`);
          // Replace local document and version number
          this.emit('init', {
            doc: JSON.parse(doc),
            version: serverVersion,
            metadata,
            reserveCursor: true,
          });
          if (metadata) {
            this.metadata = metadata;
            this.emit('metadata:changed', metadata);
          }
          // After replacing the whole document in the editor, we need to reapply the unconfirmed
          // steps back into the editor, so we don't lose any data. But before that, we need to rebase
          // those steps since their position could be changed after replacing.
          // https://prosemirror.net/docs/guide/#transform.rebasing
          if (unconfirmedSteps.length) {
            const catchupAnalytics: GasPurePayload = buildAnalyticsPayload(
              CATCHUP_SUCCESS,
            );
            // Create StepMap from StepMap JSON
            const stepMaps = serverStepMaps.map((map: any) => new StepMap(map));
            // create Mappng used for Step.map
            const mapping: Mapping = new Mapping(stepMaps);
            logger(
              `${
                unconfirmedSteps.length
              } unconfirmed steps before rebased: ${JSON.stringify(
                unconfirmedSteps,
              )}`,
            );
            const newUnconfirmedSteps: Step[] = rebaseSteps(
              unconfirmedSteps,
              mapping,
            );
            logger(
              `Re-aply ${
                newUnconfirmedSteps.length
              } mapped unconfirmed steps: ${JSON.stringify(
                newUnconfirmedSteps,
              )}`,
            );
            // Re-aply local steps
            this.emit('local-steps', { steps: newUnconfirmedSteps });
            this.fireAnalyticsEvent(catchupAnalytics);
          }
        }
      }
    } catch (err) {
      const catchupFailureAnalytics: GasPurePayload = buildAnalyticsPayload(
        CATCHUP_FAILURE,
        err,
      );
      this.fireAnalyticsEvent(catchupFailureAnalytics);
      logger(`Catch-Up Failed:`, err.message);
    } finally {
      this.pauseQueue = false;
      this.processQueue();
      this.sendStepsFromCurrentState();
      this.stepRejectCounter = 0;
      if (this.catchupTimeout) {
        clearTimeout(this.catchupTimeout);
        this.catchupTimeout = undefined;
      }
    }
  };

  private errorCodeMapper = (error: ErrorPayload | string) => {
    switch ((error as ErrorPayload).code) {
      case 'INSUFFICIENT_EDITING_PERMISSION':
        return {
          status: 403,
          code: ErrorCodeMapper.noPermissionError.code,
          message: ErrorCodeMapper.noPermissionError.message,
        };
      case 'DOCUMENT_NOT_FOUND':
        return {
          status: 404,
          code: ErrorCodeMapper.documentNotFound.code,
          message: ErrorCodeMapper.documentNotFound.message,
        };
      case 'FAILED_ON_S3':
      case 'DYNAMO_ERROR':
        return {
          status: 500,
          code: ErrorCodeMapper.failToSave.code,
          message: ErrorCodeMapper.failToSave.message,
        };
      case 'CATCHUP_FAILED':
      case 'GET_QUERY_TIME_OUT':
        return {
          status: 500,
          code: ErrorCodeMapper.internalError.code,
          message: ErrorCodeMapper.internalError.message,
        };
      default:
        break;
    }
  };

  private onErrorHandled = (error: ErrorPayload | string) => {
    if (
      error &&
      ((error as ErrorPayload).code === 'HEAD_VERSION_UPDATE_FAILED' ||
        (error as ErrorPayload).code === 'VERSION_NUMBER_ALREADY_EXISTS')
    ) {
      const stepRejectAnalytics: GasPurePayload = buildAnalyticsPayload(
        STEPS_REJECTED,
        error,
      );
      this.fireAnalyticsEvent(stepRejectAnalytics);
      this.stepRejectCounter++;
      if (!this.catchupTimeout) {
        this.catchupTimeout = setTimeout(() => {
          this.throttledCatchup();
        }, CATCHUP_THROTTLE_TIMEOUT);
      }
    }
    if (this.stepRejectCounter >= MAX_STEP_REJECTED_ERROR) {
      this.throttledCatchup();
    }
    const errorToEmit = this.errorCodeMapper(error);
    if (errorToEmit) {
      this.emit('error', errorToEmit);
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

  private processSteps(data: StepsPayload, forceApply?: boolean) {
    const { version, steps } = data;
    const stepAddedAnalyticsEvent: GasPurePayload = buildAnalyticsPayload(
      STEPS_ADDED,
    );
    logger(`Processing data. Version "${version}".`);

    if (steps && steps.length) {
      const clientIds = steps.map(({ clientId }) => clientId);
      this.emit('data', { json: steps, version, userIds: clientIds });
      this.fireAnalyticsEvent(stepAddedAnalyticsEvent);
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

    this.presenceUpdateTimeout = setTimeout(
      () => this.sendPresence(),
      SEND_PRESENCE_INTERVAL * 1000,
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
   * Call when editing in the title
   * Don't emit events to the user who makes the modification
   */
  private onTitleChanged = ({ title }: TitlePayload) => {
    if (title !== undefined && this.metadata.title !== title) {
      this.metadata.title = title;
      this.emit('metadata:changed', { title });
    }
  };

  private onWidthChanged = ({ editorWidth }: EditorWidthPayload) => {
    if (
      editorWidth !== undefined &&
      this.metadata.editorWidth !== editorWidth
    ) {
      this.metadata.editorWidth = editorWidth;
      this.emit('metadata:changed', { editorWidth });
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

    Array.from(this.participants.values()).forEach(p => {
      if (userIds.indexOf(p.userId) !== -1) {
        this.participants.set(p.sessionId, {
          ...p,
          lastActive: now,
        });
      }
    });

    // Filter out participants that's been inactive for more than 5 minutes.
    const left = Array.from(this.participants.values()).filter(
      p =>
        p.sessionId !== this.sessionId &&
        (now - p.lastActive) / 1000 > PARTICIPANT_UPDATE_INTERVAL,
    );

    left.forEach(p => this.participants.delete(p.sessionId));

    if (joined.length || left.length) {
      this.emit('presence', {
        ...(joined.length ? { joined } : {}),
        ...(left.length ? { left } : {}),
      });
    }

    this.participantUpdateTimeout = setTimeout(
      () => this.updateParticipants(),
      PARTICIPANT_UPDATE_INTERVAL * 1000,
    );
  };

  private emitTelepointersFromSteps(steps: StepJson[]) {
    steps.forEach(step => {
      const [participant] = Array.from(this.participants.values()).filter(
        p => p.clientId === step.clientId,
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

  private onDisconnected = ({ reason }: { reason: string }) => {
    const left = Array.from(this.participants.values());
    this.participants.clear();
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
    this.metadata.title = title;

    if (broadcast) {
      this.channel.broadcast('title:changed', {
        title,
      });
    }
  }

  setEditorWidth(editorWidth: string, broadcast?: boolean) {
    this.metadata.editorWidth = editorWidth;

    if (broadcast) {
      this.channel.broadcast('width:changed', {
        editorWidth,
      });
    }
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
      sendableSteps(this.getState!()) && sendableSteps(this.getState!())?.steps;

    while (unconfirmedSteps && unconfirmedSteps.length) {
      this.sendStepsFromCurrentState();
      await sleep(500);
      unconfirmedSteps =
        sendableSteps(this.getState!()) &&
        sendableSteps(this.getState!())?.steps;
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

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
