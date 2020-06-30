import { EventEmitter } from 'events';

export type UpdateEvent = 'create' | 'delete' | 'resolve' | 'unresolve';
export class AnnotationUpdateEmitter extends EventEmitter {
  on(event: UpdateEvent, listener: (annotationId: string) => void): this {
    return super.on(event, listener);
  }

  emit(event: UpdateEvent, annotationId: string): this {
    return super.emit(event, annotationId);
  }
}
