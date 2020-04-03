import { CollabEditProvider, CollabParticipant } from '@atlaskit/editor-common';
import { getVersion, sendableSteps } from 'prosemirror-collab';
import { EditorState, Transaction } from 'prosemirror-state';
import throttle from 'lodash.throttle';

import { Emitter } from './emitter';
import { Channel } from './channel';
import {
  CollabEvent,
  Config,
  ParticipantPayload,
  StepsPayload,
  StepJson,
  TelepointerPayload,
} from './types';

import { createLogger, getParticipant } from './utils';

const logger = createLogger('Provider', 'yellow');

const PARTICIPANT_UPDATE_INTERVAL = 300;
const SEND_PRESENCE_INTERVAL = 150;
const SEND_STEPS_THROTTLE = 100;

export class Provider extends Emitter<CollabEvent>
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

  // ClientID is the unqiue ID for a prosemirror client. Used for step-rebasing.
  private clientId?: string;

  // UserID is the users actual account id.
  private userId?: string;

  private participantUpdateTimeout?: number;
  private presenceUpdateTimeout?: number;

  constructor(config: Config) {
    super();
    this.config = config;
    this.userId = config.userId;
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
      .on('init', ({ doc, version }) => {
        this.emit('init', { doc, version }); // Initial document and version
      })
      .on('steps:added', this.onStepsAdded)
      .on('participant:telepointer', this.onParticipantTelepointer)
      .on('participant:joined', this.onParticipantJoined)
      .on('participant:left', this.onParticipantLeft)
      .on('participant:updated', this.onParticipantUpdated)
      .on('title:changed', ({ title }) => {
        this.title = title;
        this.emit('title:changed', { title });
      })
      .on('disconnect', this.onDisconnected)
      .connect();

    this.sendPresence();

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

    this.throttledSend();
  }

  private throttledSend = throttle(
    () => this.sendSteps(this.getState!()),
    SEND_STEPS_THROTTLE,
    { leading: false, trailing: true },
  );

  private sendSteps(state: EditorState) {
    const sendable = sendableSteps(state);

    // Don't send any steps before we're ready.
    if (!sendable) {
      return;
    }

    const { steps, version } = sendable;
    this.channel.broadcast('steps:commit', {
      steps: steps.map(step => ({
        ...step.toJSON(),
        clientId: this.clientId!,
        userId: this.userId!,
      })),
      version,
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
    }

    this.updateParticipants(
      [],
      data.steps.map(({ userId }) => userId),
    );
  };

  private queueTimeout: number | undefined;
  private pauseQueue?: boolean;
  private queue: StepsPayload[] = [];
  private queueSteps(data: StepsPayload) {
    logger(`Queueing data for version "${data.version}".`);

    const orderedQueue = [...this.queue, data].sort((a, b) =>
      a.version > b.version ? 1 : -1,
    );

    this.queue = orderedQueue;

    if (!this.queueTimeout && !this.pauseQueue) {
      this.queueTimeout = window.setTimeout(() => {
        this.requestCatchup();
      }, 10000);
    }
  }

  private async requestCatchup() {
    this.pauseQueue = true;
    logger(`Too far behind - fetching data from service.`);
    this.pauseQueue = false;
    await this.channel.getSteps(getVersion(this.getState!()));
  }

  private processQueue() {
    if (this.pauseQueue) {
      logger(`Queue is paused. Aborting.`);
      return;
    }

    logger(`Looking for processable data.`);

    if (this.queue.length === 0) {
      return;
    }

    const [firstItem] = this.queue;
    const currentVersion = getVersion(this.getState!());
    const expectedVersion = currentVersion + firstItem.steps.length;

    if (firstItem.version === expectedVersion) {
      logger(`Applying data from queue!`);
      this.queue.splice(0, 1);
      this.processSteps(firstItem);
    }
  }

  private processSteps(data: StepsPayload, forceApply?: boolean) {
    if (this.pauseQueue && !forceApply) {
      logger(`Queue is paused. Aborting.`);
      return;
    }

    const { version, steps } = data;
    logger(`Processing data. Version "${version}".`);

    if (steps && steps.length) {
      const clientIds = steps.map(({ clientId }) => clientId);
      this.emit('data', { json: steps, version, userIds: clientIds });
      this.emitTelepointersFromSteps(steps);
    }

    this.processQueue();
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
    clearTimeout(this.presenceUpdateTimeout);

    this.channel.broadcast('participant:updated', {
      sessionId: this.sessionId!,
      userId: this.userId!,
      clientId: this.clientId!,
    });

    setTimeout(() => this.sendPresence(), SEND_PRESENCE_INTERVAL * 1000);
  };

  /**
   * Called when a participant joins the session.
   *
   * We keep track of participants internally in this class, and emit the `presence` event to update
   * the active avatars in the editor.
   *
   */
  private onParticipantJoined = ({
    sessionId,
    timestamp,
    userId,
    clientId,
  }: ParticipantPayload) => {
    logger('Participant joined', sessionId);
    this.updateParticipant({ sessionId, userId, timestamp, clientId });

    // We should let the new particpant know about us!
    this.sendPresence();
  };

  /**
   * Called when a participant leavs the session.
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
    logger(`Participant updated`);
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
    clearTimeout(this.participantUpdateTimeout);

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

    setTimeout(
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
      this.channel.broadcast('title:changed', { title });
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
