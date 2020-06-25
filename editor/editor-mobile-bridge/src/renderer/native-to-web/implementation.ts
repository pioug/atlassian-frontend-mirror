import { TaskState, ObjectKey } from '@atlaskit/task-decision';

import RendererBridge, {
  ScrollToContentNode,
  Serialized,
  AnnotationFocusPayload,
} from './bridge';
import WebBridge from '../../web-bridge';
import { eventDispatcher } from '../dispatcher';
import { resolvePromise, rejectPromise } from '../../cross-platform-promise';
import { TaskDecisionProviderImpl } from '../../providers/taskDecisionProvider';
import { toNativeBridge } from '../web-to-native/implementation';
import { getElementScrollOffsetByNodeType, scrollToElement } from './utils';

class RendererMobileWebBridgeOverride extends WebBridge {
  containerAri?: string;
  objectAri?: string;

  sendHeight(height: number) {
    toNativeBridge.call('renderBridge', 'onRenderedContentHeightChanged', {
      height,
    });
  }

  getRootElement(): HTMLElement | null {
    return document.querySelector('#renderer');
  }
}

class RendererBridgeImplementation extends RendererMobileWebBridgeOverride
  implements RendererBridge {
  taskDecisionProvider?: Promise<TaskDecisionProviderImpl>;

  /** Renderer bridge MVP to set the content */
  setContent(content: string) {
    if (eventDispatcher) {
      try {
        content = JSON.parse(content);
      } catch (e) {
        return;
      }
      eventDispatcher.emit('setRendererContent', { content });
    }
  }

  onPromiseResolved(uuid: string, payload: string) {
    resolvePromise(uuid, JSON.parse(payload));
  }

  onPromiseRejected(uuid: string) {
    rejectPromise(uuid);
  }

  /**
   * Find a matching content node and scroll it into view.
   *
   * Usage of this method is suitable when the WebView controls scrolling (using <body /> scrolling).
   *
   * @param node The name of the content node type you wish to scroll to.
   * @param id The identifier used for the selector.
   * @param index An optional index in case the identifier isn't unique per instance.
   *
   * @return A string representation of a boolean.
   */
  scrollToContentNode(
    nodeType: ScrollToContentNode,
    id: string,
    index = -1,
  ): string {
    return `${scrollToElement(nodeType, id, index)}`;
  }

  /**
   * Find a matching content node and return its vertical and horizontal scroll offset, relative to the top and left of the document.
   *
   * Usage of this method is suitable when the Native app wrapper controls scrolling (e.g. WebView height matches the content height).
   * At which point the caller can use the returned value to calculate and determine the scroll position relative to the UI layer
   * containing the WebView and scroll it into view itself.
   *
   * @param node The name of the content node type you wish to scroll to.
   * @param id The identifier used for the selector.
   * @param index An optional index in case the identifier isn't unique per instance.
   *
   * @return An object with x and y representing the pixel offset number for each axis.
   */
  getContentNodeScrollOffset(
    nodeType: ScrollToContentNode,
    id: string,
    index = -1,
  ): string {
    return JSON.stringify(
      getElementScrollOffsetByNodeType(nodeType, id, index),
    );
  }

  /** @deprecated  Use `getContentNodeScrollOffset` instead */
  getContentNodeScrollOffsetY(
    nodeType: ScrollToContentNode,
    id: string,
    index = -1,
  ): string {
    const { y: axisYOffset } = getElementScrollOffsetByNodeType(
      nodeType,
      id,
      index,
    );

    return `${axisYOffset}`;
  }

  async onTaskUpdated(taskId: string, state: TaskState) {
    if (!this.taskDecisionProvider) {
      return;
    }

    const taskDecisionProvider = await this.taskDecisionProvider;

    const key: ObjectKey = {
      localId: taskId,
      objectAri: this.objectAri!,
      containerAri: this.containerAri!,
    };

    taskDecisionProvider.notifyUpdated(key, state);
  }

  setAnnotationFocus(
    annotationFocusPayload?: Serialized<AnnotationFocusPayload>,
  ) {}
}

export default RendererBridgeImplementation;
