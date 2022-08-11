import { TaskState, ObjectKey } from '@atlaskit/task-decision';
import RendererBridge, {
  CallBackToNotifyConfigChange,
  ScrollToContentNode,
} from './bridge';
import { AnnotationPayload, AnnotationStatePayload } from '../types';
import { Serialized } from '../../types';
import WebBridge from '../../web-bridge';
import { eventDispatcher, EmitterEvents } from '../dispatcher';
import { resolvePromise, rejectPromise } from '../../cross-platform-promise';
import { TaskDecisionProviderImpl } from '../../providers/taskDecisionProvider';
import {
  nativeBridgeAPI,
  toNativeBridge,
} from '../web-to-native/implementation';
import { getElementScrollOffsetByNodeType, scrollToElement } from './utils';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import {
  measureContentRenderedPerformance,
  PerformanceMatrices,
  isContentEmpty,
} from '../../utils/bridge';
import RendererConfiguration from '../renderer-configuration';
import { trackFontSizeUpdated } from '../track-analytics';
import { createPromise, createPromiseId } from '../../cross-platform-promise';

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

class RendererBridgeImplementation
  extends RendererMobileWebBridgeOverride
  implements RendererBridge {
  content: Serialized<JSONDocNode> = '';
  taskDecisionProvider?: Promise<TaskDecisionProviderImpl>;
  configuration: RendererConfiguration;
  callbackToNotifyConfigChange?: CallBackToNotifyConfigChange;

  constructor(config?: RendererConfiguration) {
    super();
    this.configuration = config || new RendererConfiguration();
  }

  async fetchPayload<T = unknown>(category: string, uuid: string): Promise<T> {
    var originURL = new URL(window.location.href);
    originURL.protocol = `fabric-hybrid`;
    const payloadURL = originURL.origin + `/payload/${category}/${uuid}`;
    const response = await fetch(payloadURL);
    return response.json();
  }

  setContent(content: Serialized<JSONDocNode>) {
    this.content = content;
    const performanceMatrices = new PerformanceMatrices();

    if (!eventDispatcher) {
      return;
    }
    let adfContent: JSONDocNode;
    if (typeof content === 'string') {
      try {
        adfContent = JSON.parse(content);
      } catch (e) {
        return;
      }
    } else {
      adfContent = content;
    }

    eventDispatcher.emit(EmitterEvents.SET_RENDERER_CONTENT, {
      content: adfContent,
    });

    if (!isContentEmpty(adfContent)) {
      measureContentRenderedPerformance(
        adfContent,
        (totalNodeSize, nodes, actualRenderingDuration) => {
          nativeBridgeAPI.onContentRendered(
            totalNodeSize,
            nodes,
            actualRenderingDuration,
            performanceMatrices.duration,
          );
        },
      );
    }
  }

  async setContentPayload(uuid: string) {
    const adfContent: Serialized<JSONDocNode> = await this.fetchPayload(
      'content',
      uuid,
    );
    this.setContent(adfContent);
  }

  getContent() {
    return this.content;
  }

  onPromiseResolved(uuid: string, payload: string) {
    resolvePromise(uuid, JSON.parse(payload));
  }

  async onPromiseResolvedPayload(uuid: string) {
    try {
      const payload = await this.fetchPayload('promise', uuid);
      resolvePromise(uuid, payload);
    } catch (err) {
      rejectPromise(uuid, err);
    }
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
   */
  scrollToContentNode(
    nodeType: ScrollToContentNode,
    id: string,
    index = -1,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (nodeType === ScrollToContentNode.HEADING) {
        eventDispatcher.emit(EmitterEvents.SET_ACTIVE_HEADING_ID, id);
      }

      // eslint-disable-next-line compat/compat
      if (window.requestIdleCallback) {
        // eslint-disable-next-line compat/compat
        return window.requestIdleCallback(() => {
          scrollToElement(nodeType, id, index);
          resolve(true);
        });
      }

      requestAnimationFrame(() => {
        scrollToElement(nodeType, id, index);
        resolve(true);
      });
    });
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
    if (nodeType === ScrollToContentNode.HEADING) {
      eventDispatcher.emit(EmitterEvents.SET_ACTIVE_HEADING_ID, id);
    }
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

  setAnnotationFocus(annotationFocusPayload?: Serialized<AnnotationPayload>) {
    if (
      typeof annotationFocusPayload === 'string' &&
      annotationFocusPayload.trim().length > 0
    ) {
      const payload = JSON.parse(annotationFocusPayload);

      eventDispatcher.emit(EmitterEvents.SET_ANNOTATION_FOCUS, payload);
    } else {
      eventDispatcher.emit(EmitterEvents.REMOVE_ANNOTATION_FOCUS);
    }
  }

  setAnnotationState(annotations: Serialized<AnnotationStatePayload[]>) {
    if (typeof annotations === 'string') {
      const payload = JSON.parse(annotations);

      eventDispatcher.emit(EmitterEvents.SET_ANNOTATION_STATE, payload);
    }
  }

  createAnnotationOnSelection(annotation: Serialized<AnnotationPayload>) {
    if (typeof annotation === 'string') {
      const payload = JSON.parse(annotation);

      eventDispatcher.emit(
        EmitterEvents.CREATE_ANNOTATION_ON_SELECTION,
        payload,
      );
    }
  }

  highlightSelection() {
    eventDispatcher.emit(EmitterEvents.APPLY_DRAFT_ANNOTATION);
  }

  cancelHighlight() {
    eventDispatcher.emit(EmitterEvents.REMOVE_DRAFT_ANNOTATION);
  }

  /**
   * Used to observe the height of the rendered content and notify the native side when that happens
   * by calling RenderBridge#onRenderedContentHeightChanged.
   *
   * @param enabled whether the height is being observed (and therefore the callback is being called).
   */
  observeRenderedContentHeight(enabled: boolean) {
    eventDispatcher.emit(
      EmitterEvents.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
      enabled,
    );
  }

  deleteAnnotation(annotation: Serialized<AnnotationPayload>) {
    if (typeof annotation === 'string') {
      try {
        const payload = JSON.parse(annotation) as AnnotationPayload;
        if (payload.annotationId && payload.annotationType) {
          eventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, payload);
        }
      } catch {
        return;
      }
    } else {
      eventDispatcher.emit(EmitterEvents.DELETE_ANNOTATION, annotation);
    }
  }

  setCallbackToNotifyConfigChange(callback: CallBackToNotifyConfigChange) {
    this.callbackToNotifyConfigChange = callback;
  }

  configure(config: string) {
    if (!this.callbackToNotifyConfigChange) {
      return;
    }
    this.configuration = this.configuration.cloneAndUpdate(config);
    this.callbackToNotifyConfigChange(this.configuration);
  }

  getConfiguration(): RendererConfiguration {
    return this.configuration;
  }

  // This function takes two parameters:
  // relativeFontSize: the reference font size each platform uses
  // actualFontSize: the true font size that appears on the screen
  updateSystemFontSize(relativeFontSize: string, actualFontSize?: string) {
    const setFontSize = Number(relativeFontSize) > 34 ? '34' : relativeFontSize;
    const style = document.createElement('style');
    style.innerHTML = `
    html {
      font-size: ${setFontSize}px;
    }
    `;
    document.head.appendChild(style);

    // Use correct font size value in analytics event.
    const defaultFontSize = window.webkit ? '17' : '16';
    const trueFontSize = actualFontSize ? actualFontSize : relativeFontSize;
    trackFontSizeUpdated(defaultFontSize, trueFontSize);
  }

  asyncCall<T>(fn: () => Promise<T>): string {
    const promise_id = createPromiseId();
    fn()
      .then((result) => {
        const promise = createPromise(
          'asyncCallCompleted',
          {
            value: result,
          },
          promise_id,
        );
        promise.submit();
      })
      .catch((error) => {
        const message =
          typeof error.message === 'string'
            ? error.message
            : JSON.stringify(error);
        const promise = createPromise(
          'asyncCallCompleted',
          {
            error: message,
          },
          promise_id,
        );
        promise.submit();
      });
    return promise_id;
  }
}

export default RendererBridgeImplementation;
