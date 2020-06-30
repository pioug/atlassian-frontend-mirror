import {
  AnnotationMarkStates,
  AnnotationId,
  AnnotationTypes,
} from '@atlaskit/adf-schema';
import { TaskState } from '@atlaskit/task-decision';
import { Serialized } from '../../types';

export enum ScrollToContentNode {
  MENTION = 'mention',
  ACTION = 'action',
  DECISION = 'decision',
  HEADING = 'heading',
  INLINE_COMMENT = 'inlineComment',
}

export type AnnotationFocusPayload = {
  annotationId: AnnotationId;
  annotationType: AnnotationTypes;
};

export type AnnotationStatePayload = {
  annotationId: AnnotationId;
  annotationType: AnnotationTypes;
  annotationState: AnnotationMarkStates;
};

export interface AnnotationBridge {
  setAnnotationFocus(
    annotationFocusPayload?: Serialized<AnnotationFocusPayload>,
  ): void;
  setAnnotationState(annotations: Serialized<AnnotationStatePayload[]>): void;
}

export interface TaskDecisionBridge {
  onTaskUpdated(localId: string, state: TaskState): void;
}

export interface PromiseBridge {
  onPromiseResolved(uuid: string, payload: string): void;
  onPromiseRejected(uuid: string): void;
}

export default interface RendererBridge
  extends TaskDecisionBridge,
    PromiseBridge,
    AnnotationBridge {
  setContent(content: string): void;
  scrollToContentNode(
    nodeType: ScrollToContentNode,
    id: string,
    index?: number,
  ): string /* Object { x: number, y: number } stringified */;
  getContentNodeScrollOffset(
    nodeType: ScrollToContentNode,
    id: string,
    index?: number,
  ): string /* Object { x: number, y: number } as string */;
  /** @deprecated use `getContentNodeScrollOffset` instead */
  getContentNodeScrollOffsetY(
    nodeType: ScrollToContentNode,
    id: string,
    index?: number,
  ): string /* number as string */;
  observeRenderedContentHeight(enabled: boolean): void;
}
