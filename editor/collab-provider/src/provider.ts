import {
  CollabEditProvider,
  CollabParticipant,
} from '@atlaskit/editor-common/collab';
import { getVersion, sendableSteps } from 'prosemirror-collab';
import { EditorState, Transaction } from 'prosemirror-state';
import { Step, StepMap, Mapping } from 'prosemirror-transform';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

import { Emitter } from './emitter';
import { Channel } from './channel';
import {
  CollabEvent,
  Config,
  ParticipantPayload,
  StepsPayload,
  StepJson,
  TelepointerPayload,
  TitlePayload,
} from './types';

import { createLogger, getParticipant } from './utils';

const logger = createLogger('Provider', 'yellow');

const PARTICIPANT_UPDATE_INTERVAL = 300; // seconds
const SEND_PRESENCE_INTERVAL = 150; // seconds
const SEND_STEPS_THROTTLE = 0.1; // seconds
const SEND_STEPS_DEBOUNCE = 0.2; // seconds
const CATCHUP_THROTTLE = 1; // seconds
const MAX_WAIT = 1000; // seconds

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

export class Provider
  extends Emitter<CollabEvent>
  implements Omit<CollabEditProvider, 'on' | 'off' | 'unsubscribeAll'> {
  private participants: Map<
    string,
    CollabParticipant & { userId: string; clientId: string }
  > = new Map();
  private channel: Channel;
  private config: Config;
  private getState: (() => EditorState) | undefined;
  private title?: string;

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
  }

  /**
   * Called by collab plugin in editor when it's ready to
   * initialize a collab session.
   */
  initialize(getState: () => EditorState): this {
    this.getState = getState;

    // Quick-hack to get clientID from native collab-plugin.
    this.clientId = (getState!().plugins.find((p: any) => p.key === 'collab$')!
      .spec as any).config.clientID;

    this.channel
      .on('connected', ({ sid }) => {
        this.sessionId = sid;
        this.emit('connected', { sid });
      })
      .on('reconnected', () => {
        this.sendPresence();
        this.throttledCatchup();
      })
      .on('init', ({ doc, version, userId }) => {
        this.userId = userId;
        this.sendPresence();
        this.emit('init', { doc, version }); // Initial document and version
      })
      .on('steps:added', this.onStepsAdded)
      .on('participant:telepointer', this.onParticipantTelepointer)
      .on('participant:joined', this.onParticipantJoined)
      .on('participant:left', this.onParticipantLeft)
      .on('participant:updated', this.onParticipantUpdated)
      .on('title:changed', this.onTitleChanged)
      .on('disconnect', this.onDisconnected)
      .connect();

    return this;
  }

  /**
   * Send steps from transaction to other participants
   */
  send(tr: Transaction, _oldState: EditorState, newState: EditorState) {
    // Ignore transactions without steps
    if (!tr.steps || !tr.steps.length) {
      return;
    }
    this.debouncedSend();
  }

  private throttledSend = throttle(
    () => this.sendSteps(this.getState!()),
    SEND_STEPS_THROTTLE * 1000,
    { leading: false, trailing: true },
  );

  /**
   *  Introduced as a temp fix for CS-3100
   */
  private debouncedSend = debounce(
    () => this.sendSteps(this.getState!()),
    SEND_STEPS_DEBOUNCE * MAX_WAIT,
    { leading: true, trailing: true, maxWait: MAX_WAIT },
  );

  private throttledCatchup = throttle(
    () => this.catchup(),
    CATCHUP_THROTTLE * 1000,
    { leading: false, trailing: true },
  );

  private sendSteps(state: EditorState) {
    const sendable = sendableSteps(state);

    // Don't send any steps before we're ready.
    if (!sendable) {
      return;
    }

    const { steps } = sendable;
    this.channel.broadcast('steps:commit', {
      steps: steps.map(step => ({
        ...step.toJSON(),
        clientId: this.clientId!,
        userId: this.userId!,
      })),
      version: getVersion(state),
      userId: this.userId!,
    });
  }

  /**
   * Called when we receive steps from the service
   */
  private onStepsAdded = (data: StepsPayload, forceApply?: boolean) => {
    logger(`Received steps`, { steps: data.steps, version: data.version });

    if (!data.steps) {
      logger(`No steps.. waiting..`);
      return;
    }

    const currentVersion = getVersion(this.getState!());
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
      const currentVersion = getVersion(this.getState!());
      const {
        doc,
        stepMaps: serverStepMaps,
        version: serverVersion,
      } = await this.channel.fetchCatchup(currentVersion);
      if (doc) {
        if (typeof serverVersion === 'undefined') {
          logger(`Could not determine server version`);
          return;
        }
        if (serverVersion === currentVersion) {
          logger(`Catcup steps we already have. Ignoring.`);
          return;
        }
        const { steps: unconfirmedSteps } = sendableSteps(this.getState!()) || {
          steps: [],
        };
        logger(
          `Too far behind[current: v${currentVersion}, server: v${serverVersion}. ${serverStepMaps.length} steps need to catchup]`,
        );
        /**
         * Remove steps from queue where the version is older than
         * the version we received from service. Keep steps that might be
         * newer.
         */
        this.queue = this.queue.filter(data => data.version > serverVersion);
        // We are too far behind - replace the entire document
        logger(`Replacing document: ${doc}`);
        // Replace local document and version number
        this.emit('init', { doc: JSON.parse(doc), version: serverVersion });
        // After replacing the whole document in the editor, we need to reapply the unconfirmed
        // steps back into the editor, so we don't lose any data. But before that, we need to rebase
        // those steps since their position could be changed after replacing.
        // https://prosemirror.net/docs/guide/#transform.rebasing
        if (unconfirmedSteps.length) {
          // Create StepMap from StepMap JSON
          const stepMaps = serverStepMaps.map((map: any) => new StepMap(map));
          // create Mappng used for Step.map
          const mapping: Mapping = new Mapping(stepMaps);
          logger(`${unconfirmedSteps.length} unconfirmed steps before rebased`);
          const newUnconfirmedSteps: Step[] = rebaseSteps(
            unconfirmedSteps,
            mapping,
          );
          logger(`Re-aply ${newUnconfirmedSteps.length} unconfirmed steps`);
          // Re-aply local steps
          this.emit('local-steps', { steps: newUnconfirmedSteps });
        }
      }
    } catch (err) {
      logger(`Catch-Up Failed:`, err.message);
    }
    this.pauseQueue = false;
    this.processQueue();
    this.throttledSend();
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
      const currentVersion = getVersion(this.getState!());
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
    logger(`Processing data. Version "${version}".`);

    if (steps && steps.length) {
      const clientIds = steps.map(({ clientId }) => clientId);
      this.emit('data', { json: steps, version, userIds: clientIds });
      this.emitTelepointersFromSteps(steps);

      // Resend local steps if none of the received steps originated with us!
      if (clientIds.indexOf(this.clientId!) === -1) {
        setTimeout(() => this.throttledSend(), 100);
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
  private onTitleChanged = ({ title, clientId }: TitlePayload) => {
    if (title && this.title !== title && this.clientId !== clientId) {
      this.title = title;
      this.emit('title:changed', { title, clientId });
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
    this.emit('telepointer', { selection, sessionId });
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
    this.emit('presence', { joined, left });

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
          });
        }
      }
    });
  }

  private onDisconnected = ({ reason }: { reason: string }) => {
    const left = Array.from(this.participants.values());
    this.participants.clear();
    this.emit('presence', { left });
  };

  destroy() {
    return this.disconnect();
  }

  disconnect() {
    return this.unsubscribeAll();
  }

  setTitle(title: string, broadcast?: boolean) {
    this.title = title;

    if (broadcast) {
      this.channel.broadcast('title:changed', {
        title,
        clientId: this.clientId!,
      });
    }
  }

  /**
   * Get latest state.
   *
   * NOTE: Should this actually convert to ADF instead?
   */
  async getFinalAcknowledgedState() {
    return {
      content: {
        title: this.title,
        adf: this.getState!().doc.toJSON(),
      },
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
