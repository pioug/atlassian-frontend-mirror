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
		api,
		editorView,
		inputMethod,
		menuOpenId,
		onClose,
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
			editorView,
			isOffline,
			menuOpenId,
			item: { id: 'typeahead-quick-insert', isSelected: false },
			surface: 'typeahead' as const,
			select,
			surfaceContext,
		}),
		[editorView, isOffline, menuOpenId, select, surfaceContext],
	);

	return <QuickInsertProvider value={contextValue}>{children}</QuickInsertProvider>;
};
