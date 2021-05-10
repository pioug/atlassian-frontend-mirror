import { EventEmitter } from 'events';

export type UpdateEvent = 'create' | 'delete' | 'resolve' | 'unresolve';
export type VisibilityEvent = 'setvisibility';

type AnnotationCallback = (params: string) => void;
type VisibilityCallback = (params: boolean) => void;

export class AnnotationUpdateEmitter extends EventEmitter {
  on(event: VisibilityEvent, listener: (isVisible: boolean) => void): this;
  on(event: UpdateEvent, listener: (annotationId: string) => void): this;
  on(event: string, listener: AnnotationCallback | VisibilityCallback): this {
    return super.on(event, listener);
  }
}
