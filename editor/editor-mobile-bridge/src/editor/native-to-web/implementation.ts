import type { TOOLBAR_MENU_TYPE as InsertBlockInputMethodToolbar } from '@atlaskit/editor-common/types';
import type { StatusState, StatusType } from '@atlaskit/editor-plugin-status';
import type { CustomMediaPicker } from '@atlaskit/editor-plugin-media/types';
import type { ListState, InputMethod as ListInputMethod } from '@atlaskit/editor-plugin-list';
import type {
	BlockTypeState,
	InputMethod as BlockTypeInputMethod,
	TextBlockTypes,
} from '@atlaskit/editor-plugin-block-type';
import type {
	QuickInsertItem,
	QuickInsertItemId,
	TypeAheadItem,
} from '@atlaskit/editor-common/provider-factory';
import { EditorActions } from '@atlaskit/editor-core';
import { clearEditorContent } from '@atlaskit/editor-common/commands';
import { setMobilePaddingTop, setIsExpanded } from '../editor-plugins/mobile-dimensions/commands';
import { createTable } from '@atlaskit/editor-plugin-table/commands';
import { dateToDateType } from '../../utils/dateToDateType';
import type {
	TypeAheadHandler,
	InputMethodBasic as TextFormattingInputMethodBasic,
	TextFormattingState,
	LinkInputType as LinkInputMethod,
	ExtractInjectionAPI,
	FeatureFlags,
} from '@atlaskit/editor-common/types';
import { hasVisibleContent } from '@atlaskit/editor-common/utils';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { isTextAtPos, isLinkAtPos } from '@atlaskit/editor-common/link';
import type { EditorViewWithComposition, Serialized } from '../../types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { TextSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { redo as pmHistoryRedo, undo as pmHistoryUndo } from '@atlaskit/editor-prosemirror/history';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import type { Color as StatusColor } from '@atlaskit/status/element';
import type NativeToWebBridge from './bridge';
import WebBridge from '../../web-bridge';
import type { DeferredValue } from '../../utils';
import { createDeferred } from '../../utils';
import { rejectPromise, resolvePromise } from '../../cross-platform-promise';
import { assertSelectionPayload } from '../../validation';
import { CollabSocket } from './collab-socket';
import type { Socket } from '@atlaskit/collab-provider/types';
import { LifecycleImpl } from './lifecycle';
import type { allowListPayloadType } from '../event-dispatch';
import { BridgeEventEmitter, EventTypes } from '../event-dispatch';
import type { Provider as CollabProvider } from '@atlaskit/collab-provider';
import { toNativeBridge } from '../web-to-native';
import MobileEditorConfiguration from '../editor-configuration';
import type { JSONDocNode } from '@atlaskit/editor-json-transformer';
import {
	measureContentRenderedPerformance,
	PerformanceMatrices,
	isContentEmpty,
} from '../../utils/bridge';
import MobileEditorToolbarActions from '../mobile-editor-toolbar';
import { trackFontSizeUpdated } from '../track-analytics';
import type {
	MobileUpload,
	MobileUploadStartEvent,
	MobileUploadProgressEvent,
	MobileUploadEndEvent,
	MobileUploadErrorEvent,
} from '@atlaskit/media-client';
import type { UploadPreviewUpdateEventPayload } from '@atlaskit/media-picker/types';
import type NativeBridge from '../web-to-native/bridge';
import type { mobileApiPlugin } from '../plugins/mobileApiPlugin';

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

export const ModuleNameInExceptionMessage = 'editor implementations';

type Command = (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean;
export type EditorConfigChange = (config: MobileEditorConfiguration) => void;

const closeTypeAheadAndRunCommand =
	(
		editorView: EditorView | undefined,
		api: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
	) =>
	(command: Command) => {
		if (!editorView) {
			return;
		}

		const isTypeAheadOpen = api?.typeAhead?.actions?.isOpen(editorView.state);

		if (isTypeAheadOpen) {
			api?.typeAhead?.actions?.close({
				attachCommand: command,
				insertCurrentQueryAsRawText: false,
			});
		} else {
			command(editorView.state, editorView.dispatch);
		}
	};

const closeTypeAheadAndUndo = (
	editorView: EditorView | undefined,
	api: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
) => {
	return closeTypeAheadAndRunCommand(editorView, api)(pmHistoryUndo);
};
const closeTypeAheadAndRedo = (
	editorView: EditorView | undefined,
	api: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
) => {
	return closeTypeAheadAndRunCommand(editorView, api)(pmHistoryRedo);
};

export default class WebBridgeImpl extends WebBridge implements NativeToWebBridge {
	textFormatBridgeState: TextFormattingState | null = null;
	statusBridgeState: StatusState | null = null;
	blockFormatBridgeState: BlockTypeState | null = null;
	listBridgeState: ListState | null = null;
	editorView?: EditorViewWithComposition;
	transformer: JSONTransformer = new JSONTransformer();
	editorActions: EditorActions = new EditorActions();
	mediaPicker: CustomMediaPicker | undefined;
	mediaMap: Map<string, Function> = new Map();
	quickInsertItems: DeferredValue<QuickInsertItem[]> = createDeferred<QuickInsertItem[]>();
	collabSocket: CollabSocket | null = null;
	lifecycle: LifecycleImpl = new LifecycleImpl();
	eventEmitter: BridgeEventEmitter = new BridgeEventEmitter();
	allowList: allowListPayloadType = new Set(defaultSetList);
	mobileEditingToolbarActions = new MobileEditorToolbarActions();
	media: MediaBridge = new MediaBridge(this, toNativeBridge);

	private collabProviderPromise: Promise<CollabProvider> | undefined;

	private onEditorConfigChanged: EditorConfigChange | null;
	private editorConfiguration: MobileEditorConfiguration;
	private resetProviders: () => void = () => {};
	private featureFlags: FeatureFlags = {};
	private storedContent: string | undefined;
	private pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined = undefined;

	constructor(config?: MobileEditorConfiguration) {
		super();
		this.editorConfiguration = config || new MobileEditorConfiguration();
		this.onEditorConfigChanged = null;
	}

	setFeatureFlags(featureFlags: FeatureFlags) {
		this.featureFlags = featureFlags;
	}

	setPluginInjectionApi(
		pluginInjectionApi: ExtractInjectionAPI<typeof mobileApiPlugin> | undefined,
	) {
		this.pluginInjectionApi = pluginInjectionApi;
	}

	getPluginInjectionApi(): ExtractInjectionAPI<typeof mobileApiPlugin> | undefined {
		return this.pluginInjectionApi;
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

	setResetProviders(resetProviders: () => void) {
		this.resetProviders = resetProviders;
	}

	setCollabProviderPromise(collabProviderPromise: Promise<CollabProvider> | undefined) {
		this.collabProviderPromise = collabProviderPromise;
	}

	async fetchPayload<T = unknown>(category: string, uuid: string): Promise<T> {
		var originURL = new URL(window.location.href);
		originURL.protocol = `fabric-hybrid`;
		const payloadURL = originURL.origin + `/payload/${category}/${uuid}`;
		const response = await fetch(payloadURL);
		return response.json();
	}

	setPadding(top: number = 0, right: number = 0, bottom: number = 0, left: number = 0) {
		super.setPadding(top, right, bottom, left);
		/**
		 * We need to dispatch an action to save this value on the mobileDimensions plugin,
		 * so that it can be used in `ClickAreaMobile` to calculate css rules properly.
		 */
		if (this.editorView) {
			setMobilePaddingTop(top)(this.editorView.state, this.editorView.dispatch);
		}
	}

	onBoldClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleStrong(inputMethod),
			);
		}
	}

	onItalicClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleEm(inputMethod),
			);
		}
	}

	onUnderlineClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleUnderline(inputMethod),
			);
		}
	}

	onCodeClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleCode(inputMethod),
			);
		}
	}

	onStrikeClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleStrike(inputMethod),
			);
		}
	}

	onSuperClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleSuperscript(inputMethod),
			);
		}
	}

	onSubClicked(inputMethod: TextFormattingInputMethodBasic = INPUT_METHOD.TOOLBAR) {
		if (this.textFormatBridgeState) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.textFormatting?.commands.toggleSubscript(inputMethod),
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
			this.pluginInjectionApi?.status?.actions.updateStatus(inputMethod, {
				text,
				color,
				localId: uuid,
			})(this.editorView.state, this.editorView.dispatch);
		}
	}

	onStatusPickerDismissed() {
		if (this.statusBridgeState && this.editorView) {
			this.pluginInjectionApi?.status?.actions.commitStatusPicker()(this.editorView);
		}
	}

	setClickAreaExpanded(isExpanded: boolean) {
		if (this.editorView) {
			setIsExpanded(isExpanded)(this.editorView.state, this.editorView.dispatch);
		}
	}

	setContent(content: string) {
		this.storedContent = content;
		this.replaceContent(content);
	}

	async setContentPayload(uuid: string) {
		const content = await this.fetchPayload('content', uuid);
		this.storedContent = content as string;
		this.replaceContent(content);
	}

	restoreContent() {
		if (!!this.storedContent) {
			this.replaceContent(this.storedContent);
		}
	}

	replaceContent(content: any) {
		const performanceMatrices = new PerformanceMatrices();
		if (!this.editorActions) {
			return;
		}

		this.resetProviders();
		// Using requestAnimationFrame prevents a race condition between this function
		// and this code in ProseMirror View:
		// https://github.com/ProseMirror/prosemirror-view/commit/681157dac411f8c062996132d74a16ca52e904ed
		requestAnimationFrame(() => {
			const isReplaced = this.editorActions.replaceDocument(content, false);

			const padding = this.getPadding();
			this.setPadding(padding.top, padding.right, padding.bottom, padding.left);
			toNativeBridge.stateChanged(false, false);
			if (!isReplaced) {
				return;
			}

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
		});
	}

	clearContent() {
		this.storedContent = undefined;

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
			this.pluginInjectionApi?.textColor?.actions.changeColor(color)(
				this.editorView.state,
				this.editorView.dispatch,
			);
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
		} catch (err: any) {
			err.message = `${err.message}. Payload: ${JSON.stringify(payload)}`;
			rejectPromise(uuid, err);
		}
	}

	async onPromiseResolvedPayload(uuid: string) {
		try {
			const payload = await this.fetchPayload('promise', uuid);
			resolvePromise(uuid, payload);
		} catch (err: any) {
			err.message = `${err.message}.`;
			rejectPromise(uuid, err);
		}
	}

	onPromiseRejected(uuid: string, err?: Error) {
		rejectPromise(uuid, err);
	}

	onBlockSelected(blockType: string, inputMethod: BlockTypeInputMethod = INPUT_METHOD.INSERT_MENU) {
		if (this.editorView) {
			this.pluginInjectionApi?.core?.actions.execute(
				this.pluginInjectionApi?.blockType?.commands.setTextLevel(
					blockType as TextBlockTypes,
					inputMethod,
				),
			);
		}
	}

	onOrderedListSelected(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
		this.pluginInjectionApi?.core?.actions.execute(
			this.pluginInjectionApi?.list?.commands?.toggleOrderedList(inputMethod),
		);
	}

	onBulletListSelected(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
		this.pluginInjectionApi?.core?.actions.execute(
			this.pluginInjectionApi?.list?.commands?.toggleBulletList(inputMethod),
		);
	}

	onIndentList(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
		this.pluginInjectionApi?.core?.actions.execute(
			this.pluginInjectionApi?.list?.commands?.indentList(inputMethod),
		);
	}

	onOutdentList(inputMethod: ListInputMethod = INPUT_METHOD.TOOLBAR) {
		this.pluginInjectionApi?.core?.actions.execute(
			this.pluginInjectionApi?.list?.commands?.outdentList(inputMethod),
		);
	}

	onLinkUpdate(text: string, url: string, inputMethod: LinkInputMethod = INPUT_METHOD.MANUAL) {
		if (!this.editorView) {
			return;
		}

		const { state, dispatch } = this.editorView;
		const { from, to } = state.selection;

		// Inserting a new link on a block node or with no selection
		if ((!isLinkAtPos(from)(state) && from === to) || !isTextAtPos(from)(state)) {
			this.pluginInjectionApi?.hyperlink?.actions.insertLink(
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

		return this.pluginInjectionApi?.hyperlink?.actions.updateLink(
			url,
			text || url,
			leftBound,
			rightBound,
		)(state, dispatch);
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
				this.pluginInjectionApi?.blockType?.actions.insertBlockQuote(inputMethod)(state, dispatch);
				return;
			case 'codeblock':
				this.pluginInjectionApi?.codeBlock?.actions.insertCodeBlock(inputMethod)(state, dispatch);
				return;
			case 'panel':
				this.pluginInjectionApi?.panel?.actions.insertPanel(inputMethod)(state, dispatch);
				return;
			case 'action':
				this.pluginInjectionApi?.taskDecision?.actions.insertTaskDecision(
					'taskList',
					inputMethod as InsertBlockInputMethodToolbar,
					undefined,
					listLocalId,
					itemLocalId,
				)(state, dispatch);
				return;
			case 'decision':
				this.pluginInjectionApi?.taskDecision?.actions.insertTaskDecision(
					'decisionList',
					inputMethod as InsertBlockInputMethodToolbar,
					undefined,
					listLocalId,
					itemLocalId,
				)(state, dispatch);
				return;
			case 'divider':
				this.pluginInjectionApi?.rule?.actions.insertHorizontalRule(
					inputMethod as InsertBlockInputMethodToolbar,
				)(state, dispatch);
				return;
			case 'expand':
				this.pluginInjectionApi?.expand?.actions.insertExpand(state, dispatch);
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

		this.pluginInjectionApi?.mention?.actions.openTypeAhead(INPUT_METHOD.TOOLBAR);
	}

	insertEmojiQuery() {
		if (!this.editorView) {
			return;
		}
		this.pluginInjectionApi?.emoji?.actions.openTypeAhead(INPUT_METHOD.TOOLBAR);
	}

	insertTypeAheadItem(type: 'mention' | 'emoji' | 'quickinsert', payload: string) {
		if (!this.editorView) {
			return;
		}

		if (!['quickinsert', 'mention', 'emoji'].includes(type)) {
			return;
		}

		const enableQuickInsert = this.editorConfiguration.isQuickInsertEnabled();
		this.flushDOM();

		const parsedPayload: TypeAheadItem = JSON.parse(payload);

		let handler: TypeAheadHandler | undefined;
		const api = this.pluginInjectionApi;

		switch (type) {
			case 'mention':
				handler = api?.mention?.sharedState.currentState()?.typeAheadHandler;
				break;
			case 'emoji':
				handler = api?.emoji?.sharedState.currentState()?.typeAheadHandler;
				break;
			case 'quickinsert':
				handler = api?.quickInsert?.sharedState.currentState()?.typeAheadHandler;
				break;
		}

		if (!handler) {
			return;
		}

		const query = api?.typeAhead?.sharedState.currentState()?.query || '';

		if (['mention', 'emoji'].includes(type)) {
			api?.typeAhead?.actions?.insert({
				triggerHandler: handler,
				query,
				sourceListItem: [],
				contentItem: {
					...parsedPayload,
					[type]: parsedPayload,
				},
			});

			return;
		}

		if (!enableQuickInsert) {
			return;
		}
		const index = parseInt(parsedPayload.index, 10);
		if (!Number.isInteger(index)) {
			return;
		}

		const quickInsertList = this.pluginInjectionApi?.quickInsert?.actions.getSuggestions({
			query,
			disableDefaultItems: true,
		});
		const quickInsertItem = quickInsertList?.[index];

		if (!quickInsertItem) {
			return;
		}
		api?.typeAhead?.actions?.insert({
			triggerHandler: handler,
			query,
			sourceListItem: quickInsertList,
			contentItem: quickInsertItem,
		});
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

	setSelectionAtAnchor(anchor: 'start' | 'end') {
		if (!this.editorView) {
			return false;
		}
		let selection;
		let position = 0;
		let tr = this.editorView.state.tr;
		const { state } = this.editorView;
		if (anchor === 'start') {
			selection = Selection.atStart;
		} else {
			selection = Selection.atEnd;
			position = state.doc.content.size;
		}

		tr = tr.setSelection(selection(tr.doc));

		const { $from } = tr.selection;
		const wrapperItem = tr.doc.nodeAt($from.before(Math.min($from.depth, 1)));

		if (wrapperItem?.type.name !== 'paragraph') {
			const newParagraph = state.schema.nodes.paragraph.createAndFill();
			if (newParagraph) {
				tr = tr.insert(position, newParagraph);
			}
			tr = tr.setSelection(selection(tr.doc));
		}

		this.editorView.dispatch(tr);
	}

	scrollToSelection(): void {
		if (!this.editorView) {
			return;
		}

		this.editorView.dispatch(this.editorView.state.tr.scrollIntoView());
	}

	undo() {
		closeTypeAheadAndUndo(this.editorView, this.pluginInjectionApi);
	}

	redo() {
		closeTypeAheadAndRedo(this.editorView, this.pluginInjectionApi);
	}

	setKeyboardControlsHeight(height: string) {
		if (this.editorView) {
			this.pluginInjectionApi?.base?.actions?.setKeyboardHeight(+height)(
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
			? (rootElement.querySelector('[contenteditable="true"]') as HTMLElement | null)
			: null;
		const needsFocus = previousFocus !== editableElement;

		if (editableElement && needsFocus) {
			editableElement.focus();
		}

		const {
			state: { tr, doc },
			dispatch,
		} = this.editorView;

		dispatch(tr.setSelection(Selection.fromJSON(doc, result.data.selection)).scrollIntoView());
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

	/**
	 * We provide a 'setter' here this way because it's unclear what other
	 * things rely on the deferral mechanism
	 */
	setQuickInsertItems(items: QuickInsertItem[]) {
		const promise = createDeferred<QuickInsertItem[]>();
		promise.resolve(items);
		this.quickInsertItems = promise;
	}

	addQuickInsertAllowListItem(listItems: Serialized<QuickInsertItemId>): void {
		const newItems = JSON.parse(listItems);
		newItems.forEach((item: QuickInsertItemId) => this.allowList.add(item));
		this.eventEmitter.emit(EventTypes.ADD_NEW_ALLOWED_INSERT_LIST_ITEM, this.allowList);
	}

	removeQuickInsertAllowListItem(listItems: Serialized<QuickInsertItemId>): void {
		const removeItems = JSON.parse(listItems);
		removeItems.forEach((item: QuickInsertItemId) => this.allowList.delete(item));
		this.eventEmitter.emit(EventTypes.REMOVE_ALLOWED_INSERT_LIST_ITEM, this.allowList);
	}

	/**
	 * Used to observe the height of the rendered content and notify the native side when that happens
	 * by calling RendererBridge#onRenderedContentHeightChanged.
	 *
	 * @param enabled whether the height is being observed (and therefore the callback is being called).
	 */
	observeRenderedContentHeight(enabled: boolean) {
		this.eventEmitter.emit(EventTypes.SET_DOCUMENT_REFLOW_DETECTOR_STATUS, enabled);
	}

	setTitle(title: string) {
		if (this.collabProviderPromise) {
			this.collabProviderPromise.then((collabProvider) => collabProvider.setTitle(title, true));
		}
	}

	cancelTypeAhead() {
		if (!this.editorView) {
			return;
		}

		this.pluginInjectionApi?.typeAhead?.actions?.close({
			insertCurrentQueryAsRawText: true,
		});
	}

	configure(config: string) {
		if (!this.onEditorConfigChanged) {
			return;
		}

		const updatedConfig = this.editorConfiguration.cloneAndUpdateConfig(config);
		this.onEditorConfigChanged(updatedConfig);

		/**
		 * Reloads the Editor/ProseMirror states to work with new props passed in.
		 * This ensures that schemas and plugins are initialised correctly.
		 *
		 * Note: side effect is cursor position changes to start of document.
		 */
		this.editorActions.getValue().then((value) => {
			// To prevent unexpected cursor jumping, we need to save current cursor position
			// and restore it afterwards
			const currentSelectionPos = this.editorView?.state.selection.$anchor.pos;
			const replacedDocument = this.editorActions.replaceDocument(value);
			if (replacedDocument) {
				// restore previous cursor position
				if (this.editorView && currentSelectionPos) {
					let tr = this.editorView.state.tr;
					tr = tr.setSelection(TextSelection.create(tr.doc, currentSelectionPos));
					this.editorView.dispatch(tr);
				}
			}
		});
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
		this.editorActions._privateRegisterEditor(
			editorView,
			eventDispatcher,
			undefined,
			this.getFeatureFlags,
		);
	}

	private getFeatureFlags = () => {
		return this.featureFlags;
	};

	unregisterEditor() {
		delete this.editorView;
		this.editorActions._privateUnregisterEditor();
	}

	performEditAction(key: string, value: string | null = null) {
		if (this.editorView) {
			this.mobileEditingToolbarActions.performEditAction(key, this.editorView, value);
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

	updateStatus(status: StatusType) {
		if (!this.editorView) {
			return;
		}
		return this.pluginInjectionApi?.status?.actions.updateStatus(INPUT_METHOD.TOOLBAR, status)(
			this.editorView.state,
			this.editorView.dispatch,
		);
	}

	removeStatus(showStatusPickerAt: number) {
		return this.pluginInjectionApi?.core?.actions.execute(
			this.pluginInjectionApi?.status?.commands.removeStatus(showStatusPickerAt),
		);
	}

	/**
	 * Inserts a node in the Hybrid Editor.
	 * Most node types are implemented on web, and we can use their implementation here.
	 * We only need to create a transaction for a node if it doesn't exist already.
	 * @param nodeType is the node we are inserting in the editor.
	 */
	insertNode(nodeType: string) {
		switch (nodeType) {
			case 'status':
				const status = {
					text: '',
					color: 'neutral',
				} as StatusType;

				this.updateStatus(status);
				break;
			case 'date':
				const dateType = dateToDateType(new Date());

				if (!this.editorView || !this.pluginInjectionApi?.date?.commands?.insertDate) {
					return;
				}

				this.pluginInjectionApi.core?.actions?.execute(
					this.pluginInjectionApi.date.commands.insertDate({
						date: dateType,
						inputMethod: INPUT_METHOD.TOOLBAR,
						commitMethod: INPUT_METHOD.PICKER,
					}),
				);

				break;
			default:
				break;
		}
	}

	getStepVersion() {
		if (!this.collabProviderPromise) {
			return toNativeBridge.updateStepVersion(undefined, 'Collaborative edit is not enabled');
		}

		this.collabProviderPromise?.then(async (provider) => {
			try {
				const state = await provider.getFinalAcknowledgedState();
				toNativeBridge.updateStepVersion(state.stepVersion);
			} catch (error) {
				toNativeBridge.updateStepVersion(
					undefined,
					error instanceof Error ? error.message : String(error),
				);
			}
		});
	}

	shiftSelectionToNextPosition() {
		if (!this.editorView) {
			return;
		}

		const {
			state: { tr },
			dispatch,
		} = this.editorView;

		dispatch(tr.setSelection(Selection.near(tr.doc.resolve(tr.selection.to + 1))).scrollIntoView());
	}

	hasVisibleContent(): boolean {
		return this.editorView?.state?.doc ? hasVisibleContent(this.editorView.state.doc) : false;
	}
}

export class MediaBridge {
	mediaPicker: CustomMediaPicker | undefined;
	mediaUpload: Promise<MobileUpload | undefined> | undefined;
	webBridge: NativeToWebBridge | undefined;
	nativeBridge: NativeBridge | undefined;

	constructor(webBridge: NativeToWebBridge, nativeBridge: NativeBridge) {
		this.webBridge = webBridge;
		this.nativeBridge = nativeBridge;
	}

	async onUploadStart(payload: string) {
		try {
			if (!this.mediaUpload || !this.mediaPicker) {
				throw new Error('mediaUpload or mediaPicker is null in ' + ModuleNameInExceptionMessage);
			}
			const uploader = await this.mediaUpload;
			if (!uploader) {
				throw new Error('uploader is null in ' + ModuleNameInExceptionMessage);
			}
			const startEvent: MobileUploadStartEvent = JSON.parse(payload);
			const width = startEvent.preview?.originalDimensions?.width ?? 100;
			const height = startEvent.preview?.originalDimensions?.height ?? 100;

			if (!startEvent.preview?.value) {
				// If there is no preview content, we keep the dimensions if there are and clean the preview object
				// Otherwise uploader will not fetch the server preview
				startEvent.preview = undefined;
			} else {
				if (
					'string' !== typeof startEvent.preview?.value ||
					!startEvent.preview.value.startsWith('data:')
				) {
					// TODO nofatal exception, silent log
					startEvent.preview = undefined;
				}
			}

			uploader.notifyUploadStart(startEvent);

			const pickerPayload: UploadPreviewUpdateEventPayload = {
				file: {
					id: startEvent.fileId,
					name: startEvent.fileName,
					type: startEvent.fileMimetype,
					size: startEvent.fileSize,
					occurrenceKey: startEvent.occurrenceKey,
					creationDate: startEvent.createdAt ?? Date.now(),
					collectionName: startEvent.collectionName,
				},
				preview: {
					dimensions: {
						width,
						height,
					},
					scaleFactor: window.devicePixelRatio,
				},
			};

			this.mediaPicker.emit('upload-preview-update', pickerPayload);
		} catch (e) {
			// TODO exception in top level interface, error reporting
		}
	}

	async onUploadProgress(payload: string) {
		try {
			if (!this.mediaUpload) {
				throw new Error('mediaUpload is null in ' + ModuleNameInExceptionMessage);
			}
			const progressEvent: MobileUploadProgressEvent = JSON.parse(payload);
			const uploader = await this.mediaUpload;
			if (!uploader) {
				throw new Error('uploader is null in ' + ModuleNameInExceptionMessage);
			}
			uploader.notifyUploadProgress(progressEvent);
		} catch (e) {
			// TODO exception in top level interface, error reporting
		}
	}

	async onUploadEnd(payload: string) {
		try {
			if (!this.mediaUpload || !this.webBridge || !this.nativeBridge) {
				throw new Error(
					'Required instance variable (mediaUpload || webBridge || nativeBridge) is null in ' +
						ModuleNameInExceptionMessage,
				);
			}
			const endEvent: MobileUploadEndEvent = JSON.parse(payload);
			const uploader = await this.mediaUpload;
			if (!uploader) {
				throw new Error('uploader is null in ' + ModuleNameInExceptionMessage);
			}
			uploader.notifyUploadEnd(endEvent);

			// In `onUploadStart` we call `updateTextWithADFStatus` as a side-effect of `mediaPicker.emit()`
			// Manually call it here to fix Publish / Submit button issue in https://product-fabric.atlassian.net/browse/MEX-2352
			this.nativeBridge.updateTextWithADFStatus(
				this.webBridge.getContent(),
				!this.webBridge.hasVisibleContent(),
			);
		} catch (e) {
			// TODO exception in top level interface, error reporting
		}
	}

	async onUploadFail(payload: string) {
		try {
			// TODO exception in top level interface, error reporting
			if (!this.mediaUpload || !this.webBridge || !this.nativeBridge) {
				throw new Error(
					'Required instance variable (mediaUpload || webBridge || nativeBridge) is null in ' +
						ModuleNameInExceptionMessage,
				);
			}
			const failEvent: MobileUploadErrorEvent = JSON.parse(payload);
			const uploader = await this.mediaUpload;
			if (!uploader) {
				throw new Error('uploader is null in ' + ModuleNameInExceptionMessage);
			}
			uploader.notifyUploadError(failEvent);

			// In `onUploadStart` we call `updateTextWithADFStatus` as a side-effect of `mediaPicker.emit()`
			// Manually call it here to fix Publish / Submit button issue in https://product-fabric.atlassian.net/browse/MEX-2352
			this.nativeBridge.updateTextWithADFStatus(
				this.webBridge.getContent(),
				!this.webBridge.hasVisibleContent(),
			);
		} catch (e) {
			// TODO exception in top level interface, error reporting
		}
	}
}
