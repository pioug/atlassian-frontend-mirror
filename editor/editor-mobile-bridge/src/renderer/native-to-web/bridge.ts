import { AnnotationPayload, AnnotationStatePayload } from '../types';
import { TaskState } from '@atlaskit/task-decision';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import { Serialized } from '../../types';
import RendererConfiguration from '../renderer-configuration';

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
  deleteAnnotation(annotation: Serialized<AnnotationPayload>): void;
}

export interface TaskDecisionBridge {
  onTaskUpdated(localId: string, state: TaskState): void;
}

export interface PromiseBridge {
  onPromiseResolvedPayload(uuid: string): Promise<void>;
  onPromiseResolved(uuid: string, payload: string): void;
  onPromiseRejected(uuid: string): void;
}

export type CallBackToNotifyConfigChange = (
  config: RendererConfiguration,
) => void;

export default interface RendererBridge
  extends TaskDecisionBridge,
    PromiseBridge,
    AnnotationBridge {
  setContentPayload(uuid: string): Promise<void>;
  setContent(content: string): void;
  setContent(adf: Serialized<JSONDocNode>): void;
  scrollToContentNode(
    nodeType: ScrollToContentNode,
    id: string,
    index?: number,
  ): Promise<boolean>;
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
  configure(config: string): void;
  getConfiguration(): RendererConfiguration;
  setCallbackToNotifyConfigChange: (
    callback: CallBackToNotifyConfigChange,
  ) => void;
  updateSystemFontSize(relativeFontSize: string, actualFontSize?: string): void;
  /*
  Will be temporary used on iOS until iOS 14+ is supported to
  Invoke async functions and resolve a cross platform promise.
  Returns a uuid for the expected promise to resolve.
  */
  asyncCall<T>(fn: () => Promise<T>): string;
}
