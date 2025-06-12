import { useEffect, useRef, useState } from 'react';

import type { TypeAheadHandler, TypeAheadItem } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { updateListError } from '../../pm-plugins/commands/update-list-error';
import { updateListItem } from '../../pm-plugins/commands/update-list-items';

const EMPTY_LIST_ITEM: Array<TypeAheadItem> = [];
export const useLoadItems = (
	triggerHandler: TypeAheadHandler,
	editorView: EditorView,
	query: string,
	showViewMore?: boolean,
): Array<TypeAheadItem> => {
	const [items, setItems] = useState<Array<TypeAheadItem>>(EMPTY_LIST_ITEM);
	const componentIsMounted = useRef(true);
	const editorViewRef = useRef(editorView);

	useEffect(() => {
		const getItems = triggerHandler?.getItems;
		if (!getItems) {
			setItems(EMPTY_LIST_ITEM);
			return;
		}

		const options = {
			query: query || '',
			editorState: editorView.state,
		};

		const { current: view } = editorViewRef;
		getItems(options)
			.then((result) => {
				const list = result.length > 0 ? result : EMPTY_LIST_ITEM;
				if (componentIsMounted.current) {
					setItems(list);
				}

				// Add a placeholder item for view more button so that it can be traversed with arrow keys
				const viewMoreItem: TypeAheadItem = {
					title: 'View more',
				};

				queueMicrotask(() => {
					updateListItem(showViewMore ? list.concat(viewMoreItem) : list)(
						view.state,
						view.dispatch,
					);
				});
			})
			.catch((e) => {
				if (editorExperiment('platform_editor_offline_editing_web', true)) {
					if (e) {
						if (componentIsMounted.current) {
							setItems(EMPTY_LIST_ITEM);
						}
						queueMicrotask(() => {
							updateListError(e)(view.state, view.dispatch);
						});
					}
				}
			});

		// ignore because EditorView is mutable but we don't want to
		// call loadItems when it changes, only when the query changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerHandler, query]);

	useEffect(() => {
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	return items;
};
