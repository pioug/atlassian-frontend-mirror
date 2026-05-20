import React from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

import { useTableMenuContext } from '../../shared/TableMenuContext';

import { shouldShowHeaderColumnToggle } from './HeaderColumnToggleItem';

/**
 * The toggle section currently contains only the Header column toggle. When
 * that item is hidden, the whole section disappears so we don't render an
 * empty wrapper (and so the section below can drop its leading separator).
 */
export const ColumnToggleSection = ({
	children,
}: {
	children?: React.ReactNode;
}): React.JSX.Element | null => {
	const tableMenuContext = useTableMenuContext();

	if (!shouldShowHeaderColumnToggle(tableMenuContext)) {
		return null;
	}

	return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
};
