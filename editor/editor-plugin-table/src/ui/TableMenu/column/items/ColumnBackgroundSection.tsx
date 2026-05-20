import React from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import { useTableMenuContext } from '../../shared/TableMenuContext';

import { shouldShowHeaderColumnToggle } from './HeaderColumnToggleItem';

/**
 * Background section sits directly below `ColumnToggleSection`. Its separator
 * exists only to divide it from the toggle section; when the toggle section
 * is hidden, the separator must drop too so we don't render a stray rule at
 * the very top of the menu.
 */
export const ColumnBackgroundSection = ({
	children,
}: {
	children?: React.ReactNode;
}): React.JSX.Element => {
	const tableMenuContext = useTableMenuContext();
	const hasSeparator = shouldShowHeaderColumnToggle(tableMenuContext);

	return (
		<ToolbarDropdownItemSection hasSeparator={hasSeparator}>
			{children}
		</ToolbarDropdownItemSection>
	);
};
