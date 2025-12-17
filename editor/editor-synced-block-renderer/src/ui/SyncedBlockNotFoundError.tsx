import React from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

export const SyncedBlockNotFoundError = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<SyncedBlockErrorStateCard
			description={formatMessage(messages.notFoundDescription)}
		/>
	);
};
