/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
import React from 'react';

import { typeAheadQuery } from '@atlaskit/adf-schema';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { SelectItemMode, TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { Command, TypeAheadItem } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import { closeTypeAhead } from './pm-plugins/commands/close-type-ahead';
import { insertTypeAheadItem } from './pm-plugins/commands/insert-type-ahead-item';
import { openTypeAheadAtCursor } from './pm-plugins/commands/open-typeahead-at-cursor';
import { inputRulePlugin } from './pm-plugins/input-rules';
import { createPlugin as createInsertItemPlugin } from './pm-plugins/insert-item-plugin';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { createPlugin } from './pm-plugins/main';
import { StatsModifier } from './pm-plugins/stats-modifier';
import {
	findHandler,
	getPluginState,
	getTypeAheadHandler,
	getTypeAheadQuery,
	isTypeAheadAllowed,
	isTypeAheadOpen,
} from './pm-plugins/utils';
import { type TypeAheadPlugin } from './typeAheadPluginType';
import type { OpenTypeAheadProps, PopupMountPointReference, TypeAheadHandler } from './types';
import { ContentComponent } from './ui/ContentComponent';

const createOpenAtTransaction =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(props: OpenTypeAheadProps) =>
	(tr: Transaction): boolean => {
		const { triggerHandler, inputMethod, query, removePrefixTriggerOnCancel } = props;

		openTypeAheadAtCursor({ triggerHandler, inputMethod, query, removePrefixTriggerOnCancel })({
			tr,
		});

		editorAnalyticsAPI?.attachAnalyticsEvent({
			action: ACTION.INVOKED,
			actionSubject: ACTION_SUBJECT.TYPEAHEAD,
			actionSubjectId: triggerHandler.id,
			attributes: { inputMethod },
			eventType: EVENT_TYPE.UI,
		})(tr);

		return true;
	};

type EditorViewRef = Record<'current', EditorView | null>;

const createOpenTypeAhead =
	(editorViewRef: EditorViewRef, editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(props: OpenTypeAheadProps): boolean => {
		if (!editorViewRef.current) {
			return false;
		}

		const { current: view } = editorViewRef;
		const { tr } = view.state;

		createOpenAtTransaction(editorAnalyticsAPI)(props)(tr);

		view.dispatch(tr);

		return true;
	};

type InsertTypeAheadItemProps = {
	triggerHandler: TypeAheadHandler;
	contentItem: TypeAheadItem;
	query: string;
	sourceListItem: TypeAheadItem[];
	mode?: SelectItemMode;
};
const createInsertTypeAheadItem =
	(editorViewRef: EditorViewRef) =>
	(props: InsertTypeAheadItemProps): boolean => {
		if (!editorViewRef.current) {
			return false;
		}

		const { current: view } = editorViewRef;
		const { triggerHandler, contentItem, query, sourceListItem, mode } = props;

		insertTypeAheadItem(view)({
			handler: triggerHandler,
			item: contentItem,
			mode: mode || SelectItemMode.SELECTED,
			query,
			sourceListItem,
		});

		return true;
	};

const createFindHandlerByTrigger =
	(editorViewRef: EditorViewRef) =>
	(trigger: string): TypeAheadHandler | null => {
		if (!editorViewRef.current) {
			return null;
		}

		const { current: view } = editorViewRef;

		return findHandler(trigger, view.state);
	};

type CloseTypeAheadProps = {
	insertCurrentQueryAsRawText: boolean;
	attachCommand?: Command;
};
const createCloseTypeAhead =
	(editorViewRef: EditorViewRef) =>
	(options: CloseTypeAheadProps): boolean => {
		if (!editorViewRef.current) {
			return false;
		}

		const { current: view } = editorViewRef;

		const currentQuery = getTypeAheadQuery(view.state) || '';
		const { state } = view;

		let tr = state.tr;

		if (options.attachCommand) {
			const fakeDispatch = (customTr: Transaction) => {
				tr = customTr;
			};

			options.attachCommand(state, fakeDispatch);
		}

		closeTypeAhead(tr);

		if (options.insertCurrentQueryAsRawText && currentQuery && currentQuery.length > 0) {
			const handler = getTypeAheadHandler(state);
			if (!handler) {
				return false;
			}
			const text = handler.trigger.concat(currentQuery);
			tr.replaceSelectionWith(state.schema.text(text));
		}

		view.dispatch(tr);

		if (!view.hasFocus()) {
			view.focus();
		}

		return true;
	};

/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
export const typeAheadPlugin: TypeAheadPlugin = ({ api }) => {
	const popupMountRef: PopupMountPointReference = {
		current: null,
	};
	const editorViewRef: EditorViewRef = { current: null };
	return {
		name: 'typeAhead',

		marks() {
			// We need to keep this to make sure
			// All documents with typeahead marks will be loaded normally
			return [{ name: 'typeAheadQuery', mark: typeAheadQuery }];
		},

		pmPlugins(typeAhead: Array<TypeAheadHandler> = []) {
			return [
				{
					name: 'typeAhead',
					plugin: ({ dispatch, getIntl, nodeViewPortalProviderAPI }) =>
						createPlugin({
							getIntl,
							popupMountRef,
							reactDispatch: dispatch,
							typeAheadHandlers: typeAhead,
							nodeViewPortalProviderAPI,
							api,
						}),
				},
				{
					name: 'typeAheadEditorViewRef',
					plugin: () => {
						return new SafePlugin({
							view(view) {
								editorViewRef.current = view;

								return {
									destroy() {
										editorViewRef.current = null;
									},
								};
							},
						});
					},
				},
				{
					name: 'typeAheadInsertItem',
					plugin: createInsertItemPlugin,
				},
				{
					name: 'typeAheadInputRule',
					plugin: ({ schema, featureFlags }) => inputRulePlugin(schema, typeAhead, featureFlags),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return {
					query: '',
					isOpen: false,
					isAllowed: false,
					currentHandler: undefined,
					decorationSet: DecorationSet.empty,
					decorationElement: null,
					triggerHandler: undefined,
					items: [],
					errorInfo: null,
					selectedIndex: 0,
				};
			}

			const isOpen = isTypeAheadOpen(editorState);
			const state = getPluginState(editorState);

			return {
				query: getTypeAheadQuery(editorState) || '',
				currentHandler: getTypeAheadHandler(editorState),
				isOpen,
				isAllowed: !isOpen,
				decorationSet: state?.decorationSet ?? DecorationSet.empty,
				decorationElement: state?.decorationElement ?? null,
				triggerHandler: state?.triggerHandler,
				items: state?.items ?? [],
				errorInfo: state?.errorInfo ?? null,
				selectedIndex: state?.selectedIndex ?? 0,
			};
		},
		actions: {
			isOpen: isTypeAheadOpen,
			isAllowed: isTypeAheadAllowed,
			open: createOpenTypeAhead(editorViewRef, api?.analytics?.actions),
			openAtTransaction: createOpenAtTransaction(api?.analytics?.actions),
			findHandlerByTrigger: createFindHandlerByTrigger(editorViewRef),
			insert: createInsertTypeAheadItem(editorViewRef),
			close: createCloseTypeAhead(editorViewRef),
		},

		contentComponent({
			editorView,
			containerElement,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			wrapperElement,
		}) {
			popupMountRef.current = {
				popupsMountPoint: popupsMountPoint || wrapperElement || undefined,
				popupsBoundariesElement,
				popupsScrollableElement: popupsScrollableElement || containerElement || undefined,
			};

			return <ContentComponent editorView={editorView} popupMountRef={popupMountRef} api={api} />;
		},

		onEditorViewStateUpdated({ originalTransaction, oldEditorState, newEditorState }) {
			const oldPluginState = getPluginState(oldEditorState);
			const newPluginState = getPluginState(newEditorState);

			if (!oldPluginState || !newPluginState) {
				return;
			}

			const { triggerHandler: oldTriggerHandler } = oldPluginState;
			const { triggerHandler: newTriggerHandler } = newPluginState;

			const isANewHandler = oldTriggerHandler !== newTriggerHandler;
			if (oldTriggerHandler?.dismiss && isANewHandler) {
				const typeAheadMessage = originalTransaction.getMeta(typeAheadPluginKey);
				const wasItemInserted = typeAheadMessage && typeAheadMessage.action === 'INSERT_RAW_QUERY';

				oldTriggerHandler.dismiss({
					editorState: newEditorState,
					query: oldPluginState.query,
					stats: (oldPluginState.stats || new StatsModifier()).serialize(),
					wasItemInserted,
				});
			}

			if (newTriggerHandler?.onOpen && isANewHandler) {
				if (fg('platform_editor_ease_of_use_metrics')) {
					api?.metrics?.commands.handleIntentToStartEdit({
						shouldStartTimer: false,
						shouldPersistActiveSession: true,
					});
				}
				newTriggerHandler.onOpen(newEditorState);
			}

			const oldIsOpen = isTypeAheadOpen(oldEditorState);
			const newIsOpen = isTypeAheadOpen(newEditorState);

			if (newTriggerHandler && isANewHandler) {
				// if the typeahead opens another typeahead via the quickInsert we do NOT want to fire this analytic event (mentions and emojis) as it is already being fired from editor-plugin-analytics
				const isDuplicateInvokedEvent =
					newPluginState.inputMethod === INPUT_METHOD.QUICK_INSERT &&
					Object.values(TypeAheadAvailableNodes).includes(
						newTriggerHandler.id as TypeAheadAvailableNodes,
					);

				if (!isDuplicateInvokedEvent) {
					api?.analytics?.actions?.fireAnalyticsEvent({
						action: ACTION.INVOKED,
						actionSubject: ACTION_SUBJECT.TYPEAHEAD,
						actionSubjectId: newTriggerHandler.id || 'not_set',
						attributes: {
							inputMethod: newPluginState.inputMethod || INPUT_METHOD.KEYBOARD,
						},
						eventType: EVENT_TYPE.UI,
					});
				}
			} else if (oldIsOpen && !newIsOpen && fg('platform_editor_ease_of_use_metrics')) {
				api?.core.actions.execute(api?.metrics?.commands.startActiveSessionTimer());
			}
		},
	};
};
