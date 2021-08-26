/* eslint-disable no-console */
import { Color as StatusColor } from '@atlaskit/status/element';
import { QuickInsertItem } from '@atlaskit/editor-core/src/plugins/quick-insert/types';
import NativeBridge, { EditorBridges, EditorBridgeNames } from './bridge';
import { sendToBridge } from '../../bridge-utils';
import { Serialized } from '../../types';

const callsFromDummyBridge = new Map<string, any[][]>();

const saveToDummyBridge = (name: string, args: any[]) => {
  const existingCalls = callsFromDummyBridge.get(name);

  if (existingCalls) {
    existingCalls.push(args);
  } else {
    callsFromDummyBridge.set(name, [args]);
  }
};

export default class DummyBridge implements NativeBridge {
  private log = (...args: any[]) => console.debug(...args);

  constructor() {
    (window as any).callsFromDummyBridge = callsFromDummyBridge;
    callsFromDummyBridge.clear();
  }

  showMentions(query: string) {
    this.log(`showMentions(query=${query})`);
  }
  dismissMentions() {
    this.log('dismissMentions');
  }
  updateTextFormat(markStates: string) {
    this.log(`updateTextFormat(markStates=${markStates})`);
  }
  updateText(content: string) {
    this.log(`updateText(content=${content}`);
  }
  updateTextWithADFStatus(content: string, isEmptyADF: boolean) {
    this.log(
      `updateTextWithADFStatus(content=${content}, isEmptyADF=${isEmptyADF})`,
    );
  }
  submitPromise(name: string, uuid: string, args: string) {
    this.log(`submitPromise(name=${name}, uuid=${uuid}, args=${args})`);
    saveToDummyBridge('submitPromise', [...arguments]);
  }
  updateBlockState(currentBlockType: string) {
    this.log(`updateBlockState(currentBlockType=${currentBlockType})`);
  }
  updateListState(listState: string) {
    this.log(`updateListState(listState=${listState})`);
  }
  showStatusPicker(
    text: string,
    color: StatusColor,
    uuid: string,
    isNew: boolean,
  ) {
    this.log(
      `showStatusPicker(text=${text}, color=${color}, uuid=${uuid}), isNew=${isNew})`,
    );
  }
  dismissStatusPicker(isNew: boolean) {
    this.log(`dismissStatusPicker(isNew=${isNew})`);
  }
  currentSelection(
    text: string,
    url: string,
    top: number,
    right: number,
    bottom: number,
    left: number,
  ) {
    this.log(
      `currentSelection(text=${text}, url=${url}, top=${top}, right=${right}, bottom=${bottom}, left=${left})`,
    );
  }
  stateChanged(canUndo: boolean, canRedo: boolean) {
    this.log(`stateChanged(canUndo=${canUndo}, canRedo=${canRedo})`);
  }
  trackEvent(event: string) {
    this.call('analyticsBridge', 'trackEvent', event);
  }

  // TODO: I need to implement this somehow.... Or it's just ok with just logging?
  connectToCollabService(path: string): void {}

  disconnectFromCollabService(): void {}

  emitCollabChanges(event: string, jsonArgs: string): void {}

  call<T extends EditorBridgeNames>(
    bridge: T,
    event: keyof Required<EditorBridges>[T],
    ...args: any[]
  ) {
    this.log(`call(${bridge}, ${event}, ${(args || []).join(', ')})`);
    sendToBridge(bridge, event, ...args);
  }

  updateTextColor() {}

  editorReady() {
    this.call('lifecycleBridge', 'editorReady');
  }

  editorError(error: string, errorInfo: string): void {
    this.call('lifecycleBridge', 'editorError', error, errorInfo);
  }

  startWebBundle(): void {
    this.call('lifecycleBridge', 'startWebBundle');
  }

  editorDestroyed() {
    this.call('lifecycleBridge', 'editorDestroyed');
  }

  onContentRendered(
    totalNodeSize: number,
    nodes: string,
    actualRenderingDuration: number,
    totalBridgeDuration: number,
  ): void {
    this.call(
      'contentBridge',
      'onContentRendered',
      totalNodeSize,
      nodes,
      actualRenderingDuration,
      totalBridgeDuration,
    );
  }

  onRenderedContentHeightChanged(height: number) {
    this.call('contentBridge', 'onRenderedContentHeightChanged', height);
  }

  updateTitle(title: string): void {
    this.log(`updateTitle(title=${title})`);
  }

  dismissTypeAhead(): void {
    this.call('typeAheadBridge', 'dismissTypeAhead');
  }

  typeAheadQuery(query: string, trigger: string): void {
    this.log(`typeAheadQuery(query=${query}, trigger=${trigger})`);
  }

  typeAheadDisplayItems(query: string, trigger: string, items: string): void {
    this.log(
      `typeAheadQuery(query=${query}, trigger=${trigger}), items=${items}`,
    );
  }

  typeAheadItemSelected(quickInsertItem: Serialized<QuickInsertItem>): void {
    this.log(`typeAheadItemSelected(quickInsertItem=${quickInsertItem}`);
    this.call('typeAheadBridge', 'typeAheadItemSelected', quickInsertItem);
  }

  onNodeSelected(nodeType: string, items: string) {
    this.log(`onNodeSelected(${nodeType} -> ${items}`);
    saveToDummyBridge('onNodeSelected', [nodeType, items]);
  }

  onNodeDeselected() {
    this.log('onNodeDeselected()');
    saveToDummyBridge('onNodeDeselected', []);
  }

  updateStepVersion(stepVersion?: number, error?: string) {
    saveToDummyBridge('updateStepVersion', [stepVersion, error]);
  }
}
