import { CollabParticipant } from '@atlaskit/editor-common/collab';

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
  createSocket(path: string): Socket;
  getUser?(
    userId: string,
  ): Promise<
    Pick<CollabParticipant, 'avatar' | 'email' | 'name'> & { userId: string }
  >;
}

interface SimpleEventEmitter {
  on(event: string, fn: Function): SimpleEventEmitter;
}

export interface Socket extends SimpleEventEmitter {
  id: string;
  connect(): Socket;
  emit(event: string, ...args: any[]): Socket;
  close(): Socket;
}

export type LifecycleEvents = 'save' | 'restore';
export type EventHandler = () => void;

export interface Lifecycle {
  on(event: LifecycleEvents, handler: EventHandler): void;
}
