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
	const latestQueryRef = useRef(query);
	latestQueryRef.current = query;

	useEffect(() => {
		const requestQuery = query;
		const isStaleRequest = () => latestQueryRef.current !== requestQuery;
		const options = {
			query: requestQuery || '',
			editorState: editorView.state,
		};

		const { current: view } = editorViewRef;

		if (editorExperiment('platform_editor_offline_editing_web', true)) {
			// Clear any existing error state before making a new request
			queueMicrotask(() => {
				api?.core.actions.execute(clearListError());
			});
		}

		/**
		 * Shared render pipeline used by both the single-shot `getItems`
		 * Promise path and the opt-in multi-emit `subscribeToItemsUpdates`
		 * path. Renders the dropdown with whatever items it is given.
		 *
		 * Both paths share the empty-state injection, section-building
		 * and "View more" placeholder logic — extracting this helper
		 * avoids any chance the two paths drift in subtle rendering
		 * behaviour.
		 */
		const renderResult = (result: Array<TypeAheadItem>) => {
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

			const viewMoreItem: TypeAheadItem = { title: 'View more' };
			queueMicrotask(() => {
				updateListItem(showViewMore ? list.concat(viewMoreItem) : list, sections)(
					view.state,
					view.dispatch,
				);
			});
		};

		// Matches the pre-refactor implicit-any contract for the original
		// `.catch((e) => updateListError(e)(...))` path.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const handleError = (e: any) => {
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
		};

		// Multi-emit path: handler opts in by implementing
		// `subscribeToItemsUpdates`. The handler controls when to push
		// updates; we re-render on every push for the lifetime of this
		// effect.
		const subscribeToItemsUpdates = triggerHandler?.subscribeToItemsUpdates;
		if (subscribeToItemsUpdates) {
			let stale = false;
			const { initial, subscribe } = subscribeToItemsUpdates(options);
			initial
				.then((result) => {
					if (!stale && !isStaleRequest()) {
						renderResult(result);
					}
				})
				.catch(handleError);
			const unsubscribe = subscribe((items) => {
				if (stale || isStaleRequest() || !componentIsMounted.current) {
					return;
				}
				renderResult(items);
			});
			return () => {
				stale = true;
				unsubscribe();
			};
		}

		// Existing single-shot path. Unchanged in behaviour.
		const getItems = triggerHandler?.getItems;
		if (!getItems) {
			setItems(EMPTY_LIST_ITEM);
			return;
		}
		getItems(options).then(renderResult).catch(handleError);

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
