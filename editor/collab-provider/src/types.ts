import type { Step } from '@atlaskit/editor-prosemirror/transform';
import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners';
import type { Manager } from 'socket.io-client';
import type { InternalError } from './errors/error-types';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import type { GetUserType } from './participants/participants-helper';
import type AnalyticsHelper from './analytics/analytics-helper';
import type {
  CollabInitPayload,
  StepJson,
  CollabSendableSelection,
  Metadata,
} from '@atlaskit/editor-common/collab';

// Re-export values for the /types entry point to this package
export type {
  CollabParticipant,
  CollabEventInitData,
  CollabEventRemoteData,
  CollabEventConnectionData,
  CollabEventConnectingData,
  CollabEventPresenceData,
  ResolvedEditorState,
  CollabConnectedPayload,
  CollabConnectingPayload,
  CollabDisconnectedPayload,
  CollabInitPayload,
  CollabDataPayload,
  CollabTelepointerPayload,
  CollabPresencePayload,
  CollabMetadataPayload,
  CollabLocalStepsPayload,
  CollabCommitStatusEventPayload,
  CollabEvents,
  Metadata,
  StepJson,
  CollabEventTelepointerData,
  CollabSendableSelection,
  CollabEditProvider,
  NewCollabSyncUpErrorAttributes,
  SyncUpErrorFunction,
  CollabEventLocalStepData,
} from '@atlaskit/editor-common/collab';

export interface CollabEventDisconnectedData {
  sid: string;
  reason:
    | 'CLIENT_DISCONNECT'
    | 'SERVER_DISCONNECT'
    | 'SOCKET_CLOSED'
    | 'SOCKET_ERROR'
    | 'SOCKET_TIMEOUT'
    | 'UNKNOWN_DISCONNECT';
}

// types from editor common end

export interface Storage {
  get(key: string): Promise<string>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

// Initial draft
export interface InitialDraft {
  document: JSONDocNode;
  version: number;
  metadata?: Metadata;
  timestamp?: number;
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
    auth?: AuthCallback | InitAndAuthData,
    productInfo?: ProductInformation,
  ) => Socket;
  /**
   * @deprecated: Use promise based getAnalyticsWebClient instead
   */
  analyticsClient?: AnalyticsWebClient;
  getAnalyticsWebClient?: Promise<AnalyticsWebClient>;
  featureFlags?: { [key: string]: boolean };
  getUser?: GetUserType;
  /**
   * If provided, permissionTokenRefresh is called whenever a new JWT token is required.
   */
  permissionTokenRefresh?: () => Promise<string | null>;
  //flag to signal if the token should be cached locally
  cacheToken?: boolean;
  productInfo?: ProductInformation;
  /**
   * Throws errors when trying to send data to collab but the client is not offline.
   * This can lead to potential dataloss and retrying should be considered. Without this flag the provider silently drops the requests.
   */
  throwOnNotConnected?: boolean;
  // initial draft passed on provider creation
  initialDraft?: InitialDraft;
  isBufferingEnabled?: boolean;
  /**
   * When a page is being published this number can control the number of failed steps until a catchup is triggered.
   * The default value is MAX_STEP_REJECTED_ERROR (15).
   */
  failedStepLimitBeforeCatchupOnPublish?: number;
  /**
   * Enable checking if a document update from collab-provider is being dropped by the editor,
   * throwing a non-recoverable error if it's detected.
   */
  enableErrorOnFailedDocumentApply?: boolean;

  /**
   * Configure the client side circuit breaker in the event that abnormal behaviour causes the client to flood
   * NCS with too many steps or too large a volume of data. This can result in either a soft fail or a hard (fatal) fail
   * depending on the configured rate limit type.
   */
  rateLimitMaxStepSize?: number;
  rateLimitStepCount?: number;
  rateLimitTotalStepSize?: number;
  rateLimitType?: number;
}

export interface InitAndAuthData {
  // The initialized status. If false, BE will send document, otherwise not.
  initialized: boolean;
  // ESS-1009 Allow to opt-in into 404 response
  need404?: boolean;
  token?: string;
}

export type AuthCallback = (cb: (data: InitAndAuthData) => void) => void;

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

// Channel
export type InitPayload = {
  doc: any;
  version: number;
  userId?: string;
  metadata?: Metadata;
};

/**
 * @description Incoming payload type from the `broadcast` route in NCS
 * @param {number} timestamp added in NCS
 * @param {string} sessionId socket.id from NCS
 * @param data event specific data from NCS
 */
export type BroadcastIncomingPayload = {
  sessionId?: string;
  timestamp?: number;
  data: PresencePayload | TelepointerPayload | StepsPayload | any; // broadcasted data from NCS, any added as a fallback
};

export type PresenceData = {
  sessionId: string;
  userId: string | undefined;
  clientId: number | string;
};

export type PresencePayload = PresenceData & {
  timestamp: number;
};

export type TelepointerPayload = PresencePayload & {
  selection: CollabSendableSelection;
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
  error: InternalError;
};

export type AddStepAcknowledgementPayload =
  | AddStepAcknowledgementSuccessPayload
  | AcknowledgementErrorPayload;

export type StepsPayload = {
  version: number;
  steps: StepJson[];
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
  error: InternalError;
  disconnect: { reason: string };
  status: NamespaceStatus;
};

export interface CatchupResponse {
  doc?: string;
  version?: number;
  stepMaps?: any[];
  metadata?: Metadata;
}

export interface ReconcileResponse {
  document: string;
  version: number;
  ari?: string;
  metadata?: Metadata;
}

// Catchup
export interface CatchupOptions {
  getCurrentPmVersion: () => number;
  fetchCatchup: (
    fromVersion: number,
    clientId: number | string | undefined,
  ) => Promise<CatchupResponse>;
  filterQueue: (condition: (stepsPayload: StepsPayload) => boolean) => void;
  getUnconfirmedSteps: () => readonly Step[] | undefined;
  applyLocalSteps: (steps: Step[]) => void;
  updateDocument: ({
    doc,
    version,
    metadata,
    reserveCursor,
  }: CollabInitPayload) => void;
  updateMetadata: (metadata: Metadata | undefined) => void;
  analyticsHelper: AnalyticsHelper | undefined;
  clientId: number | string | undefined;
}

export type ProductInformation = {
  product: string;
  subProduct?: string;
};
