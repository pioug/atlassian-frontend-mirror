import React from 'react';

import Section from '@atlaskit/menu/section';

export const QuickInsertMenuSection = ({
	children,
	title,
}: React.PropsWithChildren<{ title: string }>): React.JSX.Element => (
	<Section title={title}>{children}</Section>
);
