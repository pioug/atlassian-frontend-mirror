import EventEmitter from 'events';

import {
  AnnotationId,
  AnnotationMarkStates,
  AnnotationTypes,
} from '@atlaskit/adf-schema';

export interface AnnotationState<Type> {
  annotationType: Type;
  id: AnnotationId;
  state: AnnotationMarkStates | null;
}

export enum AnnotationUpdateEvent {
  SET_ANNOTATION_FOCUS = 'SET_ANNOTATION_FOCUS',
  SET_ANNOTATION_STATE = 'SET_ANNOTATION_STATE',
  REMOVE_ANNOTATION_FOCUS = 'REMOVE_ANNOTATION_FOCUS',
  ON_ANNOTATION_CLICK = 'ON_ANNOTATION_CLICK',
}

type SetFocusPayload = Record<'annotationId', AnnotationId>;
export type OnAnnotationClickPayload = {
  annotationIds: Array<AnnotationId>;
  eventTarget: HTMLElement;
};

type SetStatePayload = Record<
  AnnotationId,
  AnnotationState<AnnotationTypes.INLINE_COMMENT>
>;

export type AnnotationUpdateEventPayloads = {
  [AnnotationUpdateEvent.ON_ANNOTATION_CLICK]: OnAnnotationClickPayload;
  [AnnotationUpdateEvent.SET_ANNOTATION_FOCUS]: SetFocusPayload;
  [AnnotationUpdateEvent.SET_ANNOTATION_STATE]: SetStatePayload;
};

type Callback<T> = T extends keyof AnnotationUpdateEventPayloads
  ? (payload: AnnotationUpdateEventPayloads[T]) => void
  : () => void;

export class AnnotationUpdateEmitter {
  private emitter: EventEmitter = new EventEmitter();

  emit<T extends keyof AnnotationUpdateEventPayloads>(
    event: T,
    params: AnnotationUpdateEventPayloads[T],
  ): boolean;
  emit<T extends AnnotationUpdateEvent>(event: T): boolean;
  emit(event: AnnotationUpdateEvent, params?: never): boolean {
    if (typeof params === 'undefined') {
      return this.emitter.emit(event);
    }

    return this.emitter.emit(event, params);
  }

  on<T extends AnnotationUpdateEvent>(event: T, listener: Callback<T>): void;
  on(event: string, listener: (payload?: any) => void): EventEmitter {
    return this.emitter.on(event, listener);
  }

  off<T extends AnnotationUpdateEvent>(event: T, listener: Callback<T>): void;
  off(event: string, listener: (payload?: any) => void): EventEmitter {
    return this.emitter.off(event, listener);
  }

  listeners(event: AnnotationUpdateEvent) {
    return this.emitter.listeners(event);
  }
}
