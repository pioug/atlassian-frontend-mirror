import React, { type ReactNode } from 'react';

import { TEXT_COLLAPSED_MENU } from '@atlaskit/editor-common/toolbar';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
import type { CommonComponentProps } from '@atlaskit/editor-toolbar-model';

export const MenuSection = ({
	children,
	title,
	parents,
}: {
	children?: ReactNode;
	parents: CommonComponentProps['parents'];
	title?: string;
}): React.JSX.Element => {
	const hasSeparator = parents.some((parent) => parent.key === TEXT_COLLAPSED_MENU.key);

	return (
		<ToolbarDropdownItemSection hasSeparator={hasSeparator} title={title}>
			{children}
		</ToolbarDropdownItemSection>
	);
};
