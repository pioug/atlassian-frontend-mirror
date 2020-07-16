import EventEmitter from 'events';

import { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema';

export interface AnnotationState<Type, State> {
  annotationType: Type;
  id: AnnotationId;
  state: State | null;
}

export enum AnnotationUpdateEvent {
  SET_ANNOTATION_FOCUS = 'SET_ANNOTATION_FOCUS',
  SET_ANNOTATION_STATE = 'SET_ANNOTATION_STATE',
  REMOVE_ANNOTATION_FOCUS = 'REMOVE_ANNOTATION_FOCUS',
}

export type AnnotationUpdateEventPayloads = {
  [AnnotationUpdateEvent.SET_ANNOTATION_FOCUS]: {
    annotationId: AnnotationId;
  };
  [AnnotationUpdateEvent.SET_ANNOTATION_STATE]: {
    [AnnotationId: string]: AnnotationMarkStates;
  };
  ['resolve']: AnnotationId;
  ['unresolve']: AnnotationId;
};

type AnnotationUpdateEventPayloadsWithoutPayload = AnnotationUpdateEvent.REMOVE_ANNOTATION_FOCUS;

type EventTypes =
  | keyof AnnotationUpdateEventPayloads
  | AnnotationUpdateEventPayloadsWithoutPayload;

export class AnnotationUpdateEmitter {
  private emitter: EventEmitter = new EventEmitter();

  emit<T extends EventTypes>(
    event: T,
    ...payload: T extends keyof AnnotationUpdateEventPayloads
      ? [AnnotationUpdateEventPayloads[T]]
      : []
  ): boolean {
    if (typeof payload === 'undefined') {
      return this.emitter.emit(event);
    } else {
      return this.emitter.emit(event, ...payload);
    }
  }

  on<T extends EventTypes>(
    event: T,
    listener: (
      payload: T extends keyof AnnotationUpdateEventPayloads
        ? AnnotationUpdateEventPayloads[T]
        : [],
    ) => void,
  ): EventEmitter {
    return this.emitter.on(event, listener);
  }

  off<T extends EventTypes>(
    event: T,
    listener: (
      payload: T extends keyof AnnotationUpdateEventPayloads
        ? AnnotationUpdateEventPayloads[T]
        : [],
    ) => void,
  ): EventEmitter {
    return this.emitter.off(event, listener);
  }

  listeners(event: EventTypes) {
    return this.emitter.listeners(event);
  }
}
