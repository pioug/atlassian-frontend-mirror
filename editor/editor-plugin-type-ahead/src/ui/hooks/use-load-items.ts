import { useEffect, useRef, useState } from 'react';

import type { IntlShape } from 'react-intl';

import type {
	ExtractInjectionAPI,
	TypeAheadHandler,
	TypeAheadItem,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { clearListError } from '../../pm-plugins/commands/clear-list-error';
import { updateListError } from '../../pm-plugins/commands/update-list-error';
import { updateListItem } from '../../pm-plugins/commands/update-list-items';
import type { TypeAheadPlugin } from '../../typeAheadPluginType';

import { buildSectionedResult } from './build-sectioned-result';

const EMPTY_LIST_ITEM: Array<TypeAheadItem> = [];
export const useLoadItems = (
	triggerHandler: TypeAheadHandler,
	editorView: EditorView,
	query: string,
	showViewMore?: boolean,
	api?: ExtractInjectionAPI<TypeAheadPlugin> | undefined,
	intl?: IntlShape,
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

		if (editorExperiment('platform_editor_offline_editing_web', true)) {
			// Clear any existing error state before making a new request
			queueMicrotask(() => {
				api?.core.actions.execute(clearListError());
			});
		}

		getItems(options)
			.then((result) => {
				// Inject empty list item here so it flows through the normal list rendering and keyboard
				// navigation paths
				const emptyItem =
					result.length === 0 && expValEquals('platform_editor_insert_menu_ai', 'isEnabled', true)
						? triggerHandler.getEmptyItem?.({ editorState: editorView.state })
						: undefined;

				const rawList = result.length > 0 ? result : emptyItem ? [emptyItem] : EMPTY_LIST_ITEM;
				const { items: list, sections } = buildSectionedResult({
					items: rawList,
					triggerHandler,
					intl: intl ?? null,
				});

				if (componentIsMounted.current) {
					setItems(list);
				}

				// Add a placeholder item for view more button so that it can be traversed with arrow keys
				const viewMoreItem: TypeAheadItem = {
					title: 'View more',
				};

				queueMicrotask(() => {
					updateListItem(showViewMore ? list.concat(viewMoreItem) : list, sections)(
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
	}, [triggerHandler, query, intl]);

	useEffect(() => {
		return () => {
			componentIsMounted.current = false;
		};
	}, []);

	return items;
};
