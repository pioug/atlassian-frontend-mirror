import React, { type ReactNode } from 'react';

import { DropdownItemGroup } from '@atlaskit/dropdown-menu';

type ToolbarDropdownItemSectionProps = {
	children?: ReactNode;
	hasSeparator?: boolean;
	title?: string;
};

export const ToolbarDropdownItemSection = ({
	children,
	hasSeparator,
	title,
}: ToolbarDropdownItemSectionProps) => {
	return (
		<DropdownItemGroup hasSeparator={hasSeparator} title={title}>
			{children}
		</DropdownItemGroup>
	);
};
