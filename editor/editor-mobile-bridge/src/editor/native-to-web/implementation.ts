import {
  BlockTypeInputMethod,
  BlockTypeState,
  changeColor,
  clearEditorContent,
  commitStatusPicker,
  createTable,
  CustomMediaPicker,
  EditorActions,
  INPUT_METHOD,
  InsertBlockInputMethodToolbar,
  insertBlockTypesWithAnalytics,
  insertLinkWithAnalyticsMobileNative,
  insertTaskDecision,
  isLinkAtPos,
  LinkInputMethod,
  ListInputMethod,
  ListState,
  MentionPluginState,
  QuickInsertItem,
  setBlockTypeWithAnalytics,
  setKeyboardHeight,
  setMobilePaddingTop,
  StatusState,
  StatusType,
  TextFormattingInputMethodBasic,
  TextFormattingState,
  toggleCodeWithAnalytics,
  toggleEmWithAnalytics,
  toggleStrikeWithAnalytics,
  toggleStrongWithAnalytics,
  toggleSubscriptWithAnalytics,
  toggleSuperscriptWithAnalytics,
  toggleUnderlineWithAnalytics,
  updateStatusWithAnalytics,
  updateLink,
  insertExpand,
  QuickInsertItemId,
  getListCommands,
  isTextAtPos,
  insertDate,
  dateToDateType,
  insertHorizontalRule,
  createTypeAheadTools,
  createQuickInsertTools,
} from '@atlaskit/editor-core';
import type { TypeAheadItem } from '@atlaskit/editor-common/provider-factory';
import { EditorViewWithComposition } from '../../types';
import { Selection, EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  redo as pmHistoryRedo,
  undo as pmHistoryUndo,
} from 'prosemirror-history';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { Color as StatusColor } from '@atlaskit/status/element';
import NativeToWebBridge from './bridge';
import WebBridge from '../../web-bridge';
import { createDeferred, DeferredValue } from '../../utils';
import { rejectPromise, resolvePromise } from '../../cross-platform-promise';
import { assertSelectionPayload } from '../../validation';
import { CollabSocket } from './collab-socket';
import { Socket } from '@atlaskit/collab-provider/types';
import { LifecycleImpl } from './lifecycle';
import {
  BridgeEventEmitter,
  allowListPayloadType,
  EventTypes,
} from '../event-dispatch';
import { Serialized } from '../../types';
import {
  Provider as CollabProvider,
  CollabMetadataPayload,
} from '@atlaskit/collab-provider';
import { toNativeBridge } from '../web-to-native';
import MobileEditorConfiguration from '../editor-configuration';
import { JSONDocNode } from '@atlaskit/editor-json-transformer';
import {
  measureContentRenderedPerformance,
  PerformanceMatrices,
  isContentEmpty,
} from '../../utils/bridge';
import MobileEditorToolbarActions from '../mobile-editor-toolbar';
import { trackFontSizeUpdated } from '../track-analytics';

export const defaultSetList: QuickInsertItemId[] = [
  'blockquote',
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'codeblock',
  'unorderedList',
  'orderedList',
  'rule',
  'mention',
  'emoji',
  'action',
  'decision',
  'infopanel',
  'notepanel',
  'successpanel',
  'warningpanel',
  'errorpanel',
  'layout',
  'hyperlink',
];

type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
) => boolean;
export type EditorConfigChange = (config: MobileEditorConfiguration) => void;

const closeTypeAheadAndRunCommand = (editorView?: EditorView) => (
  command: Command,
) => {
  if (!editorView) {
    return;
  }
  const tool = createTypeAheadTools(editorView);

  if (tool && tool.isOpen()) {
    tool.close({
      attachCommand: command,
      insertCurrentQueryAsRawText: false,
    });
  } else {
    command(editorView.state, editorView.dispatch);
  }
};

const closeTypeAheadAndUndo = (editorView?: EditorView) => {
  return closeTypeAheadAndRunCommand(editorView)(pmHistoryUndo);
};
const closeTypeAheadAndRedo = (editorView?: EditorView) => {
  return closeTypeAheadAndRunCommand(editorView)(pmHistoryRedo);
};

export default class WebBridgeImpl
  extends WebBridge
  implements NativeToWebBridge {
  textFormatBridgeState: TextFormattingState | null = null;
  statusBridgeState: StatusState | null = null;
  blockFormatBridgeState: BlockTypeState | null = null;
  listBridgeState: ListState | null = null;
  mentionsPluginState: MentionPluginState | null = null;
  editorView?: EditorViewWithComposition;
  transformer: JSONTransformer = new JSONTransformer();
  editorActions: EditorActions = new EditorActions();
  mediaPicker: CustomMediaPicker | undefined;
  mediaMap: Map<string, Function> = new Map();
  quickInsertItems: DeferredValue<QuickInsertItem[]> = createDeferred<
    QuickInsertItem[]
  >();
  collabSocket: CollabSocket | null = null;
  lifecycle: LifecycleImpl = new LifecycleImpl();
  eventEmitter: BridgeEventEmitter = new BridgeEventEmitter();
  allowList: allowListPayloadType = new Set(defaultSetList);
  mobileEditingToolbarActions = new MobileEditorToolbarActions();

  private collabProviderPromise: Promise<CollabProvider> | undefined;

  private onEditorConfigChanged: EditorConfigChange | null;
  private editorConfiguration: MobileEditorConfiguration;

  constructor(config?: MobileEditorConfiguration) {
    super();
    this.editorConfiguration = config || new MobileEditorConfiguration();
    this.onEditorConfigChanged = null;
  }

  getEditorConfiguration() {
    return this.editorConfiguration;
  }

  setEditorConfiguration(editorConfig: MobileEditorConfiguration) {
    this.editorConfiguration = editorConfig;
  }

  setEditorConfigChangeHandler(handleEditorConfigChanged: EditorConfigChange) {
    this.onEditorConfigChanged = handleEditorConfigChanged;
  }

  setCollabProviderPromise(
    collabProviderPromise: Promise<CollabProvider> | undefined,
  ) {
    this.collabProviderPromise = collabProviderPromise;
  }

  async fetchPayload<T = unknown>(category: string, uuid: string): Promise<T> {
    var originURL = new URL(window.location.href);
    originURL.protocol = `fabric-hybrid`;
    const payloadURL = originURL.origin + `/payload/${category}/${uuid}`;
    const response = await fetch(payloadURL);
    return response.json();
  }

  setPadding(
    top: number = 0,
    right: number = 0,
    bottom: number = 0,
    left: number = 0,
  ) {
    super.setPadding(top, right, bottom, left);
    /**
     * We need to dispatch an action to save this value on the mobileDimensions plugin,
     * so that it can be used in `ClickAreaMobile` to calculate css rules properly.
     */
    if (this.editorView) {
      setMobilePaddingTop(top)(this.editorView.state, this.editorView.dispatch);
    }
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
    this.replaceContent(content);
  }

  async setContentPayload(uuid: string) {
    const content = await this.fetchPayload('content', uuid);
    this.replaceContent(content);
  }

  replaceContent(content: any) {
    const performanceMatrices = new PerformanceMatrices();

    if (this.editorActions) {
      const isReplaced = this.editorActions.replaceDocument(
        content,
        false,
        false,
      );

      if (isReplaced) {
        let adfContent: JSONDocNode;
        try {
          adfContent = JSON.parse(content);
        } catch (e) {
          return;
        }
        if (!isContentEmpty(adfContent)) {
          measureContentRenderedPerformance(
            adfContent,
            (totalNodeSize, nodes, actualRenderingDuration) => {
              toNativeBridge.onContentRendered(
                totalNodeSize,
                nodes,
                actualRenderingDuration,
                performanceMatrices.duration,
              );
            },
          );
        }
      }
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

  async onPromiseResolvedPayload(uuid: string) {
    try {
      const payload = await this.fetchPayload('promise', uuid);
      resolvePromise(uuid, payload);
    } catch (err) {
      err.message = `${err.message}.`;
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
      getListCommands().toggleOrderedList(this.editorView, inputMethod);
    }
  }

  onBulletListSelected(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      getListCommands().toggleBulletList(this.editorView, inputMethod);
    }
  }

  onIndentList(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      getListCommands().indentList(inputMethod)(
        this.editorView.state,
        this.editorView.dispatch,
      );
    }
  }

  onOutdentList(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
    if (this.listBridgeState && this.editorView) {
      getListCommands().outdentList(inputMethod)(
        this.editorView.state,
        this.editorView.dispatch,
      );
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

    // Inserting a new link on a block node or with no selection
    if (
      (!isLinkAtPos(from)(state) && from === to) ||
      !isTextAtPos(from)(state)
    ) {
      insertLinkWithAnalyticsMobileNative(
        inputMethod,
        from,
        to,
        url,
        undefined,
        text,
      )(state, dispatch);
      return;
    }

    // Editing an existing link or inserting a link with a text selection
    const { leftBound, rightBound } = isLinkAtPos(from)(state)
      ? {
          leftBound: from - state.doc.resolve(from).textOffset,
          rightBound: undefined,
        }
      : { leftBound: from, rightBound: to };

    return updateLink(url, text || url, leftBound, rightBound)(state, dispatch);
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
      case 'divider':
        insertHorizontalRule(inputMethod as InsertBlockInputMethodToolbar)(
          state,
          dispatch,
        );
        return;
      case 'expand':
        insertExpand(state, dispatch);
        return;
      case 'table':
        createTable()(state, dispatch);
        return;

      default:
        // eslint-disable-next-line no-console
        console.error(`${type} cannot be inserted as it's not supported`);
        return;
    }
  }

  insertMentionQuery() {
    if (!this.editorView) {
      return;
    }
    createTypeAheadTools(this.editorView).openMention(INPUT_METHOD.TOOLBAR);
  }

  insertEmojiQuery() {
    if (!this.editorView) {
      return;
    }
    createTypeAheadTools(this.editorView).openEmoji(INPUT_METHOD.TOOLBAR);
  }

  insertTypeAheadItem(
    type: 'mention' | 'emoji' | 'quickinsert',
    payload: string,
  ) {
    if (!this.editorView) {
      return;
    }

    const enableQuickInsert = this.editorConfiguration.isQuickInsertEnabled();
    this.flushDOM();

    const parsedPayload: TypeAheadItem = JSON.parse(payload);

    const tool = createTypeAheadTools(this.editorView);
    if (!tool) {
      return;
    }
    const query = tool.currentQuery();

    switch (type) {
      case 'mention':
        tool.insertItemMention({
          query,
          sourceListItem: [],
          contentItem: {
            ...parsedPayload,
            mention: parsedPayload,
          },
        });
        break;
      case 'emoji':
        tool.insertItemEmoji({
          query,
          sourceListItem: [],
          contentItem: {
            ...parsedPayload,
            emoji: parsedPayload,
          },
        });
        break;
      case 'quickinsert':
        if (!enableQuickInsert) {
          return;
        }
        const index = parseInt(parsedPayload.index, 10);
        if (!Number.isInteger(index)) {
          return;
        }

        const quickInsertTool = createQuickInsertTools(this.editorView);
        const quickInsertList = quickInsertTool.getItems(query, {
          disableDefaultItems: true,
        });
        const quickInsertItem = quickInsertList[index];

        if (!quickInsertItem) {
          return;
        }

        tool.insertItemQuickInsert({
          query,
          sourceListItem: quickInsertList,
          contentItem: quickInsertItem,
        });

        break;
    }
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
    closeTypeAheadAndUndo(this.editorView);
  }

  redo() {
    closeTypeAheadAndRedo(this.editorView);
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

  setSelection(rawPayload: string): void {
    const rawData: unknown = JSON.parse(rawPayload);
    const result = assertSelectionPayload(rawData);

    if (result.error) {
      throw result.error;
    }

    if (!this.editorView) {
      return;
    }

    const previousFocus = document.activeElement as null | HTMLElement;
    const rootElement = this.getRootElement();
    const editableElement = rootElement
      ? (rootElement.querySelector(
          '[contenteditable="true"]',
        ) as HTMLElement | null)
      : null;
    const needsFocus = previousFocus !== editableElement;

    if (editableElement && needsFocus) {
      editableElement.focus();
    }

    const {
      state: { tr, doc },
      dispatch,
    } = this.editorView;

    dispatch(
      tr
        .setSelection(Selection.fromJSON(doc, result.data.selection))
        .scrollIntoView(),
    );
  }

  createCollabSocket(path: string): Socket {
    this.collabSocket = new CollabSocket(path, {
      onDisconnect: () => {
        // Clean collab socket on disconnect
        this.collabSocket = null;
      },
    });

    return this.collabSocket;
  }

  onCollabEvent(event: string, payload: string): void {
    if (this.collabSocket) {
      this.collabSocket.received(event, payload);
    }
  }

  saveCollabChanges(): void {
    this.lifecycle.saveCollabChanges();
  }

  restoreCollabChanges(): void {
    this.lifecycle.restoreCollabChanges();
  }

  getQuickInsertAllowList(): Serialized<QuickInsertItemId> {
    return JSON.stringify([...this.allowList]);
  }

  setQuickInsertAllowList(newList: Serialized<QuickInsertItemId>): void {
    const newSetList: allowListPayloadType = new Set(JSON.parse(newList));
    this.eventEmitter.emit(EventTypes.SET_NEW_ALLOWED_INSERT_LIST, newSetList);
    this.allowList = newSetList;
  }

  addQuickInsertAllowListItem(listItems: Serialized<QuickInsertItemId>): void {
    const newItems = JSON.parse(listItems);
    newItems.forEach((item: QuickInsertItemId) => this.allowList.add(item));
    this.eventEmitter.emit(
      EventTypes.ADD_NEW_ALLOWED_INSERT_LIST_ITEM,
      this.allowList,
    );
  }

  removeQuickInsertAllowListItem(
    listItems: Serialized<QuickInsertItemId>,
  ): void {
    const removeItems = JSON.parse(listItems);
    removeItems.forEach((item: QuickInsertItemId) =>
      this.allowList.delete(item),
    );
    this.eventEmitter.emit(
      EventTypes.REMOVE_ALLOWED_INSERT_LIST_ITEM,
      this.allowList,
    );
  }

  /**
   * Used to observe the height of the rendered content and notify the native side when that happens
   * by calling RendererBridge#onRenderedContentHeightChanged.
   *
   * @param enabled whether the height is being observed (and therefore the callback is being called).
   */
  observeRenderedContentHeight(enabled: boolean) {
    this.eventEmitter.emit(
      EventTypes.SET_DOCUMENT_REFLOW_DETECTOR_STATUS,
      enabled,
    );
  }

  setTitle(title: string) {
    if (this.collabProviderPromise) {
      this.collabProviderPromise.then((collabProvider) =>
        collabProvider.setTitle(title, true),
      );
    }
  }

  setupTitle() {
    const onMetadataChange = (metadata: CollabMetadataPayload) => {
      const { title } = metadata;
      if (title) {
        toNativeBridge.updateTitle(title as string);
      }
    };

    if (this.collabProviderPromise) {
      const setupPromise = this.collabProviderPromise.then((provider) => {
        provider.on('metadata:changed', onMetadataChange);
        return () => {
          provider.off('metadata:changed', onMetadataChange);
        };
      });
      return () => {
        setupPromise.then((destroy) => destroy());
      };
    }

    return () => {};
  }

  cancelTypeAhead() {
    if (!this.editorView) {
      return;
    }

    const tool = createTypeAheadTools(this.editorView);
    tool.close({ insertCurrentQueryAsRawText: true });
  }

  configure(config: string) {
    if (!this.onEditorConfigChanged) {
      return;
    }
    const updatedConfig = this.editorConfiguration.cloneAndUpdateConfig(config);
    this.onEditorConfigChanged(updatedConfig);
  }

  registerEditor(editorActions: EditorActions) {
    // At this point editor view event dispatcher always exist...
    // Add a checker to throw or register some event to prevent future errors
    const eventDispatcher = editorActions._privateGetEventDispatcher();
    const editorView = editorActions._privateGetEditorView();

    if (!eventDispatcher || !editorView) {
      throw new Error(
        'Editor lifecycle has changed. EditorView and EventDispatcher are no longer available on EditorReady event',
      );
    }
    this.editorView = editorView as EditorView & EditorViewWithComposition;
    this.editorActions._privateRegisterEditor(editorView, eventDispatcher);
  }

  unregisterEditor() {
    delete this.editorView;
    this.editorActions._privateUnregisterEditor();
  }

  performEditAction(key: string, value: string | null = null) {
    if (this.editorView) {
      this.mobileEditingToolbarActions.performEditAction(
        key,
        this.editorView,
        value,
      );
    }
  }

  /**
   * Sets an allowed editing capability list for the adaptive toolbar.
   * When provided, given allowed list will be used to filter out floating toolbar items.
   * When it is empty, it will act as there is no filter, all items will be allowed.
   * @param allowedList is the json array of ids.
   */
  setToolbarEditAllowList(allowedList: string) {
    let list = JSON.parse(allowedList);
    this.mobileEditingToolbarActions.setEditAllowList(list);
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

  /**
   * Inserts a node in the Hybrid Editor.
   * Most node types are implemented on web, and we can use their implementation here.
   * We only need to create a transaction for a node if it doesn't exist already.
   * @param nodeType is the node we are inserting in the editor.
   */
  insertNode(nodeType: string) {
    const apply = (command: Command) => {
      const { state, dispatch } = this.editorView!;
      command(state, dispatch);
    };

    switch (nodeType) {
      case 'status':
        const status = {
          text: '',
          color: 'neutral',
        } as StatusType;

        apply(updateStatusWithAnalytics(INPUT_METHOD.TOOLBAR, status));
        break;
      case 'date':
        const dateType = dateToDateType(new Date());

        apply(insertDate(dateType, INPUT_METHOD.TOOLBAR, INPUT_METHOD.PICKER));
        break;
      default:
        break;
    }
  }

  getStepVersion() {
    if (!this.collabProviderPromise) {
      return toNativeBridge.updateStepVersion(
        undefined,
        'Collaborative edit is not enabled',
      );
    }

    this.collabProviderPromise?.then(async (provider) => {
      try {
        const state = await provider.getFinalAcknowledgedState();
        toNativeBridge.updateStepVersion(state.stepVersion);
      } catch (error) {
        toNativeBridge.updateStepVersion(undefined, error.message);
      }
    });
  }
}
