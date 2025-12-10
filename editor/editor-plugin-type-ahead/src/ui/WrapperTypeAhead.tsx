import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { fireTypeAheadClosedAnalyticsEvent } from '../pm-plugins/analytics';
import { updateQuery } from '../pm-plugins/commands/update-query';
import type { CloseSelectionOptions } from '../pm-plugins/constants';
import { itemIsDisabled } from '../pm-plugins/item-is-disabled';
import { getPluginState, moveSelectedIndex, skipForwardToSafeItem } from '../pm-plugins/utils';
import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { TypeAheadHandler, TypeAheadInputMethod } from '../types';

import { useItemInsert } from './hooks/use-item-insert';
import { useLoadItems } from './hooks/use-load-items';
import { useOnForceSelect } from './hooks/use-on-force-select';
import { InputQuery } from './InputQuery';

type WrapperProps = {
	anchorElement: HTMLElement;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	editorView: EditorView;
	getDecorationPosition: () => number | undefined;
	inputMethod?: TypeAheadInputMethod;
	onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	reopenQuery?: string;
	shouldFocusCursorInsideQuery: boolean;
	triggerHandler: TypeAheadHandler;
};

export const WrapperTypeAhead = React.memo(
	({
		triggerHandler,
		editorView,
		anchorElement,
		shouldFocusCursorInsideQuery,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
		inputMethod,
		getDecorationPosition,
		reopenQuery,
		onUndoRedo,
		api,
	}: WrapperProps): React.JSX.Element | null => {
		// @ts-ignore
		const openElementBrowserModal = triggerHandler?.openElementBrowserModal;
		let showMoreOptionsButton = false;
		if (editorExperiment('platform_editor_controls', 'variant1')) {
			showMoreOptionsButton = !!triggerHandler?.getMoreOptionsButtonConfig;
		}

		const [closed, setClosed] = useState(false);
		const [query, setQuery] = useState<string>(reopenQuery || '');
		const queryRef = useRef(query);
		const editorViewRef = useRef(editorView);
		const items = useLoadItems(triggerHandler, editorView, query, showMoreOptionsButton, api);

		useEffect(() => {
			if (!closed && fg('platform_editor_ease_of_use_metrics')) {
				api?.core.actions.execute(
					api?.metrics?.commands.handleIntentToStartEdit({
						shouldStartTimer: false,
						shouldPersistActiveSession: true,
					}),
				);
			}
		}, [closed, api]);

		useLayoutEffect(() => {
			queryRef.current = query;
		}, [query]);

		const [onItemInsert, onTextInsert] = useItemInsert(triggerHandler, editorView, items, api);

		const selectNextItem = useMemo(
			() =>
				moveSelectedIndex({
					editorView,
					direction: 'next',
					api,
				}),
			[editorView, api],
		);
		const selectPreviousItem = useMemo(
			() =>
				moveSelectedIndex({
					editorView,
					direction: 'previous',
					api,
				}),
			[editorView, api],
		);

		const cancel = useCallback(
			({
				setSelectionAt,
				addPrefixTrigger,
				text,
				forceFocusOnEditor,
			}: {
				addPrefixTrigger: boolean;
				forceFocusOnEditor: boolean;
				setSelectionAt: CloseSelectionOptions;
				text: string;
			}) => {
				if (editorExperiment('platform_editor_controls', 'variant1')) {
					fireTypeAheadClosedAnalyticsEvent(
						api,
						ACTION.CANCELLED,
						!!queryRef.current,
						INPUT_METHOD.KEYBOARD,
						getPluginState(editorView.state)?.inputMethod,
					);
				}
				setClosed(true);

				const fullquery = addPrefixTrigger ? `${triggerHandler.trigger}${text}` : text;
				onTextInsert({ forceFocusOnEditor, setSelectionAt, text: fullquery });
			},
			[triggerHandler.trigger, onTextInsert, api, editorView.state],
		);

		const insertSelectedItem = useCallback(
			(mode: SelectItemMode = SelectItemMode.SELECTED) => {
				const { current: view } = editorViewRef;

				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const { selectedIndex } = getPluginState(view.state)!;
				const safeSelectedIndex = skipForwardToSafeItem({
					currentIndex: selectedIndex,
					nextIndex: 1,
					listSize: items.length,
					itemIsDisabled: (idx) => itemIsDisabled(items[idx], api),
				});
				// If the only safe index is -1 then none are safe - do not insert item
				if (safeSelectedIndex === -1) {
					return;
				}
				if (editorExperiment('platform_editor_controls', 'variant1')) {
					fireTypeAheadClosedAnalyticsEvent(
						api,
						ACTION.INSERTED,
						!!queryRef.current,
						INPUT_METHOD.KEYBOARD,
						getPluginState(editorView.state)?.inputMethod,
					);
				}

				setClosed(true);
				queueMicrotask(() => {
					onItemInsert({
						mode,
						index: selectedIndex,
						query: queryRef.current,
					});
				});
			},
			[items, api, editorView.state, onItemInsert],
		);

		const showTypeAheadPopupList = useCallback(() => {}, []);
		const closePopup = useCallback(() => {
			setClosed(true);
		}, []);

		useEffect(() => {
			const { current: view } = editorViewRef;
			const pluginState = getPluginState(view.state);

			if (query.length === 0 || query === pluginState?.query || !pluginState?.triggerHandler) {
				return;
			}

			updateQuery(query)(view.state, view.dispatch);
		}, [query, reopenQuery]);

		useOnForceSelect({
			triggerHandler,
			items,
			query,
			editorView,
			closePopup,
		});

		if (closed) {
			return null;
		}

		if (!triggerHandler) {
			return null;
		}

		return (
			<InputQuery
				triggerQueryPrefix={triggerHandler?.trigger}
				onQueryChange={setQuery}
				onItemSelect={insertSelectedItem}
				selectNextItem={selectNextItem}
				selectPreviousItem={selectPreviousItem}
				onQueryFocus={showTypeAheadPopupList}
				cancel={cancel}
				forceFocus={shouldFocusCursorInsideQuery}
				onUndoRedo={onUndoRedo}
				reopenQuery={reopenQuery}
				editorView={editorView}
				items={items}
			/>
		);
	},
);

WrapperTypeAhead.displayName = 'WrapperTypeAhead';
