import {
  MentionPluginState,
  TextFormattingState,
  EditorActions,
  Command,
  CustomMediaPicker,
  BlockTypeState,
  ListsState,
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
  toggleSuperscriptWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleCodeWithAnalytics,
  toggleUnderlineWithAnalytics,
  toggleEmWithAnalytics,
  toggleStrongWithAnalytics,
  StatusState,
  updateStatusWithAnalytics,
  commitStatusPicker,
  insertBlockTypesWithAnalytics,
  setBlockTypeWithAnalytics,
  createTable,
  insertTaskDecision,
  changeColor,
  TypeAheadItem,
  selectItem as selectTypeAheadItem,
  insertLinkWithAnalytics,
  isTextAtPos,
  isLinkAtPos,
  setLinkHref,
  setLinkText,
  clearEditorContent,
  setKeyboardHeight,
  setMobilePaddingTop,
  INPUT_METHOD,
  BlockTypeInputMethod,
  InsertBlockInputMethodToolbar,
  LinkInputMethod,
  ListInputMethod,
  TextFormattingInputMethodBasic,
  typeAheadPluginKey,
  QuickInsertItem,
  QuickInsertPluginState,
  insertMentionQuery,
  insertEmojiQuery,
} from '@atlaskit/editor-core';
import { EditorViewWithComposition } from '../../types';
import { EditorState } from 'prosemirror-state';
import {
  undo as pmHistoryUndo,
  redo as pmHistoryRedo,
} from 'prosemirror-history';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Color as StatusColor } from '@atlaskit/status/element';

import NativeToWebBridge from './bridge';
import WebBridge from '../../web-bridge';
import { hasValue, createDeferred, DeferredValue } from '../../utils';
import { rejectPromise, resolvePromise } from '../../cross-platform-promise';
import { getEnableQuickInsertValue } from '../../query-param-reader';

type InsertQueryMethod = (
  inputMethod: InsertBlockInputMethodToolbar,
) => Command;

const insertQueryFromToolbar = (
  insertQueryMethod: InsertQueryMethod,
  editorView: EditorViewWithComposition | null,
) => {
  if (!editorView) {
    return;
  }
  const { state, dispatch } = editorView;

  insertQueryMethod(INPUT_METHOD.TOOLBAR)(state, dispatch);
};

export default class WebBridgeImpl extends WebBridge
  implements NativeToWebBridge {
  textFormatBridgeState: TextFormattingState | null = null;
  statusBridgeState: StatusState | null = null;
  blockFormatBridgeState: BlockTypeState | null = null;
  listBridgeState: ListsState | null = null;
  mentionsPluginState: MentionPluginState | null = null;
  editorView: EditorViewWithComposition | null = null;
  transformer: JSONTransformer = new JSONTransformer();
  editorActions: EditorActions = new EditorActions();
  mediaPicker: CustomMediaPicker | undefined;
  mediaMap: Map<string, Function> = new Map();
  quickInsertItems: DeferredValue<QuickInsertItem[]> = createDeferred<
    QuickInsertItem[]
  >();

  setPadding(
    top: number = 0,
    right: number = 0,
    bottom: number = 0,
    left: number = 0,
  ) {
    super.setPadding(top, right, bottom, left);
    /**
     * We need to dispatch an action to save this value on the mobileScroll plugin,
     * so that it can be used in `ClickAreaMobile` to calculate css rules properly.
     */
    if (this.editorView) {
      setMobilePaddingTop(top)(this.editorView.state, this.editorView.dispatch);
    }
  }

  sendHeight() {
    // not implemented yet
  }

  onBoldClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleStrongWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onItalicClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleEmWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onUnderlineClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleUnderlineWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onCodeClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleCodeWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onStrikeClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleStrikeWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onSuperClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleSuperscriptWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onSubClicked(
    inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.textFormatBridgeState && this.editorView) {
      toggleSubscriptWithAnalytics({ inputMethod })(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onMentionSelect(_mention: string) {}

  onMentionPickerResult(_result: string) {}

  onMentionPickerDismissed() {}

  onStatusUpdate(
    text: string,
    color: StatusColor,
    uuid: string,
    inputMethod: InsertBlockInputMethodToolbar = INPUT_METHOD.TOOLBAR,
  ) {
    if (this.statusBridgeState && this.editorView) {
      updateStatusWithAnalytics(inputMethod, {
        text,
        color,
        localId: uuid,
      })(this.editorView.state, this.editorView.dispatch);
    }
  }

  onStatusPickerDismissed() {
    if (this.statusBridgeState && this.editorView) {
      commitStatusPicker()(this.editorView);
    }
  }

  setContent(content: string) {
    if (this.editorActions) {
      this.editorActions.replaceDocument(content, false, false);
    }
  }

  clearContent() {
    if (this.editorView) {
      const { state, dispatch } = this.editorView;
      clearEditorContent(state, dispatch);
    }
  }

  getContent(): string {
    if (!this.editorView) {
      return '';
    }

    // Flush DOM to apply current in flight composition.
    this.flushDOM();

    return JSON.stringify(this.transformer.encode(this.editorView.state.doc));
  }

  setTextFormattingStateAndSubscribe(state: TextFormattingState) {
    this.textFormatBridgeState = state;
  }

  setTextColor(color: string) {
    if (this.editorView) {
      changeColor(color)(this.editorView.state, this.editorView.dispatch);
    }
  }

  onMediaPicked(eventName: string, mediaPayload: string) {
    if (this.mediaPicker) {
      const payload = JSON.parse(mediaPayload);

      switch (eventName) {
        case 'upload-preview-update': {
          payload.preview = {
            dimensions: payload.file.dimensions,
          };
          this.mediaPicker.emit('upload-preview-update', payload);
          return;
        }
        case 'upload-end': {
          /** emit a mobile-only event */
          this.mediaPicker.emit('mobile-upload-end', payload);
          return;
        }
      }
    }
  }

  onPromiseResolved(uuid: string, payload: string) {
    try {
      resolvePromise(uuid, JSON.parse(payload));
    } catch (err) {
      err.message = `${err.message}. Payload: ${JSON.stringify(payload)}`;
      rejectPromise(uuid, err);
    }
  }

  onPromiseRejected(uuid: string, err?: Error) {
    rejectPromise(uuid, err);
  }

  onBlockSelected(
    blockType: string,
    inputMethod: BlockTypeInputMethod = INPUT_METHOD.INSERT_MENU,
  ) {
    if (this.editorView) {
      const { state, dispatch } = this.editorView;
      setBlockTypeWithAnalytics(blockType, inputMethod)(state, dispatch);
    }
  }

  onOrderedListSelected(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      toggleOrderedList(this.editorView, inputMethod);
    }
  }
  onBulletListSelected(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      toggleBulletList(this.editorView, inputMethod);
    }
  }

  onIndentList(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      indentList(inputMethod)(this.editorView.state, this.editorView.dispatch);
    }
  }

  onOutdentList(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      outdentList(inputMethod)(this.editorView.state, this.editorView.dispatch);
    }
  }

  onLinkUpdate(
    text: string,
    url: string,
    inputMethod: LinkInputMethod = INPUT_METHOD.MANUAL,
  ) {
    if (!this.editorView) {
      return;
    }

    const { state, dispatch } = this.editorView;
    const { from, to } = state.selection;

    if (!isTextAtPos(from)(state)) {
      insertLinkWithAnalytics(
        inputMethod,
        from,
        to,
        url,
        text,
      )(state, dispatch);
      return;
    }

    // if cursor is on link => modify the whole link
    const { leftBound, rightBound } = isLinkAtPos(from)(state)
      ? {
          leftBound: from - state.doc.resolve(from).textOffset,
          rightBound: undefined,
        }
      : { leftBound: from, rightBound: to };

    [setLinkHref(url, leftBound, rightBound)]
      .reduce(
        (cmds, setLinkHrefCmd) =>
          // if adding link => set link then set link text
          // if removing link => execute the same reversed
          hasValue(url)
            ? [
                setLinkHrefCmd,
                setLinkText(text, leftBound, rightBound),
                ...cmds,
              ]
            : [
                setLinkText(text, leftBound, rightBound),
                setLinkHrefCmd,
                ...cmds,
              ],
        [] as Command[],
      )
      .forEach(cmd => cmd(this.editorView!.state, dispatch));
  }

  insertBlockType(
    type: string,
    inputMethod: BlockTypeInputMethod = INPUT_METHOD.INSERT_MENU,
    listLocalId?: string,
    itemLocalId?: string,
  ) {
    if (!this.editorView) {
      return;
    }

    const { state, dispatch } = this.editorView;

    switch (type) {
      case 'blockquote':
        insertBlockTypesWithAnalytics('blockquote', inputMethod)(
          state,
          dispatch,
        );
        return;
      case 'codeblock':
        insertBlockTypesWithAnalytics('codeblock', inputMethod)(
          state,
          dispatch,
        );
        return;
      case 'panel':
        insertBlockTypesWithAnalytics('panel', inputMethod)(state, dispatch);
        return;
      case 'action':
        insertTaskDecision(
          this.editorView,
          'taskList',
          inputMethod as InsertBlockInputMethodToolbar,
          listLocalId,
          itemLocalId,
        )(state, dispatch);
        return;
      case 'decision':
        insertTaskDecision(
          this.editorView,
          'decisionList',
          inputMethod as InsertBlockInputMethodToolbar,
          listLocalId,
          itemLocalId,
        )(state, dispatch);
        return;
      case 'table':
        createTable(state, dispatch);
        return;

      default:
        // eslint-disable-next-line no-console
        console.error(`${type} cannot be inserted as it's not supported`);
        return;
    }
  }

  insertMentionQuery() {
    insertQueryFromToolbar(insertMentionQuery, this.editorView);
  }

  insertEmojiQuery() {
    insertQueryFromToolbar(insertEmojiQuery, this.editorView);
  }

  insertTypeAheadItem(
    type: 'mention' | 'emoji' | 'quickinsert',
    payload: string,
  ) {
    if (!this.editorView) {
      return;
    }

    this.flushDOM();

    const { state, dispatch } = this.editorView;
    const enableQuickInsert = getEnableQuickInsertValue();

    const parsedPayload: TypeAheadItem | { index: number } = JSON.parse(
      payload,
    );
    const typeAheadPluginState: QuickInsertPluginState = typeAheadPluginKey.getState(
      state,
    );

    const selectedItem =
      enableQuickInsert && parsedPayload.index
        ? typeAheadPluginState.items[parsedPayload.index]
        : parsedPayload;

    selectTypeAheadItem(
      {
        // TODO export insert type from editor-core.
        selectItem: (state: EditorState, item: TypeAheadItem, insert: any) => {
          switch (type) {
            case 'quickinsert': {
              /**
               * For quickinsert, we already know at this point that the items are processed with `intl`,
               * so we cast this to be an array of `QuickInsertItem`.
               **/
              const items = (typeAheadPluginState.items as unknown) as QuickInsertItem[];
              const quickInsertItem = items[parsedPayload.index] as
                | QuickInsertItem
                | undefined;

              if (!quickInsertItem) {
                // eslint-disable-next-line no-console
                console.error(
                  `Could not select item at position: ${parsedPayload.index} in the quick insert items list`,
                  items,
                );
                return;
              }

              return enableQuickInsert && quickInsertItem.action(insert, state);
            }
            case 'mention': {
              const { id, name, nickname, accessLevel, userType } = item;
              const renderName = nickname ? nickname : name;
              const mention = state.schema.nodes.mention.createChecked({
                text: `@${renderName}`,
                id,
                accessLevel,
                userType: userType === 'DEFAULT' ? null : userType,
              });
              return insert(mention);
            }
            case 'emoji': {
              const { id, shortName, fallback } = item;
              const emoji = state.schema.nodes.emoji.createChecked({
                shortName,
                id,
                fallback,
                text: fallback || shortName,
              });
              return insert(emoji);
            }
            default:
              return false;
          }
        },
        // Needed for interface.
        trigger: '',
        getItems: () => [],
      },
      selectedItem as TypeAheadItem,
    )(state, dispatch);
  }

  setFocus(force: boolean) {
    if (!this.editorView) {
      return false;
    }
    if (this.editorView.hasFocus() && force) {
      /**
       * Forcefully remove focus (we re-focus below), as in some scenarios native views make webview cursors invisble.
       */
      (this.editorView.dom as HTMLElement).blur();
    }

    this.editorView.focus();
    return true;
  }

  scrollToSelection(): void {
    if (!this.editorView) {
      return;
    }

    this.editorView.dispatch(this.editorView.state.tr.scrollIntoView());
  }

  undo() {
    if (this.editorView) {
      pmHistoryUndo(this.editorView.state, this.editorView.dispatch);
    }
  }

  redo() {
    if (this.editorView) {
      pmHistoryRedo(this.editorView.state, this.editorView.dispatch);
    }
  }

  setKeyboardControlsHeight(height: string) {
    if (this.editorView) {
      setKeyboardHeight(+height)(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  flushDOM() {
    if (!this.editorView) {
      return false;
    }

    /**
     * NOTE: `domObserver` is a private API, it's used as a workaround to forcefully apply current composition
     * when integrators request the content. It doesn't break the users current composing so they may continue
     * to compose the current item.
     * @see ED-5924
     */
    const { composing, domObserver } = this.editorView;
    if (composing && domObserver) {
      domObserver.flush();
      return true;
    }

    return false;
  }

  getRootElement(): HTMLElement | null {
    return document.querySelector('#editor');
  }
}
