import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import EventEmitter from 'events';
import { AnnotationPayload, AnnotationStatePayload } from './types';

export enum EmitterEvents {
  SET_ANNOTATION_FOCUS = 'SET_ANNOTATION_FOCUS',
  SET_ANNOTATION_STATE = 'SET_ANNOTATION_STATE',
  REMOVE_ANNOTATION_FOCUS = 'REMOVE_ANNOTATION_FOCUS',
  SET_RENDERER_CONTENT = 'SET_RENDERER_CONTENT',
  CREATE_ANNOTATION_ON_SELECTION = 'CREATE_ANNOTATION_ON_SELECTION',
  REMOVE_DRAFT_ANNOTATION = 'REMOVE_DRAFT_ANNOTATION',
  APPLY_DRAFT_ANNOTATION = 'APPLY_DRAFT_ANNOTATION',
  SET_DOCUMENT_REFLOW_DETECTOR_STATUS = 'SET_DOCUMENT_REFLOW_DETECTOR_STATUS',
  SET_ACTIVE_HEADING_ID = 'SET_ACTIVE_HEADING_ID',
  DELETE_ANNOTATION = 'DELETE_ANNOTATION',
}

type EmitterEventPayloads = {
  [EmitterEvents.SET_ANNOTATION_FOCUS]: AnnotationPayload;
  [EmitterEvents.SET_ANNOTATION_STATE]: AnnotationStatePayload[];
  [EmitterEvents.CREATE_ANNOTATION_ON_SELECTION]: AnnotationPayload;
  [EmitterEvents.SET_DOCUMENT_REFLOW_DETECTOR_STATUS]: boolean;
  [EmitterEvents.SET_RENDERER_CONTENT]: {
    content: JSONDocNode | string;
  };
  [EmitterEvents.REMOVE_ANNOTATION_FOCUS]: never;
  [EmitterEvents.APPLY_DRAFT_ANNOTATION]: never;
  [EmitterEvents.REMOVE_DRAFT_ANNOTATION]: never;
  [EmitterEvents.SET_ACTIVE_HEADING_ID]: string;
  [EmitterEvents.DELETE_ANNOTATION]: AnnotationPayload;
};

class MobilleRendererEmitter {
  private emitter: EventEmitter = new EventEmitter();

  emit<T extends EmitterEvents>(
    event: T,
    params?: EmitterEventPayloads[T],
  ): boolean {
    if (typeof params === 'undefined') {
      return this.emitter.emit(event);
    }

    return this.emitter.emit(event, params);
  }

  on<T extends EmitterEvents>(
    event: T,
    listener: (payload?: EmitterEventPayloads[T]) => void,
  ): EventEmitter {
    return this.emitter.on(event, listener);
  }

  off<T extends EmitterEvents>(
    event: T,
    listener: (payload?: EmitterEventPayloads[T]) => void,
  ): EventEmitter {
    return this.emitter.off(event, listener);
  }

  listeners(event: EmitterEvents) {
    return this.emitter.listeners(event);
  }
}

export const eventDispatcher = new MobilleRendererEmitter();
