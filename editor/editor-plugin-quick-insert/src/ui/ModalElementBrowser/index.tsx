import React, { useCallback } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI, QuickInsertSharedState } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { closeElementBrowserModal, insertItem } from '../../commands';
import type { QuickInsertPlugin } from '../../index';
import { getQuickInsertSuggestions } from '../../search';

import ModalElementBrowser from './ModalElementBrowser';

type Props = {
	editorView: EditorView;
	helpUrl: string | undefined;
	pluginInjectionAPI: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
};

const Modal = ({
	quickInsertState,
	editorView,
	helpUrl,
	onInsert,
}: {
	editorView: EditorView;
	quickInsertState: QuickInsertSharedState | undefined;
	helpUrl?: string;
	onInsert?: (item: QuickInsertItem) => void;
}) => {
	const getItems = useCallback(
		(query?: string, category?: string) =>
			getQuickInsertSuggestions(
				{
					query,
					category,
				},
				quickInsertState?.lazyDefaultItems,
				quickInsertState?.providedItems,
			),
		[quickInsertState?.lazyDefaultItems, quickInsertState?.providedItems],
	);

	const focusInEditor = useCallback(() => {
		if (!editorView.hasFocus()) {
			editorView.focus();
		}
	}, [editorView]);

	// ED-19408 We not store the item ref in the state
	// Instead of adding the item immediately on insert item
	// We wait until modal close is complete, refocus the editor and then add the item
	const insertableItem = React.useRef<QuickInsertItem | null>(null);
	const onInsertItem = useCallback(
		(item: QuickInsertItem) => {
			onInsert?.(item);
			closeElementBrowserModal()(editorView.state, editorView.dispatch);
			insertableItem.current = item;
		},
		[editorView, onInsert],
	);

	const onClose = useCallback(() => {
		closeElementBrowserModal()(editorView.state, editorView.dispatch);
		focusInEditor();
	}, [editorView, focusInEditor]);

	const onCloseComplete = useCallback(() => {
		if (!insertableItem.current) {
			focusInEditor();
			return;
		}

		const item = insertableItem.current;
		insertableItem.current = null;

		focusInEditor();

		insertItem(item)(editorView.state, editorView.dispatch);
	}, [editorView, focusInEditor]);

	return (
		<ModalElementBrowser
			getItems={getItems}
			onInsertItem={onInsertItem}
			helpUrl={helpUrl}
			isOpen={quickInsertState?.isElementBrowserModalOpen || false}
			emptyStateHandler={quickInsertState?.emptyStateHandler}
			onClose={onClose}
			onCloseComplete={onCloseComplete}
			shouldReturnFocus={false}
		/>
	);
};

export default ({ editorView, helpUrl, pluginInjectionAPI }: Props) => {
	const { quickInsertState } = useSharedPluginState(pluginInjectionAPI, ['quickInsert']);

	return (
		<Modal
			quickInsertState={quickInsertState ?? undefined}
			editorView={editorView}
			helpUrl={helpUrl}
			onInsert={pluginInjectionAPI?.quickInsert?.actions?.onInsert}
		/>
	);
};
