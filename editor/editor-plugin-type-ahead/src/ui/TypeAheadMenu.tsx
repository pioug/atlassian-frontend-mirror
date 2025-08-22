import React from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { updateSelectedIndex } from '../pm-plugins/commands/update-selected-index';
import type { CloseSelectionOptions } from '../pm-plugins/constants';
import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { PopupMountPointReference, TypeAheadPluginSharedState } from '../types';

import { useItemInsert } from './hooks/use-item-insert';
import { TypeAheadPopup } from './TypeAheadPopup';

type TypeAheadMenuType = {
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
	editorView: EditorView;
	popupMountRef: PopupMountPointReference;
	selectedIndex: number;
	typeAheadState: Omit<TypeAheadPluginSharedState, 'isOpen' | 'isAllowed' | 'selectedIndex'>;
};

export const TypeAheadMenu = React.memo(
	({ editorView, popupMountRef, typeAheadState, selectedIndex, api }: TypeAheadMenuType) => {
		const isOpen = typeAheadState.decorationSet.find().length > 0;
		const { triggerHandler, items, errorInfo, decorationElement, decorationSet, query } =
			typeAheadState;

		const [onItemInsert, onTextInsert, onItemMatch] = useItemInsert(
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			triggerHandler!,
			editorView,
			items,
			api,
		);
		const setSelectedItem = React.useCallback(
			({ index: nextIndex }: { index: number }) => {
				queueMicrotask(() => {
					updateSelectedIndex(nextIndex, api)(editorView.state, editorView.dispatch);
				});
			},
			[editorView, api],
		);
		const insertItem = React.useCallback(
			(mode: SelectItemMode = SelectItemMode.SELECTED, index: number) => {
				queueMicrotask(() => {
					onItemInsert({ mode, index, query });
				});
			},
			[onItemInsert, query],
		);

		const cancel = React.useCallback(
			({
				setSelectionAt,
				addPrefixTrigger,
				forceFocusOnEditor,
			}: {
				addPrefixTrigger: boolean;
				forceFocusOnEditor: boolean;
				setSelectionAt: CloseSelectionOptions;
			}) => {
				const fullQuery = addPrefixTrigger ? `${triggerHandler?.trigger}${query}` : query;
				onTextInsert({ forceFocusOnEditor, setSelectionAt, text: fullQuery });
			},
			[triggerHandler, onTextInsert, query],
		);

		React.useEffect(() => {
			if (!isOpen || !query) {
				return;
			}

			const isLastCharSpace = query[query.length - 1] === ' ';
			if (!isLastCharSpace) {
				return;
			}

			const result = onItemMatch({
				mode: SelectItemMode.SPACE,
				query: query.trim(),
			});

			if (!result) {
				return;
			}
		}, [isOpen, query, onItemMatch]);

		// @ts-ignore
		const openElementBrowserModal = triggerHandler?.openElementBrowserModal;
		let showMoreOptionsButton = false;
		if (editorExperiment('platform_editor_controls', 'variant1')) {
			showMoreOptionsButton = !!triggerHandler?.getMoreOptionsButtonConfig;
		}

		if (
			!isOpen ||
			!triggerHandler ||
			!(decorationElement instanceof HTMLElement) ||
			(!openElementBrowserModal && items.length === 0 && !errorInfo)
		) {
			return null;
		}

		return (
			<TypeAheadPopup
				editorView={editorView}
				popupsMountPoint={popupMountRef.current?.popupsMountPoint}
				popupsBoundariesElement={popupMountRef.current?.popupsBoundariesElement}
				popupsScrollableElement={popupMountRef.current?.popupsScrollableElement}
				anchorElement={decorationElement}
				triggerHandler={triggerHandler}
				items={items}
				errorInfo={errorInfo}
				selectedIndex={selectedIndex}
				setSelectedItem={setSelectedItem}
				onItemInsert={insertItem}
				decorationSet={decorationSet}
				isEmptyQuery={!query}
				cancel={cancel}
				api={api}
				showMoreOptionsButton={showMoreOptionsButton}
			/>
		);
	},
);
