import { EditorState, Transaction } from 'prosemirror-state';
import { Step } from 'prosemirror-transform';

export interface CollabParticipant {
  lastActive: number;
  sessionId: string;
  avatar: string;
  name: string;
  email: string;
}

export interface CollabEventInitData {
  doc?: any;
  json?: any;
  version?: number;
  sid?: string;
}

export interface CollabEventRemoteData {
  json?: any;
  newState?: EditorState;
  userIds?: string[];
}

export interface CollabEventConnectionData {
  sid: string;
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

export type CollabEvent =
  | 'init'
  | 'connected'
  | 'data'
  | 'telepointer'
  | 'presence'
  | 'error'
  | 'local-steps'
  | 'editor-appearance'
  | 'title:changed';

export interface CollabEventData {
  init: CollabEventInitData;
  connected: CollabEventConnectionData;
  data: CollabEventRemoteData;
  telepointer: CollabEventTelepointerData;
  presence: CollabEventPresenceData;
  error: any;
}

export interface CollabEditProvider {
  initialize(getState: () => any, createStep: (json: object) => Step): this;

  send(tr: Transaction, oldState: EditorState, newState: EditorState): void;

  on(evt: CollabEvent, handler: (...args: any) => void): this;

  off(evt: CollabEvent, handler: (...args: any) => void): this;

  unsubscribeAll(evt: CollabEvent): this;

  sendMessage<T extends keyof CollabEventData>(
    data: { type: T } & CollabEventData[T],
  ): void;
}
