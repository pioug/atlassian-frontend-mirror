import { Serialized } from '../../types';

export default interface NativeBridge
  extends MentionBridge,
    TextFormattingBridge,
    PromiseBridge,
    ListBridge,
    StatusBridge,
    LinkBridge,
    UndoRedoBridge,
    AnalyticsBridge,
    SelectionBridge,
    CollabEditNativeBridge,
    LifecycleBridge,
    ContentBridge {
  call<T extends EditorBridgeNames>(
    bridge: T,
    event: keyof Required<EditorBridges>[T],
    ...args: any[]
  ): void;
}

import { Color as StatusColor } from '@atlaskit/status/element';
import { CollabAnalyticsEvents } from '../../analytics/collab';

export interface EditorBridges {
  mentionsBridge?: MentionBridge;
  mentionBridge?: MentionBridge;
  textFormatBridge?: TextFormattingBridge;
  mediaBridge?: MediaBridge;
  promiseBridge?: PromiseBridge;
  listBridge?: ListBridge;
  blockFormatBridge?: TextFormattingBridge;
  statusBridge?: StatusBridge;
  typeAheadBridge?: TypeAheadBridge;
  linkBridge?: LinkBridge;
  undoRedoBridge?: UndoRedoBridge;
  analyticsBridge?: AnalyticsBridge;
  selectionBridge?: SelectionBridge;
  collabBridge?: CollabBridge;
  lifecycleBridge?: LifecycleBridge;
  contentBridge?: ContentBridge;
}

export type EditorBridgeNames = keyof EditorBridges;

export interface MentionBridge {
  showMentions(query: String): void;
  dismissMentions(): void;
}

export interface TextFormattingBridge {
  updateTextFormat(markStates: string): void;
  updateText(content: string): void;
  updateBlockState(currentBlockType: string): void;
  updateTextColor(color: string): void;
}

export interface MediaBridge {
  getServiceHost(): string;
  getCollection(): string;
}

export interface PromiseBridge {
  submitPromise(name: string, uuid: string, args?: string): void;
}

export interface ListBridge {
  updateListState(listState: string): void;
}

export interface StatusBridge {
  showStatusPicker(
    text: string,
    color: StatusColor,
    uuid: string,
    isNew: boolean,
  ): void;
  dismissStatusPicker(isNew: boolean): void;
}

export interface TypeAheadBridge {
  dismissTypeAhead(): void;
  typeAheadQuery(query: string, trigger: string): void;
  typeAheadDisplayItems(query: string, trigger: string, items: string): void;
}

export interface LinkBridge {
  currentSelection(
    text: string,
    url: string,
    top: number,
    right: number,
    bottom: number,
    left: number,
  ): void;
}

export interface UndoRedoBridge {
  stateChanged(canUndo: boolean, canRedo: boolean): void;
}

export interface AnalyticsBridge {
  trackEvent(eventPayload: Serialized<CollabAnalyticsEvents> | string): void;
}

export interface SelectionBridge {}

export interface CollabBridge {
  emit(event: string, jsonArgs: string): void;
  connect(path: string): void;
  disconnect(): void;
}

export interface LifecycleBridge {
  editorReady(): void;
  editorDestroyed(): void;
  editorError?(error: string, errorInfo?: string): void;
  startWebBundle?(): void;
}

export interface CollabEditNativeBridge {
  connectToCollabService: CollabBridge['connect'];
  emitCollabChanges: CollabBridge['emit'];
  disconnectFromCollabService: CollabBridge['disconnect'];
}

export interface ContentBridge {
  onRenderedContentHeightChanged(height: number): void;
}
