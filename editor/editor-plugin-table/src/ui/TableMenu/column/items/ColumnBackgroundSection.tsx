import React from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import type { TableSharedStateInternal } from '../../../../types';
import { useTableMenuContext } from '../../shared/TableMenuContext';
import type { TableMenuComponentsParams } from '../../shared/types';

import { shouldShowHeaderColumnToggle } from './HeaderColumnToggleItem';

/**
 * Background section sits directly below `ColumnToggleSection`. Its separator
 * exists only to divide it from the toggle section; when the toggle section
 * is hidden, the separator must drop too so we don't render a stray rule at
 * the very top of the menu.
 */
export const ColumnBackgroundSection = ({
	api,
	children,
}: TableMenuComponentsParams & {
	children?: React.ReactNode;
}): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const { isHeaderColumnAllowed } = useSharedPluginStateWithSelector(
		api ?? undefined,
		['table'],
		(states) => ({
			isHeaderColumnAllowed: (states.tableState as TableSharedStateInternal | undefined)
				?.pluginConfig?.allowHeaderColumn,
		}),
	);
	const hasSeparator = shouldShowHeaderColumnToggle({
		isFirstColumn: tableMenuContext?.isFirstColumn,
		isHeaderColumnAllowed,
		selectedColumnCount: tableMenuContext?.selectedColumnCount,
	});

	return (
		<ToolbarDropdownItemSection hasSeparator={hasSeparator}>{children}</ToolbarDropdownItemSection>
	);
};
