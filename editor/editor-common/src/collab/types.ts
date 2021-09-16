import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

export interface CollabParticipant {
  lastActive: number;
  sessionId: string;
  avatar: string;
  name: string;
  email: string;
  cursorPos?: number;
}

export interface CollabEventInitData {
  doc?: any;
  json?: any;
  version?: number;
  sid?: string;
  reserveCursor?: boolean;
}

export interface CollabEventRemoteData {
  json?: any;
  newState?: EditorState;
  userIds?: string[];
}

export interface CollabEventConnectionData {
  sid: string;
}

export interface CollabEventDisonnectedData {
  sid: string;
  reason:
    | 'CLIENT_DISCONNECT'
    | 'SERVER_DISCONNECT'
    | 'SOCKET_CLOSED'
    | 'SOCKET_ERROR'
    | 'SOCKET_TIMEOUT'
    | 'UNKNOWN_DISCONNECT';
}

export interface CollabEventPresenceData {
  joined?: CollabParticipant[];
  left?: { sessionId: string }[];
}

export interface CollabEventTelepointerData {
  type: 'telepointer';
  selection: CollabSendableSelection;
  sessionId: string;
}

export interface CollabEventLocalStepData {
  steps: Array<Step>;
}

export interface CollabSendableSelection {
  type: 'textSelection' | 'nodeSelection';
  anchor: number;
  head: number;
}

export type CollabEvent = keyof CollabEventData;

export interface CollabEventData {
  init: CollabEventInitData;
  connected: CollabEventConnectionData;
  disconnected: CollabEventDisonnectedData;
  data: CollabEventRemoteData;
  telepointer: CollabEventTelepointerData;
  presence: CollabEventPresenceData;
  error: any;
  'local-steps': any;
  entity: any;
}

export interface CollabEditProvider<
  Events extends CollabEventData = CollabEventData
> {
  initialize(getState: () => any, createStep: (json: object) => Step): this;

  send(tr: Transaction, oldState: EditorState, newState: EditorState): void;

  on(evt: keyof Events, handler: (...args: any) => void): this;

  off(evt: keyof Events, handler: (...args: any) => void): this;

  unsubscribeAll(evt: keyof Events): this;

  sendMessage<K extends keyof Events>(data: { type: K } & Events[K]): void;
}
