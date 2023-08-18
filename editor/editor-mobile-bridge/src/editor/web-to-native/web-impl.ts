import type { Color as StatusColor } from '@atlaskit/status/element';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type { EditorBridges, EditorBridgeNames } from './bridge';
import type NativeBridge from './bridge';
import type { Serialized } from '../../types';

export default class WebBridge implements NativeBridge {
  private window: Window;

  constructor(win: Window = window) {
    this.window = win;
  }

  private emit(name: string, args?: any) {
    if ((this.window as any).messageHandler) {
      (this.window as any).messageHandler.emit(name, args);
    }
  }

  showMentions(query: string) {}

  dismissMentions() {}

  updateTextFormat(markStates: string) {}

  updateText(content: string) {}

  updateTextWithADFStatus(content: string, isEmptyADF: boolean) {}

  getServiceHost(): string {
    return '';
  }

  getCollection(): string {
    return '';
  }

  submitPromise(name: string, uuid: string, args: string) {
    this.emit('submitPromise', { name, uuid, args });
  }

  updateBlockState(currentBlockType: string) {}

  updateListState(listState: string) {}

  showStatusPicker(
    text: string,
    color: StatusColor,
    uuid: string,
    isNew: boolean,
  ) {}

  dismissStatusPicker(isNew: boolean) {}

  currentSelection(
    text: string,
    url: string,
    top: number,
    right: number,
    bottom: number,
    left: number,
  ) {}

  stateChanged(canUndo: boolean, canRedo: boolean) {}

  trackEvent(event: string) {}

  connectToCollabService(path: string): void {
    this.emit('connectToCollabService');
  }

  disconnectFromCollabService(): void {
    this.emit('disconnectFromCollabService');
  }

  emitCollabChanges(event: string, jsonArgs: string): void {
    this.emit('emitCollabChanges', { event, jsonArgs });
  }

  call<T extends EditorBridgeNames>(
    bridge: T,
    event: keyof Required<EditorBridges>[T],
    ...args: any[]
  ) {
    this.emit(event as string, ...args);
  }

  updateTextColor() {}

  editorDestroyed(): void {
    this.emit('editorDestroyed');
  }

  editorError(error: string, errorInfo?: string): void {
    this.emit('editorError', { error, errorInfo });
  }

  startWebBundle(): void {
    this.emit('startWebBundle');
  }

  editorReady(): void {
    this.emit('editorReady');
  }

  onContentRendered(
    totalNodeSize: number,
    nodes: string,
    actualRenderingDuration: number,
    totalBridgeDuration: number,
  ): void {}

  onRenderedContentHeightChanged(height: number): void {}

  updateTitle(title: string) {}

  typeAheadQuery(query: string, trigger: string): void {}

  typeAheadDisplayItems(query: string, trigger: string, items: string): void {}

  typeAheadItemSelected(quickInsertItem: Serialized<QuickInsertItem>): void {
    this.emit('typeAheadItemSelected', { quickInsertItem });
  }

  dismissTypeAhead() {
    this.emit('dismissTypeahead');
  }

  onNodeSelected(nodeType: string, items: string) {
    this.emit('onNodeSelected', { nodeType, items });
  }

  onNodeDeselected() {
    this.emit('onNodeDeselected');
  }

  updateStepVersion(stepVersion?: number, error?: string) {}

  onCollabError(message: string, status: number, code: string) {}
}
