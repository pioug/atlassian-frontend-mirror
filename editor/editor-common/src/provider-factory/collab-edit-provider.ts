import { Step } from 'prosemirror-transform';
import { EditorState, Transaction } from 'prosemirror-state';
import { CollabEvent, CollabEventData } from '../types/collab';

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
