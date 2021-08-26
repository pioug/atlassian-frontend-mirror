import { Color as StatusColor } from '@atlaskit/status/element';
import { QuickInsertItem } from '@atlaskit/editor-core/src/plugins/quick-insert/types';
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
  TypeAheadBridge,
  TextFormattingBridge,
  UndoRedoBridge,
  ContentBridge,
  PageTitleBridge,
  ToolbarBridge,
} from './bridge';

import { sendToBridge } from '../../bridge-utils';
import {
  EditorLifecycleActions,
  EditorLifecycleAnalyticsEvents,
} from '../../analytics/lifecycle';
import { ActionSubject, EventType } from '../../analytics/enums';
import { Serialized } from '../../types';

export default class AndroidBridge implements NativeBridge {
  mentionBridge: MentionBridge;
  textFormatBridge: TextFormattingBridge;
  mediaBridge: MediaBridge;
  promiseBridge: PromiseBridge;
  listBridge: ListBridge;
  statusBridge: StatusBridge;
  typeAheadBridge: TypeAheadBridge;
  linkBridge: LinkBridge;
  undoRedoBridge: UndoRedoBridge;
  analyticsBridge: AnalyticsBridge;
  collabBridge: CollabBridge;
  lifecycleBridge?: LifecycleBridge;
  contentBridge: ContentBridge;
  pageTitleBridge?: PageTitleBridge;
  toolbarBridge?: ToolbarBridge;

  private _editorReady: boolean = false;
  private _startWebBundle: boolean = false;

  constructor(win: Window = window as Window) {
    this.mentionBridge = win.mentionsBridge!;
    this.textFormatBridge = win.textFormatBridge!;
    this.mediaBridge = win.mediaBridge!;
    this.promiseBridge = win.promiseBridge!;
    this.listBridge = win.listBridge!;
    this.statusBridge = win.statusBridge!;
    this.typeAheadBridge = win.typeAheadBridge!;
    this.linkBridge = win.linkBridge!;
    this.undoRedoBridge = win.undoRedoBridge!;
    this.analyticsBridge = win.analyticsBridge!;
    this.collabBridge = win.collabBridge!;
    this.lifecycleBridge = win.lifecycleBridge;
    this.contentBridge = win.contentBridge as ContentBridge;
    this.pageTitleBridge = win.pageTitleBridge;
    this.toolbarBridge = win.toolbarBridge as ToolbarBridge;
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

  updateTextWithADFStatus(content: string, isEmptyADF: boolean) {
    this.textFormatBridge.updateTextWithADFStatus(content, isEmptyADF);
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
    event: keyof Required<EditorBridges>[T],
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

  editorError(error: string, errorInfo?: string): void {
    const editorError: EditorLifecycleAnalyticsEvents = {
      action: EditorLifecycleActions.EDITOR_ERROR,
      actionSubject: ActionSubject.EDITOR,
      eventType: EventType.OPERATIONAL,
      attributes: {
        isBridgeSetup: !!this.lifecycleBridge,
        errorMessage: error,
      },
    };
    this.trackEvent(JSON.stringify(editorError));

    if (this.lifecycleBridge && this.lifecycleBridge.editorError) {
      this.lifecycleBridge.editorError(error, errorInfo);
    }
  }

  startWebBundle(): void {
    if (!this.lifecycleBridge) {
      const webBundleStartTwice: EditorLifecycleAnalyticsEvents = {
        action:
          EditorLifecycleActions.START_WEB_BUNDLE_CALLED_BEFORE_LIFECYCLE_BRIDGE_SETUP,
        actionSubject: ActionSubject.EDITOR,
        eventType: EventType.TRACK,
      };
      this.trackEvent(JSON.stringify(webBundleStartTwice));
      return;
    }

    if (this._startWebBundle) {
      const webBundleStartTwice: EditorLifecycleAnalyticsEvents = {
        action: EditorLifecycleActions.START_WEB_BUNDLE_CALLED_TWICE,
        actionSubject: ActionSubject.EDITOR,
        eventType: EventType.OPERATIONAL,
      };
      this.trackEvent(JSON.stringify(webBundleStartTwice));
      return;
    }

    this._startWebBundle = true;
    if (this.lifecycleBridge.startWebBundle) {
      this.lifecycleBridge.startWebBundle();
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

  onContentRendered(
    totalNodeSize: number,
    nodes: string,
    actualRenderingDuration: number,
    totalBridgeDuration: number,
  ): void {
    if (this.contentBridge) {
      this.contentBridge.onContentRendered(
        totalNodeSize,
        nodes,
        actualRenderingDuration,
        totalBridgeDuration,
      );
    }
  }

  onRenderedContentHeightChanged(height: number) {
    if (this.contentBridge) {
      this.contentBridge.onRenderedContentHeightChanged(height);
    }
  }

  updateTitle(title: string) {
    if (this.pageTitleBridge) {
      this.pageTitleBridge.updateTitle(title);
    }
  }

  typeAheadQuery(query: string, trigger: string): void {}

  typeAheadDisplayItems(query: string, trigger: string, items: string): void {}
  typeAheadItemSelected(quickInsertItem: Serialized<QuickInsertItem>): void {
    if (this.typeAheadBridge) {
      this.typeAheadBridge.typeAheadItemSelected(quickInsertItem);
    }
  }

  dismissTypeAhead() {
    if (this.typeAheadBridge) {
      this.typeAheadBridge.dismissTypeAhead();
    }
  }

  onNodeSelected(nodeType: string, items: string) {
    if (this.toolbarBridge) {
      this.toolbarBridge.onNodeSelected(nodeType, items);
    }
  }

  onNodeDeselected() {
    if (this.toolbarBridge) {
      this.toolbarBridge.onNodeDeselected();
    }
  }

  updateStepVersion(stepVersion?: number, error?: string) {
    if (this.collabBridge) {
      this.collabBridge.updateStepVersion(stepVersion, error);
    }
  }
}
