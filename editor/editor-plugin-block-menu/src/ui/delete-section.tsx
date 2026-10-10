import React from 'react';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar/toolbar-dropdown-item-section';

export const DeleteSection = ({
	children,
}: {
	children: React.ReactNode;
}): React.JSX.Element | null => {
	return <ToolbarDropdownItemSection hasSeparator>{children}</ToolbarDropdownItemSection>;
};
