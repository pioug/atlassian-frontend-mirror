import React, { useCallback, useMemo } from 'react';

import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';

import { performTypeAheadSelection } from '../../../pm-plugins/commands/insert-type-ahead-item';
import { useTypeAheadContext } from '../useTypeAheadContext';

export const TypeAheadQuickInsertProvider = ({
	children,
}: React.PropsWithChildren): React.JSX.Element => {
	const {
		activePreviewItemKey,
		api,
		editorView,
		inputMethod,
		menuOpenId,
		onClose,
		popupsMountPoint,
		query,
		surfaceContext,
		triggerHandler,
	} = useTypeAheadContext();
	const { isOffline } = useSharedPluginStateWithSelector(
		api,
		['connectivity'],
		({ connectivityState }) => ({ isOffline: isOfflineMode(connectivityState?.mode) }),
	);
	const select = useCallback(
		(selectionHandler: QuickInsertSelectionHandler) => {
			onClose();
			queueMicrotask(() => {
				performTypeAheadSelection(editorView)({
					handler: triggerHandler,
					inputMethod,
					query,
					selectionHandler,
				});
			});
		},
		[editorView, inputMethod, onClose, query, triggerHandler],
	);
	const contextValue = useMemo(
		() => ({
			activePreviewItemKey,
			editorView,
			isOffline,
			menuOpenId,
			popupsMountPoint,
			item: { id: 'typeahead-quick-insert', isPreviewActive: false, isSelected: false },
			surface: 'typeahead' as const,
			select,
			surfaceContext,
		}),
		[
			activePreviewItemKey,
			editorView,
			isOffline,
			menuOpenId,
			popupsMountPoint,
			select,
			surfaceContext,
		],
	);

	return <QuickInsertProvider value={contextValue}>{children}</QuickInsertProvider>;
};
