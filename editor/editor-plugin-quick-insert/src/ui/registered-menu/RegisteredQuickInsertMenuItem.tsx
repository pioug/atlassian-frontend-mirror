import React, { useMemo } from 'react';

import type { QuickInsertContextValue } from '@atlaskit/editor-common/quick-insert/context';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import { useQuickInsertContext } from '@atlaskit/editor-common/quick-insert/use-quick-insert-context';
import type { RegisteredMenuItemProps } from '@atlaskit/editor-common/registered-menu';

export const RegisteredQuickInsertMenuItem = ({
	id,
	isSelected,
	isActive,
	registration,
}: RegisteredMenuItemProps): React.JSX.Element => {
	const { editorView, isOffline, popupsMountPoint, select, surfaceContext } =
		useQuickInsertContext();
	const value = useMemo<QuickInsertContextValue>(
		() => ({
			editorView,
			isOffline,
			item: { id, isSelected, isPreviewActive: isActive },
			popupsMountPoint,
			select,
			surfaceContext,
		}),
		[editorView, isOffline, popupsMountPoint, select, surfaceContext, isActive, id, isSelected],
	);
	const Component = registration.component ?? React.Fragment;
	return (
		<QuickInsertProvider value={value}>
			<Component>{null}</Component>
		</QuickInsertProvider>
	);
};
