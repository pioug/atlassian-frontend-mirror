/* eslint-disable no-console */
import { Color as StatusColor } from '@atlaskit/status/element';
import NativeBridge, { EditorBridges, EditorBridgeNames } from './bridge';
import { sendToBridge } from '../../bridge-utils';

const callsFromDummyBridge = new Map<string, any[][]>();

const saveToDummyBridge = (name: string, args: any[]) => {
  const findExitingItem = callsFromDummyBridge.get(name);

  if (findExitingItem) {
    callsFromDummyBridge.set(name, findExitingItem.concat([args]));
  } else {
    callsFromDummyBridge.set(name, [[args]]);
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
    this.log(`updateText(content=${content})`);
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
    event: keyof Exclude<EditorBridges[T], undefined>,
    ...args: any[]
  ) {
    this.log(`call(${bridge}, ${event}, ${(args || []).join(', ')})`);
    sendToBridge(bridge, event, ...args);
  }
  updateTextColor() {}
}
