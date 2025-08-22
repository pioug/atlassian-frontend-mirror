import { useLayoutEffect, useRef } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadHandler, TypeAheadItem } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { insertTypeAheadItem } from '../../pm-plugins/commands/insert-type-ahead-item';

type Props = {
	closePopup: () => void;
	editorView: EditorView;
	items: Array<TypeAheadItem>;
	query: string;
	triggerHandler: TypeAheadHandler;
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
