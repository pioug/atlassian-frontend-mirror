import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { SelectItemMode, TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
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
	triggerHandler: TypeAheadHandler;
	editorView: EditorView;
	anchorElement: HTMLElement;
	getDecorationPosition: () => number | undefined;
	shouldFocusCursorInsideQuery: boolean;
	onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
	reopenQuery?: string;
	popupsMountPoint?: HTMLElement;
	popupsBoundariesElement?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	inputMethod?: TypeAheadInputMethod;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
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
	}: WrapperProps) => {
		// @ts-ignore
		const openElementBrowserModal = triggerHandler?.openElementBrowserModal;
		const showViewMore =
			triggerHandler?.id === TypeAheadAvailableNodes.QUICK_INSERT &&
			!!openElementBrowserModal &&
			editorExperiment('platform_editor_controls', 'variant1');

		const [closed, setClosed] = useState(false);
		const [query, setQuery] = useState<string>(reopenQuery || '');
		const queryRef = useRef(query);
		const editorViewRef = useRef(editorView);
		const items = useLoadItems(triggerHandler, editorView, query, showViewMore);

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
				setSelectionAt: CloseSelectionOptions;
				addPrefixTrigger: boolean;
				text: string;
				forceFocusOnEditor: boolean;
			}) => {
				if (
					editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_controls_patch_4')
				) {
					fireTypeAheadClosedAnalyticsEvent(
						api,
						ACTION.CANCELLED,
						!!queryRef.current,
						INPUT_METHOD.KEYBOARD,
					);
				}
				setClosed(true);

				const fullquery = addPrefixTrigger ? `${triggerHandler.trigger}${text}` : text;
				onTextInsert({ forceFocusOnEditor, setSelectionAt, text: fullquery });
			},
			[api, triggerHandler.trigger, onTextInsert],
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
				if (
					editorExperiment('platform_editor_controls', 'variant1') &&
					fg('platform_editor_controls_patch_4')
				) {
					fireTypeAheadClosedAnalyticsEvent(
						api,
						ACTION.INSERTED,
						!!queryRef.current,
						INPUT_METHOD.KEYBOARD,
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
			[onItemInsert, api, items],
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
