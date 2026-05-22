import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

import { shouldShowHeaderColumnToggle } from './HeaderColumnToggleItem';

/**
 * The toggle section currently contains only the Header column toggle. When
 * that item is hidden, the whole section disappears so we don't render an
 * empty wrapper (and so the section below can drop its leading separator).
 */
export const ColumnToggleSection = ({
	api,
	children,
}: TableMenuComponentsParams & {
	children?: React.ReactNode;
}): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();
	const { isHeaderColumnAllowed } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isHeaderColumnAllowed: (states.tableState as TableSharedStateInternal | undefined)
				?.pluginConfig?.allowHeaderColumn,
		}),
	);

	if (
		!shouldShowHeaderColumnToggle({
			isFirstColumn: tableMenuContext?.isFirstColumn,
			isHeaderColumnAllowed,
			selectedColumnCount: tableMenuContext?.selectedColumnCount,
		})
	) {
		return null;
	}

	return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
};
