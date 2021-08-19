import { CollabParticipant } from '@atlaskit/editor-common/collab';
import { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import { Manager } from 'socket.io-client';

export interface Storage {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Config {
  url: string;
  documentAri: string;
  lifecycle?: Lifecycle;
  storage?: Storage;
  createSocket(
    path: string,
    auth?: (cb: (data: object) => void) => void,
  ): Socket;
  analyticsClient?: AnalyticsWebClient;
  getUser?(
    userId: string,
  ): Promise<
    Pick<CollabParticipant, 'avatar' | 'email' | 'name'> & { userId: string }
  >;
  permissionTokenRefresh?: () => Promise<string>;
}

interface SimpleEventEmitter {
  on(event: string, fn: Function): SimpleEventEmitter;
}

export interface Socket extends SimpleEventEmitter {
  id: string;
  connect(): Socket;
  emit(event: string, ...args: any[]): Socket;
  close(): Socket;
  io?: Manager;
}

export type LifecycleEvents = 'save' | 'restore';
export type EventHandler = () => void;

export interface Lifecycle {
  on(event: LifecycleEvents, handler: EventHandler): void;
}
