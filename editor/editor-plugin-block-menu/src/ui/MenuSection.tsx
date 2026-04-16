import React from 'react';

import { useIntl } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

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
