import { TaskState, ObjectKey } from '@atlaskit/task-decision';

import RendererBridge, { ScrollToContentNode } from './bridge';
import WebBridge from '../../web-bridge';
import { eventDispatcher } from '../dispatcher';
import { resolvePromise, rejectPromise } from '../../cross-platform-promise';
import { TaskDecisionProviderImpl } from '../../providers/taskDecisionProvider';
import { toNativeBridge } from '../web-to-native/implementation';

export default class RendererBridgeImpl extends WebBridge
  implements RendererBridge {
  taskDecisionProvider?: Promise<TaskDecisionProviderImpl>;
  containerAri?: string;
  objectAri?: string;

  sendHeight(height: number) {
    toNativeBridge.call('renderBridge', 'onRenderedContentHeightChanged', {
      height,
    });
  }

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

  scrollToElement(selector: string, index = -1): boolean {
    const element = !!~index
      ? document.querySelectorAll(selector)[index]
      : document.querySelector(selector);
    if (!element) return false;
    element.scrollIntoView();
    return true;
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
    let success = false;
    switch (nodeType) {
      case 'mention':
        // The omission of an index means it'll find the first match (in case the user is mentioned multiple times on the page)
        success = this.scrollToElement(`span[data-mention-id='${id}']`, index);
        break;
      case 'action':
        success = this.scrollToElement(`div[data-task-local-id="${id}"]`);
        break;
      case 'decision':
        success = this.scrollToElement(`li[data-decision-local-id="${id}"]`);
        break;
      default:
        /* eslint-disable-next-line no-console */
        console.warn(
          `scrollToContentNode() doesn't support scrolling to content nodes of type '${nodeType}'.`,
        );
    }

    return String(success);
  }

  getElementScrollOffsetY(selector: string, index = -1): number {
    const element = !!~index
      ? document.querySelectorAll(selector)[index]
      : document.querySelector(selector);
    if (!element || !document || !document.documentElement) return -1;
    // Get offset from top of viewport.
    const { top } = element.getBoundingClientRect();
    // Combine with scroll offset of the page to get the position relative to the top of the document.
    return document.documentElement.scrollTop + top;
  }

  /**
   * Find a matching content node and return its vertical scroll offset, relative to the top of the document.
   *
   * Usage of this method is suitable when the Native app wrapper controls scrolling (e.g. WebView height matches the content height).
   * At which point the caller can use the returned value to calculate and determine the scroll position relative to the UI layer
   * containing the WebView and scroll it into view itself.
   *
   * @param node The name of the content node type you wish to scroll to.
   * @param id The identifier used for the selector.
   * @param index An optional index in case the identifier isn't unique per instance.
   *
   * @return A string representation of the pixel offset number.
   */
  getContentNodeScrollOffsetY(
    nodeType: ScrollToContentNode,
    id: string,
    index = -1,
  ): string {
    let offset = -1;
    switch (nodeType) {
      case 'mention':
        // The omission of an index means it'll find the first match (in case the user is mentioned multiple times on the page)
        offset = this.getElementScrollOffsetY(
          `span[data-mention-id='${id}']`,
          index,
        );
        break;
      case 'action':
        offset = this.getElementScrollOffsetY(
          `div[data-task-local-id="${id}"]`,
        );
        break;
      case 'decision':
        offset = this.getElementScrollOffsetY(
          `li[data-decision-local-id="${id}"]`,
        );
        break;
      default:
        /* eslint-disable-next-line no-console */
        console.warn(
          `getContentNodeScrollOffsetY() doesn't support matching content nodes of type '${nodeType}'.`,
        );
    }

    return String(offset);
  }

  async onTaskUpdated(taskId: string, state: TaskState) {
    if (this.taskDecisionProvider) {
      const taskDecisionProvider = await this.taskDecisionProvider;

      const key: ObjectKey = {
        localId: taskId,
        objectAri: this.objectAri!,
        containerAri: this.containerAri!,
      };

      taskDecisionProvider.notifyUpdated(key, state);
    }
  }

  getRootElement(): HTMLElement | null {
    return document.querySelector('#renderer');
  }
}
