import type { Transaction } from 'prosemirror-state';
import type { Step } from 'prosemirror-transform';
import type {
  CollabParticipant,
  CollabEventTelepointerData,
  CollabEventConnectionData,
  CollabEventInitData,
  CollabEventRemoteData,
  CollabEventPresenceData,
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
  // ESS-1009 Allow to opt-in into 404 response
  need404?: boolean;
  createSocket: (
    path: string,
    auth?: (cb: (data: object) => void) => void,
    productInfo?: ProductInformation,
  ) => Socket;
  analyticsClient?: AnalyticsWebClient;
  featureFlags?: { [key: string]: boolean };
  getUser?(
    userId: string,
  ): Promise<
    Pick<CollabParticipant, 'avatar' | 'email' | 'name'> & { userId: string }
  >;
  permissionTokenRefresh?: () => Promise<string | null>;
  productInfo?: ProductInformation;
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

export type CollabConnectedPayload = CollabEventConnectionData;
export interface CollabDisconnectedPayload {
  reason: DisconnectReason;
  sid: string;
}
export interface CollabErrorPayload {
  status: number;
  code: string;
  message: string;
  reason?: string;
}
export interface CollabInitPayload extends CollabEventInitData {
  doc: any;
  version: number;
  userId?: string;
  metadata?: Metadata;
  reserveCursor?: boolean;
}

export interface CollabDataPayload extends CollabEventRemoteData {
  version: number;
  json: StepJson[];
  userIds: (number | string)[];
}

export type CollabTelepointerPayload = CollabEventTelepointerData;
export type CollabPresencePayload = CollabEventPresenceData;
export type CollabMetadataPayload = Metadata;
export type CollabLocalStepsPayload = {
  steps: readonly Step[];
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
  clientId: number | string;
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
  clientId: number | string;
  userId: string;
  createdAt?: number; // Potentially required?
  structure?: boolean;
};

export enum AcknowledgementResponseTypes {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type AcknowledgementSuccessPayload = {
  type: AcknowledgementResponseTypes.SUCCESS;
};

export type AcknowledgementPayload =
  | AcknowledgementSuccessPayload
  | AcknowledgementErrorPayload;

export type AddStepAcknowledgementSuccessPayload = {
  type: AcknowledgementResponseTypes.SUCCESS;
  version: number;
};

export type AcknowledgementErrorPayload = {
  type: AcknowledgementResponseTypes.ERROR;
  error: ErrorPayload;
};

export type AddStepAcknowledgementPayload =
  | AddStepAcknowledgementSuccessPayload
  | AcknowledgementErrorPayload;

export type StepsPayload = {
  version: number;
  steps: StepJson[];
};

export type ErrorPayload = {
  message: string;
  data?: {
    status: number;
    code?: string;
    meta?: string | { description: string; reason?: string };
  };
};

// ESS-2916 Type def for namespace status - lock/unlock
export type NamespaceStatus = {
  isLocked: boolean;
  timestamp: number;
  // waitTimeInMs is set when the isLocked bool set to true. Otherwise, it is null
  waitTimeInMs?: number;
};

export type ChannelEvent = {
  connected: {
    sid: string;
    initialized: boolean;
  };
  init: InitPayload;
  restore: InitPayload;
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
  status: NamespaceStatus;
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
  filterQueue: (condition: (stepsPayload: StepsPayload) => boolean) => void;
  getUnconfirmedSteps: () =>
    | {
        version: number;
        steps: readonly Step<any>[];
        clientID: string | number;
        origins: readonly Transaction<any>[];
      }
    | null
    | undefined;
  updateDocumentWithMetadata: ({
    doc,
    version,
    metadata,
    reserveCursor,
  }: CollabInitPayload) => void;
  applyLocalSteps: (steps: Step[]) => void;
}

export type ProductInformation = {
  product: string;
  subProduct?: string;
};
