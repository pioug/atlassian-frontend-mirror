import {
  CollabParticipant,
  CollabEventTelepointerData,
  CollabSendableSelection,
} from '@atlaskit/editor-common/collab';
import { Step } from 'prosemirror-transform';

export type ConnectedPayload = {
  sid: string;
};

export type InitPayload = {
  doc: any;
  version: number;
};

export type ParticipantPayload = {
  sessionId: string;
  userId: string;
  clientId: string;
  timestamp: number;
};

export type TelepointerPayload = ParticipantPayload & {
  selection: CollabSendableSelection;
};

export type StepJson = {
  from?: number;
  to?: number;
  stepType?: string;
  clientId: string;
  userId: string;
};

export type StepsPayload = {
  version: number;
  steps: StepJson[];
};

export type TitlePayload = {
  title: string;
  clientId: string;
};

export type ChannelEvent = {
  connected: ConnectedPayload;
  init: InitPayload;
  'participant:joined': ParticipantPayload;
  'participant:left': ParticipantPayload;
  'participant:telepointer': TelepointerPayload;
  'participant:updated': ParticipantPayload;
  'steps:commit': StepsPayload & { userId: string };
  'steps:added': StepsPayload;
  'title:changed': TitlePayload;
  disconnect: { reason: string };
};

export type CollabEvent = {
  init: Omit<ConnectedPayload, 'sid'>;
  connected: Pick<ConnectedPayload, 'sid'>;
  presence: {
    joined?: CollabParticipant[];
    left?: Pick<CollabParticipant, 'sessionId'>[];
  };
  telepointer: Omit<CollabEventTelepointerData, 'type'>;
  data: {
    json: StepJson[];
    version: number;
    userIds: string[];
  };
  'local-steps': { steps: Step[] };
  'title:changed': TitlePayload;
};

export interface Storage {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Config {
  url: string;
  documentAri: string;
  userId: string;
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
