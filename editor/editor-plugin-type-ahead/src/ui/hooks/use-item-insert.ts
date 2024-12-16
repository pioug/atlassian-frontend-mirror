import { useCallback, useLayoutEffect, useRef } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type {
	ExtractInjectionAPI,
	TypeAheadHandler,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { closeTypeAhead } from '../../pm-plugins/commands/close-type-ahead';
import { insertTypeAheadItem } from '../../pm-plugins/commands/insert-type-ahead-item';
import { setSelectionBeforeQuery } from '../../pm-plugins/commands/set-selection-before-query';
import { CloseSelectionOptions } from '../../pm-plugins/constants';
import { itemIsDisabled } from '../../pm-plugins/item-is-disabled';
import type { TypeAheadPlugin } from '../../typeAheadPluginType';
import type {
	OnInsertSelectedItem,
	OnInsertSelectedItemProps,
	OnItemMatch,
	OnItemMatchProps,
	OnTextInsert,
	OnTextInsertProps,
} from '../../types';

type InsertRawQueryProps = {
	view: EditorView;
	setSelectionAt: CloseSelectionOptions;
	text: string;
	forceFocusOnEditor: boolean;
};

const insertRawQuery = ({
	view,
	setSelectionAt,
	text,
	forceFocusOnEditor,
}: InsertRawQueryProps) => {
	const { tr, schema } = view.state;

	closeTypeAhead(tr);

	if (text.length > 0) {
		tr.replaceSelectionWith(schema.text(text));
		if (setSelectionAt === CloseSelectionOptions.BEFORE_TEXT_INSERTED) {
			setSelectionBeforeQuery(text)(tr);
		}
	}

	view.dispatch(tr);

	if (forceFocusOnEditor) {
		view.focus();
	}
};

export const useItemInsert = (
	triggerHandler: TypeAheadHandler,
	editorView: EditorView,
	items: Array<TypeAheadItem>,
	api: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
): [OnInsertSelectedItem, OnTextInsert, OnItemMatch] => {
	const editorViewRef = useRef(editorView);
	const itemsRef = useRef(items);

	const onTextInsert = useCallback(
		({ setSelectionAt, text, forceFocusOnEditor }: OnTextInsertProps) => {
			if (!triggerHandler) {
				return;
			}

			const { current: view } = editorViewRef;

			insertRawQuery({
				view,
				setSelectionAt,
				text,
				forceFocusOnEditor,
			});
		},
		[triggerHandler],
	);

	const onItemInsert = useCallback(
		({ mode, index, query }: OnInsertSelectedItemProps) => {
			const sourceListItem = itemsRef.current;
			if (sourceListItem.length === 0 || !triggerHandler) {
				const text = `${triggerHandler.trigger}${query}`;
				onTextInsert({
					forceFocusOnEditor: true,
					setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
					text,
				});
				return;
			}

			const itemToInsert = sourceListItem[index];

			if (!itemToInsert) {
				return;
			}

			const isDisabled = itemIsDisabled(itemToInsert, api);
			if (isDisabled) {
				return;
			}
			const { current: view } = editorViewRef;

			insertTypeAheadItem(view)({
				item: itemToInsert,
				handler: triggerHandler,
				mode,
				query,
				sourceListItem,
			});
		},
		[triggerHandler, onTextInsert, api],
	);

	const onItemMatch = useCallback(
		({ mode, query }: OnItemMatchProps) => {
			const _items = itemsRef.current;
			if (_items && _items.length > 1) {
				return false;
			}

			if (_items.length === 1) {
				queueMicrotask(() => {
					onItemInsert({ mode, query, index: 0 });
				});
			} else {
				const text = `${triggerHandler.trigger}${query}`;

				queueMicrotask(() => {
					onTextInsert({
						forceFocusOnEditor: true,
						setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED,
						text: mode === SelectItemMode.SPACE ? text.concat(' ') : text,
					});
				});
			}
			return true;
		},
		[onItemInsert, triggerHandler, onTextInsert],
	);

	useLayoutEffect(() => {
		itemsRef.current = items;
	}, [items]);

	return [onItemInsert, onTextInsert, onItemMatch];
};
