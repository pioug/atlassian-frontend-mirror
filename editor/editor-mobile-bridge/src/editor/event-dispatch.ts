import EventEmitter from 'events';
import { QuickInsertItemId } from '@atlaskit/editor-core';

export type allowListPayloadType = Set<QuickInsertItemId>;

export enum EventTypes {
  SET_NEW_ALLOWED_INSERT_LIST = 'SET_NEW_ALLOWED_INSERT_LIST',
  ADD_NEW_ALLOWED_INSERT_LIST_ITEM = 'ADD_NEW_ALLOWED_INSERT_LIST_ITEM',
  REMOVE_ALLOWED_INSERT_LIST_ITEM = 'REMOVE_ALLOWED_INSERT_LIST_ITEM',
}

type payloadType = allowListPayloadType;

export class BridgeEventEmitter {
  private emitter: EventEmitter = new EventEmitter();

  emit(event: EventTypes, payload: payloadType): boolean {
    if (typeof payload === 'undefined') {
      return this.emitter.emit(event);
    } else {
      return this.emitter.emit(event, payload);
    }
  }

  on(
    event: EventTypes,
    listener: (payload: payloadType) => void,
  ): EventEmitter {
    return this.emitter.on(event, listener);
  }

  off(
    event: EventTypes,
    listener: (payload: payloadType) => void,
  ): EventEmitter {
    return this.emitter.off(event, listener);
  }

  listeners(event: EventTypes) {
    return this.emitter.listeners(event);
  }
}
