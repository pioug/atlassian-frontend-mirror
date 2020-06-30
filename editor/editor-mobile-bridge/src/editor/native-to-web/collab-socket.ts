import { EventEmitter2 } from 'eventemitter2';
import { toNativeBridge } from '../web-to-native';
import { Socket } from '@atlaskit/collab-provider/types';
import { CollabActions, CollabAnalyticsEvents } from '../../analytics/collab';
import {
  ActionSubject,
  ActionSubjectID,
  EventType,
} from '../../analytics/enums';

interface CollabSocketConfig {
  onDisconnect?(): void;
}

function getPayload(payload: string): [Error | null, any] {
  try {
    return [null, JSON.parse(payload)];
  } catch (e) {
    return [e, null];
  }
}

export interface EventReceiver {
  received: (event: string, payload: string) => void;
}

export class CollabSocket implements EventReceiver, Socket {
  private socketId: string | null = null;
  private readonly path: string;
  private readonly emitter = new EventEmitter2();
  private readonly config: CollabSocketConfig;

  constructor(path: string, config: CollabSocketConfig = {}) {
    this.config = config;
    this.path = path;
    toNativeBridge.connectToCollabService(path);
  }

  get id() {
    if (this.socketId) {
      return this.socketId;
    }
    const invalidAccessToSocketID: CollabAnalyticsEvents = {
      action: CollabActions.INVALID_ACCESS_TO_SOCKET_ID,
      actionSubject: ActionSubject.EDITOR,
      actionSubjectId: ActionSubjectID.COLLAB,
      eventType: EventType.TRACK,
    };
    toNativeBridge.trackEvent(JSON.stringify(invalidAccessToSocketID));
    return '';
  }

  connect(): Socket {
    toNativeBridge.connectToCollabService(this.path);
    return this;
  }

  on(event: string, listener: Function) {
    this.emitter.on(event, listener as any);
    return this;
  }

  close() {
    if (this.config.onDisconnect) {
      this.config.onDisconnect();
    }
    this.socketId = null;
    toNativeBridge.disconnectFromCollabService();
    return this;
  }

  emit(event: string, ...args: any[]) {
    const payload = JSON.stringify(args || []);
    toNativeBridge.emitCollabChanges(event, payload);
    return this;
  }

  received(event: string, payloadSerialized: string) {
    if (event === 'connect') {
      // Native side has to share the socket id on the connect event, as a plain string.
      // There is no other way to has access to this.
      this.socketId = payloadSerialized;
      this.emitter.emit(event, payloadSerialized);
    } else {
      if (!this.socketId) {
        // Tracks if there is a race conditions somehow. (Event are sent before the connect event)
        const invalidCollabEvent: CollabAnalyticsEvents = {
          action: CollabActions.INVALID_COLLAB_EVENT_WITHOUT_SOCKET,
          actionSubject: ActionSubject.EDITOR,
          actionSubjectId: ActionSubjectID.COLLAB,
          attributes: {
            eventName: event,
            payload: payloadSerialized,
          },
          eventType: EventType.TRACK,
        };
        toNativeBridge.trackEvent(JSON.stringify(invalidCollabEvent));
      }
      const [err, payload] = getPayload(payloadSerialized);
      if (err) {
        const invalidCollabPayload: CollabAnalyticsEvents = {
          action: CollabActions.INVALID_COLLAB_EVENT_PAYLOAD,
          actionSubject: ActionSubject.EDITOR,
          actionSubjectId: ActionSubjectID.COLLAB,
          attributes: {
            eventName: event,
            payload: payloadSerialized,
            error:
              err && typeof err.toString === 'function' ? err.toString() : '',
          },
          eventType: EventType.TRACK,
        };
        toNativeBridge.trackEvent(JSON.stringify(invalidCollabPayload));
      } else {
        this.emitter.emit(event, payload);
      }
    }
  }
}
