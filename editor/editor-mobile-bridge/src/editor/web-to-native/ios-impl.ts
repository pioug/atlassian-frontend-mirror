import { Color as StatusColor } from '@atlaskit/status/element';
import NativeBridge, { EditorBridges, EditorBridgeNames } from './bridge';
import { sendToBridge } from '../../bridge-utils';

export default class IosBridge implements NativeBridge {
  showMentions(query: string) {
    if (window.webkit && window.webkit.messageHandlers.mentionBridge) {
      window.webkit.messageHandlers.mentionBridge.postMessage({
        name: 'showMentions',
        query: query,
      });
    }
  }

  dismissMentions() {
    if (window.webkit && window.webkit.messageHandlers.mentionBridge) {
      window.webkit.messageHandlers.mentionBridge.postMessage({
        name: 'dismissMentions',
      });
    }
  }
  updateTextFormat(markStates: string) {
    if (window.webkit && window.webkit.messageHandlers.textFormatBridge) {
      window.webkit.messageHandlers.textFormatBridge.postMessage({
        name: 'updateTextFormat',
        states: markStates,
      });
    }
  }
  updateText(content: string) {
    if (window.webkit && window.webkit.messageHandlers.textFormatBridge) {
      window.webkit.messageHandlers.textFormatBridge.postMessage({
        name: 'updateText',
        query: content,
      });
    }
  }
  getServiceHost(): string {
    if (window.mediaBridge) {
      return window.mediaBridge.getServiceHost();
    } else {
      // ¯\_(ツ)_/¯ ugly, I know, but we need this data, and don't want call native side
      return 'http://www.atlassian.com';
    }
  }

  getCollection(): string {
    if (window.mediaBridge) {
      return window.mediaBridge.getCollection();
    } else {
      // ¯\_(ツ)_/¯ @see #getServiceHost()
      return 'FabricMediaSampleCollection';
    }
  }

  submitPromise(name: string, uuid: string, args: string) {
    if (window.webkit && window.webkit.messageHandlers.promiseBridge) {
      window.webkit.messageHandlers.promiseBridge.postMessage({
        name: 'submitPromise',
        promise: {
          name: name,
          uuid: uuid,
        },
        args: args,
      });
    }
  }

  updateBlockState(currentBlockType: string) {
    if (window.webkit && window.webkit.messageHandlers.blockFormatBridge) {
      window.webkit.messageHandlers.blockFormatBridge.postMessage({
        name: 'updateBlockState',
        states: currentBlockType,
      });
    }
  }

  updateListState(listState: string) {
    if (window.webkit && window.webkit.messageHandlers.listBridge) {
      window.webkit.messageHandlers.listBridge.postMessage({
        name: 'updateListState',
        states: listState,
      });
    }
  }

  showStatusPicker(
    text: string,
    color: StatusColor,
    uuid: string,
    isNew: boolean,
  ) {
    if (window.webkit && window.webkit.messageHandlers.statusBridge) {
      window.webkit.messageHandlers.statusBridge.postMessage({
        name: 'showStatusPicker',
        text,
        color,
        uuid,
        isNew,
      });
    }
  }

  dismissStatusPicker(isNew: boolean) {
    if (window.webkit && window.webkit.messageHandlers.statusBridge) {
      window.webkit.messageHandlers.statusBridge.postMessage({
        name: 'dismissStatusPicker',
        isNew,
      });
    }
  }

  currentSelection(
    text: string,
    url: string,
    top: number,
    right: number,
    bottom: number,
    left: number,
  ) {
    if (window.webkit && window.webkit.messageHandlers.linkBridge) {
      window.webkit.messageHandlers.linkBridge.postMessage({
        name: 'currentSelection',
        text,
        url,
        top,
        right,
        bottom,
        left,
      });
    }
  }

  stateChanged(canUndo: boolean, canRedo: boolean) {
    if (window.webkit && window.webkit.messageHandlers.undoRedoBridge) {
      window.webkit.messageHandlers.undoRedoBridge.postMessage({
        name: 'stateChanged',
        canUndo,
        canRedo,
      });
    }
  }

  trackEvent(event: string) {
    if (window.webkit && window.webkit.messageHandlers.analyticsBridge) {
      window.webkit.messageHandlers.analyticsBridge.postMessage({
        name: 'trackEvent',
        event,
      });
    }
  }

  call<T extends EditorBridgeNames>(
    bridge: T,
    event: keyof Exclude<EditorBridges[T], undefined>,
    ...args: any[]
  ) {
    sendToBridge(bridge, event, ...args);
  }

  updateTextColor() {}
}
