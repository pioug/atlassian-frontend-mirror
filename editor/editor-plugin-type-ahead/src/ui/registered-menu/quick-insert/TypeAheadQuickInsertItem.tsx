import React, { useMemo } from 'react';

import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';

import { PassThrough } from '../PassThrough';
import type { TypeAheadItemRenderProps } from '../typeAheadMenuTypes';

export const TypeAheadQuickInsertItem = ({
	id,
	isSelected,
	registration,
}: TypeAheadItemRenderProps): React.JSX.Element => {
	const quickInsertContext = useQuickInsertContext();
	const Component = registration.component ?? PassThrough;
	const contextValue = useMemo(
		() => ({
			editorView: quickInsertContext.editorView,
			isOffline: quickInsertContext.isOffline,
			menuOpenId: quickInsertContext.menuOpenId,
			surfaceContext: quickInsertContext.surfaceContext,
			surface: 'typeahead' as const,
			item: {
				id,
				isSelected,
			},
			select: quickInsertContext.select,
		}),
		[id, isSelected, quickInsertContext],
	);

	return (
		<QuickInsertProvider value={contextValue}>
			<Component>{null}</Component>
		</QuickInsertProvider>
	);
};
