import { TaskState } from '@atlaskit/task-decision';

export type ScrollToContentNode = 'mention' | 'action' | 'decision' | 'heading';

export interface TaskDecisionBridge {
  onTaskUpdated(localId: string, state: TaskState): void;
}

export interface PromiseBridge {
  onPromiseResolved(uuid: string, payload: string): void;
  onPromiseRejected(uuid: string): void;
}

export default interface RendererBridge
  extends TaskDecisionBridge,
    PromiseBridge {
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
