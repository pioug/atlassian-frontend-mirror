import type { Transaction } from 'prosemirror-state';
import type { Step } from 'prosemirror-transform';
import type {
  CollabParticipant,
  CollabEventTelepointerData as EditorCollabTelepointerData,
  CollabEventConnectionData as EditorCollabConnetedData,
  CollabEventInitData as EditorCollabInitData,
  CollabEventRemoteData as EditorCollabData,
  CollabEventPresenceData as EditorCollabPresenceData,
} from '@atlaskit/editor-common/collab';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { Manager } from 'socket.io-client';
import type { DisconnectReason } from './disconnected-reason-mapper';

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

// Channel
export interface Metadata {
  [key: string]: string | number | boolean;
}

export type InitPayload = {
  doc: any;
  version: number;
  userId?: string;
  metadata?: Metadata;
};

export type PresencePayload = {
  sessionId: string;
  userId: string;
  clientId: string;
  timestamp: number;
};

export type TelepointerPayload = PresencePayload & {
  selection: {
    type: 'textSelection' | 'nodeSelection';
    anchor: number;
    head: number;
  };
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

export type ErrorPayload = {
  message: string;
  data?: {
    status: number;
    code?: string;
    meta?: string;
  };
};

export type ChannelEvent = {
  connected: {
    sid: string;
    initialized: boolean;
  };
  init: InitPayload;
  reconnected: null;
  'presence:joined': PresencePayload;
  presence: PresencePayload;
  'participant:left': PresencePayload;
  'participant:telepointer': TelepointerPayload;
  'participant:updated': PresencePayload;
  'steps:commit': StepsPayload & { userId: string };
  'steps:added': StepsPayload;
  'metadata:changed': Metadata;
  error: ErrorPayload;
  disconnect: { reason: string };
};

export interface CatchupResponse {
  doc?: string;
  version?: number;
  stepMaps?: any[];
  metadata?: Metadata;
}

// Catchup
export interface CatchupOptions {
  getCurrentPmVersion: () => number;
  fetchCatchup: (fromVersion: number) => Promise<CatchupResponse>;
  fitlerQueue: (condition: (stepsPayload: StepsPayload) => boolean) => void;
  getUnconfirmedSteps: () =>
    | {
        version: number;
        steps: Step<any>[];
        clientID: string | number;
        origins: Transaction<any>[];
      }
    | null
    | undefined;
  updateDocumentWithMetadata: ({
    doc,
    version,
    metadata,
    reserveCursor,
  }: CollabInitPayload) => void;
  applyLocalsteps: (steps: Step[]) => void;
}
