import React from 'react';

import { useIntl, type MessageDescriptor } from 'react-intl-next';

import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';

type MenuSectionProps = {
	children?: React.ReactNode;
	hasSeparator?: boolean;
	title: MessageDescriptor;
};

export const MenuSection = ({
	children,
	title,
	hasSeparator,
}: MenuSectionProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<ToolbarDropdownItemSection title={formatMessage(title)} hasSeparator={hasSeparator}>
			{children}
		</ToolbarDropdownItemSection>
	);
};
