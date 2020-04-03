import { TaskState } from '@atlaskit/task-decision';

export type ScrollToContentNode = 'mention' | 'action' | 'decision';

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
  ): string /* boolean as string */;
  getContentNodeScrollOffsetY(
    nodeType: ScrollToContentNode,
    id: string,
    index?: number,
  ): string /* number as string */;
  observeRenderedContentHeight(enabled: boolean): void;
}
