import { AnnotationPayload, AnnotationStatePayload } from '../types';
import { TaskState } from '@atlaskit/task-decision';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Serialized } from '../../types';

export enum ScrollToContentNode {
  MENTION = 'mention',
  ACTION = 'action',
  DECISION = 'decision',
  HEADING = 'heading',
  INLINE_COMMENT = 'inlineComment',
}

export interface AnnotationBridge {
  setAnnotationFocus(
    annotationFocusPayload?: Serialized<AnnotationPayload>,
  ): void;
  setAnnotationState(annotations: Serialized<AnnotationStatePayload[]>): void;
  createAnnotationOnSelection(annotation: Serialized<AnnotationPayload>): void;
  highlightSelection(): void;
  cancelHighlight(): void;
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
  setContent(adf: Serialized<JSONDocNode>): void;
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
