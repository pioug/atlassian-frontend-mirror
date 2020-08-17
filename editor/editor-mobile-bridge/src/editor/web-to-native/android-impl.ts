import { Color as StatusColor } from '@atlaskit/status/element';
import {
  AnalyticsBridge,
  CollabBridge,
  default as NativeBridge,
  EditorBridgeNames,
  EditorBridges,
  LifecycleBridge,
  LinkBridge,
  ListBridge,
  MediaBridge,
  MentionBridge,
  PromiseBridge,
  StatusBridge,
  TextFormattingBridge,
  UndoRedoBridge,
} from './bridge';

import { sendToBridge } from '../../bridge-utils';
import {
  EditorLifecycleActions,
  EditorLifecycleAnalyticsEvents,
} from '../../analytics/lifecycle';
import { ActionSubject, EventType } from '../../analytics/enums';

export default class AndroidBridge implements NativeBridge {
  mentionBridge: MentionBridge;
  textFormatBridge: TextFormattingBridge;
  mediaBridge: MediaBridge;
  promiseBridge: PromiseBridge;
  listBridge: ListBridge;
  statusBridge: StatusBridge;
  linkBridge: LinkBridge;
  undoRedoBridge: UndoRedoBridge;
  analyticsBridge: AnalyticsBridge;
  collabBridge: CollabBridge;
  lifecycleBridge?: LifecycleBridge;
  private _editorReady: boolean = false;

  constructor(win: Window = window as Window) {
    this.mentionBridge = win.mentionsBridge!;
    this.textFormatBridge = win.textFormatBridge!;
    this.mediaBridge = win.mediaBridge!;
    this.promiseBridge = win.promiseBridge!;
    this.listBridge = win.listBridge!;
    this.statusBridge = win.statusBridge!;
    this.linkBridge = win.linkBridge!;
    this.undoRedoBridge = win.undoRedoBridge!;
    this.analyticsBridge = win.analyticsBridge!;
    this.collabBridge = win.collabBridge!;
    this.lifecycleBridge = win.lifecycleBridge;
  }

  showMentions(query: string) {
    this.mentionBridge.showMentions(query);
  }

  dismissMentions() {
    /*TODO: implement when mentions are ready */
  }

  updateTextFormat(markStates: string) {
    this.textFormatBridge.updateTextFormat(markStates);
  }

  updateText(content: string) {
    this.textFormatBridge.updateText(content);
  }

  getServiceHost(): string {
    return this.mediaBridge.getServiceHost();
  }

  getCollection(): string {
    return this.mediaBridge.getCollection();
  }

  submitPromise(name: string, uuid: string, args: string) {
    if (this.promiseBridge) {
      this.promiseBridge.submitPromise(name, uuid, args);
    }
  }

  updateBlockState(currentBlockType: string) {
    this.textFormatBridge.updateBlockState(currentBlockType);
  }

  updateListState(listState: string) {
    this.listBridge.updateListState(listState);
  }

  showStatusPicker(
    text: string,
    color: StatusColor,
    uuid: string,
    isNew: boolean,
  ) {
    this.statusBridge.showStatusPicker(text, color, uuid, isNew);
  }

  dismissStatusPicker(isNew: boolean) {
    this.statusBridge.dismissStatusPicker(isNew);
  }

  currentSelection(
    text: string,
    url: string,
    top: number,
    right: number,
    bottom: number,
    left: number,
  ) {
    this.linkBridge.currentSelection(text, url, top, right, bottom, left);
  }

  stateChanged(canUndo: boolean, canRedo: boolean) {
    if (this.undoRedoBridge) {
      this.undoRedoBridge.stateChanged(canUndo, canRedo);
    }
  }

  trackEvent(event: string) {
    this.analyticsBridge.trackEvent(event);
  }

  connectToCollabService(path: string): void {
    this.collabBridge.connect(path);
  }

  disconnectFromCollabService(): void {
    this.collabBridge.disconnect();
  }

  emitCollabChanges(event: string, jsonArgs: string): void {
    this.collabBridge.emit(event, jsonArgs);
  }

  call<T extends EditorBridgeNames>(
    bridge: T,
    event: keyof Exclude<EditorBridges[T], undefined>,
    ...args: any[]
  ) {
    sendToBridge(bridge, event, ...args);
  }

  updateTextColor() {}

  editorDestroyed(): void {
    if (this.lifecycleBridge) {
      this.lifecycleBridge.editorDestroyed();
    }
  }

  editorReady(): void {
    if (!this.lifecycleBridge) {
      const editorReadyTwice: EditorLifecycleAnalyticsEvents = {
        action:
          EditorLifecycleActions.EDITOR_READY_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP,
        actionSubject: ActionSubject.EDITOR,
        eventType: EventType.TRACK,
      };
      this.trackEvent(JSON.stringify(editorReadyTwice));
      return;
    }
    if (this._editorReady) {
      const editorReadyTwice: EditorLifecycleAnalyticsEvents = {
        action: EditorLifecycleActions.EDITOR_READY_CALLED_TWICE,
        actionSubject: ActionSubject.EDITOR,
        eventType: EventType.OPERATIONAL,
      };
      this.trackEvent(JSON.stringify(editorReadyTwice));
      return;
    }

    this._editorReady = true;
    this.lifecycleBridge.editorReady();
  }
}
