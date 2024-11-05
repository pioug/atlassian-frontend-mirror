import { useLayoutEffect, useRef } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { insertTypeAheadItem } from '../../pm-plugins/commands/insert-type-ahead-item';
import type { TypeAheadHandler, TypeAheadItem } from '../../types';

type Props = {
	triggerHandler: TypeAheadHandler;
	items: Array<TypeAheadItem>;
	query: string;
	editorView: EditorView;
	closePopup: () => void;
};
export const useOnForceSelect = ({
	triggerHandler,
	items,
	query,
	editorView,
	closePopup,
}: Props) => {
	const editorViewRef = useRef(editorView);

	useLayoutEffect(() => {
		if (!query || typeof triggerHandler.forceSelect !== 'function') {
			return;
		}

		const item = triggerHandler.forceSelect({
			items,
			query,
			editorState: editorViewRef.current.state,
		});

		if (!item) {
			return;
		}

		const { current: view } = editorViewRef;

		closePopup();

		queueMicrotask(() => {
			insertTypeAheadItem(view)({
				item,
				mode: SelectItemMode.SPACE,
				query,
				handler: triggerHandler,
				sourceListItem: items,
			});
		});
	}, [triggerHandler, closePopup, query, items]);
};
