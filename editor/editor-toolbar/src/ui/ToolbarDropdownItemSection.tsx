import React, { type ReactNode } from 'react';

import { DropdownItemGroup } from '@atlaskit/dropdown-menu';

type ToolbarDropdownItemSectionProps = {
	children?: ReactNode;
	hasSeparator?: boolean;
	testId?: string;
	title?: string;
};

export const ToolbarDropdownItemSection = ({
	children,
	hasSeparator,
	title,
	testId,
}: ToolbarDropdownItemSectionProps): React.JSX.Element => {
	return (
		<DropdownItemGroup
			hasSeparator={hasSeparator}
			title={title}
			data-toolbar-component="menu-section"
			testId={testId}
		>
			{children}
		</DropdownItemGroup>
	);
};
