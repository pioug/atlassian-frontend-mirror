import {
  BlockTypeInputMethod,
  InsertBlockInputMethodToolbar,
  LinkInputMethod,
  ListInputMethod,
  TextFormattingInputMethodBasic,
} from '@atlaskit/editor-core';
import { Color as StatusColor } from '@atlaskit/status/element';

export default interface NativeToWebBridge {
  currentVersion(): string;
  onBoldClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onItalicClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onUnderlineClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onCodeClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onStrikeClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onSuperClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onSubClicked(inputMethod: TextFormattingInputMethodBasic): void;
  onMentionSelect(id: string, displayName: string): void;
  onMentionPickerResult(result: string): void;
  setContent(content: string): void;
  getContent(): string;
  clearContent(): void;
  onMediaPicked(eventName: string, payload: string): void;
  onPromiseResolved(uuid: string, paylaod: string): void;
  onPromiseRejected(uuid: string, err?: Error): void;
  onBlockSelected(blockType: string, inputMethod: BlockTypeInputMethod): void;
  onOrderedListSelected(inputMethod: ListInputMethod): void;
  onBulletListSelected(inputMethod: ListInputMethod): void;
  onIndentList(inputMethod: ListInputMethod): void;
  onOutdentList(inputMethod: ListInputMethod): void;
  onStatusUpdate(
    text: string,
    color: StatusColor,
    uuid: string,
    inputMethod: InsertBlockInputMethodToolbar,
  ): void;
  onStatusPickerDismissed(): void;
  onLinkUpdate(text: string, url: string, inputMethod: LinkInputMethod): void;
  insertBlockType(
    type: string,
    inputMethod: BlockTypeInputMethod,
    listLocalId?: string,
    itemLocalId?: string,
  ): void;
  scrollToSelection(): void;
  undo(): void;
  redo(): void;
  setKeyboardControlsHeight(height: string): void;
}
