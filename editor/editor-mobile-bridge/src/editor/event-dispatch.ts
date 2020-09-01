import EventEmitter from 'events';
import { QuickInsertItemId } from '@atlaskit/editor-core';

export type allowListPayloadType = Set<QuickInsertItemId>;

export enum EventTypes {
  SET_NEW_ALLOWED_INSERT_LIST = 'SET_NEW_ALLOWED_INSERT_LIST',
  ADD_NEW_ALLOWED_INSERT_LIST_ITEM = 'ADD_NEW_ALLOWED_INSERT_LIST_ITEM',
  REMOVE_ALLOWED_INSERT_LIST_ITEM = 'REMOVE_ALLOWED_INSERT_LIST_ITEM',
  SET_DOCUMENT_REFLOW_DETECTOR_STATUS = 'SET_DOCUMENT_REFLOW_DETECTOR_STATUS',
}

type GetPayload<
  T extends EventTypes
> = T extends EventTypes.SET_DOCUMENT_REFLOW_DETECTOR_STATUS
  ? boolean
  : allowListPayloadType;

export class BridgeEventEmitter {
  private emitter: EventEmitter = new EventEmitter();

  emit<T extends EventTypes>(event: T, payload: GetPayload<T>): boolean {
    if (typeof payload === 'undefined') {
      return this.emitter.emit(event);
    } else {
      return this.emitter.emit(event, payload);
    }
  }

  on<T extends EventTypes>(
    event: T,
    listener: (payload: GetPayload<T>) => void,
  ): EventEmitter {
    return this.emitter.on(event, listener);
  }

  off<T extends EventTypes>(
    event: T,
    listener: (payload: GetPayload<T>) => void,
  ): EventEmitter {
    return this.emitter.off(event, listener);
  }

  listeners(event: EventTypes) {
    return this.emitter.listeners(event);
  }
}
