import React from 'react';

import { useIntl } from 'react-intl';

import { messages } from '@atlaskit/editor-common/quick-insert/messages';

import { QuickInsertMenuSection } from './QuickInsertMenuSection';

export const QuickInsertSearchResultsSection = ({
	children,
}: React.PropsWithChildren): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<QuickInsertMenuSection title={formatMessage(messages.searchResults)}>
			{children}
		</QuickInsertMenuSection>
	);
};
