import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { MENU } from '@atlaskit/editor-common/quick-insert/keys';
import type { EmptyStateHandler, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model/types';

import { closeElementBrowser } from '../../pm-plugins/commands';
import { pluginKey } from '../../pm-plugins/plugin-key';
import type { QuickInsertPlugin } from '../../quickInsertPluginType';
import { RegistryElementBrowser } from './RegistryElementBrowser';

export const RegistryElementBrowserContainer = ({
	editorView,
	pluginInjectionAPI,
	helpUrl,
}: {
	editorView: EditorView;
	helpUrl?: string;
	pluginInjectionAPI: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
}): React.JSX.Element => {
	const {
		emptyStateHandler: currentEmptyStateHandler,
		isElementBrowserOpen,
		mode,
	} = useSharedPluginStateWithSelector(
		pluginInjectionAPI,
		['quickInsert', 'connectivity'],
		(state) => ({
			isElementBrowserOpen: state.quickInsertState?.isElementBrowserOpen ?? false,
			emptyStateHandler: state.quickInsertState?.emptyStateHandler,
			mode: state.connectivityState?.mode,
		}),
	);
	const [snapshot, setSnapshot] = useState<RegisterComponent[]>([]);
	const [hasInitialized, setHasInitialized] = useState(false);
	const [emptyStateHandler, setEmptyStateHandler] = useState<EmptyStateHandler>();
	const wasOpen = useRef(false);
	const selectionHandler = useRef<QuickInsertSelectionHandler | undefined>(undefined);
	const isInsertConfirmed = useRef(false);
	const lifecycleOpen = useRef(false);

	const fireLifecycleEvent = useCallback(
		(action: ACTION.OPENED | ACTION.CLOSED) => {
			pluginInjectionAPI?.analytics?.actions.fireAnalyticsEvent({
				action,
				actionSubject: ACTION_SUBJECT.ELEMENT_BROWSER,
				attributes: { mode: 'full' },
				eventType: EVENT_TYPE.UI,
			});
		},
		[pluginInjectionAPI],
	);

	useEffect(() => {
		if (isElementBrowserOpen && !wasOpen.current) {
			setSnapshot(pluginInjectionAPI?.uiControlRegistry?.actions.getComponents(MENU.key) ?? []);
			setHasInitialized(true);
			selectionHandler.current = undefined;
			setEmptyStateHandler(() => currentEmptyStateHandler);
			isInsertConfirmed.current = false;
			lifecycleOpen.current = true;
			fireLifecycleEvent(ACTION.OPENED);
		} else if (!isElementBrowserOpen && wasOpen.current && lifecycleOpen.current) {
			lifecycleOpen.current = false;
			fireLifecycleEvent(ACTION.CLOSED);
		}
		wasOpen.current = isElementBrowserOpen;
	}, [currentEmptyStateHandler, fireLifecycleEvent, isElementBrowserOpen, pluginInjectionAPI]);

	useEffect(
		() => () => {
			if (lifecycleOpen.current) {
				lifecycleOpen.current = false;
				fireLifecycleEvent(ACTION.CLOSED);
			}
		},
		[fireLifecycleEvent],
	);

	const focusInEditor = useCallback(() => {
		if (!editorView.hasFocus()) {
			editorView.focus();
		}
	}, [editorView]);
	const onClose = useCallback(() => {
		if (!isInsertConfirmed.current) {
			selectionHandler.current = undefined;
		}
		closeElementBrowser()(editorView.state, editorView.dispatch);
		focusInEditor();
	}, [editorView, focusInEditor]);
	const onCloseComplete = useCallback(() => {
		const handler = isInsertConfirmed.current ? selectionHandler.current : undefined;
		selectionHandler.current = undefined;
		isInsertConfirmed.current = false;
		focusInEditor();
		if (!handler) {
			return;
		}

		const insert = (maybeNode?: Parameters<typeof insertSelectedItem>[0], options = {}) =>
			insertSelectedItem(maybeNode, options)(
				editorView.state,
				editorView.state.tr,
				editorView.state.selection.head,
			);
		const transaction = handler({ insert, source: INPUT_METHOD.ELEMENT_BROWSER });
		if (transaction) {
			editorView.dispatch(transaction);
		}
	}, [editorView, focusInEditor]);
	const onSelect = useCallback((handler: QuickInsertSelectionHandler) => {
		selectionHandler.current = handler;
	}, []);
	const onClearSelection = useCallback(() => {
		selectionHandler.current = undefined;
		isInsertConfirmed.current = false;
	}, []);
	const onConfirmInsert = useCallback(() => {
		if (!selectionHandler.current) {
			return;
		}
		isInsertConfirmed.current = true;
		onClose();
	}, [onClose]);

	return (
		<RegistryElementBrowser
			components={snapshot}
			emptyStateHandler={emptyStateHandler}
			helpUrl={helpUrl}
			defaultSection={pluginKey.getState(editorView.state)?.elementBrowserInitialCategory}
			editorView={editorView}
			isOffline={isOfflineMode(mode)}
			isLoading={!hasInitialized}
			isOpen={isElementBrowserOpen}
			onClearSelection={onClearSelection}
			onClose={onClose}
			onCloseComplete={onCloseComplete}
			onConfirmInsert={onConfirmInsert}
			onSelect={onSelect}
		/>
	);
};
