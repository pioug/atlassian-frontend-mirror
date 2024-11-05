import React from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { updateSelectedIndex } from '../pm-plugins/commands/update-selected-index';
import type { CloseSelectionOptions } from '../pm-plugins/constants';
import type { TypeAheadPlugin } from '../typeAheadPluginType';
import type { PopupMountPointReference, TypeAheadPluginSharedState } from '../types';

import { useItemInsert } from './hooks/use-item-insert';
import { TypeAheadPopup } from './TypeAheadPopup';

type TypeAheadMenuType = {
	typeAheadState: TypeAheadPluginSharedState;
	editorView: EditorView;
	popupMountRef: PopupMountPointReference;
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined;
};

export const TypeAheadMenu = React.memo(
	({ editorView, popupMountRef, typeAheadState, api }: TypeAheadMenuType) => {
		const isOpen = typeAheadState.decorationSet.find().length > 0;
		const { triggerHandler, items, selectedIndex, decorationElement, decorationSet, query } =
			typeAheadState;

		const [onItemInsert, onTextInsert, onItemMatch] = useItemInsert(
			triggerHandler!,
			editorView,
			items,
		);
		const setSelectedItem = React.useCallback(
			({ index: nextIndex }: { index: number }) => {
				queueMicrotask(() => {
					updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
				});
			},
			[editorView],
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
				setSelectionAt: CloseSelectionOptions;
				addPrefixTrigger: boolean;
				forceFocusOnEditor: boolean;
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

		if (
			!isOpen ||
			!triggerHandler ||
			!(decorationElement instanceof HTMLElement) ||
			items.length === 0
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
				selectedIndex={selectedIndex}
				setSelectedItem={setSelectedItem}
				onItemInsert={insertItem}
				decorationSet={decorationSet}
				isEmptyQuery={!query}
				cancel={cancel}
				api={api}
			/>
		);
	},
);
