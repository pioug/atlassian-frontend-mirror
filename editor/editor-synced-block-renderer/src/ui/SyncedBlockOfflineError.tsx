import React from 'react';

import { useIntl } from 'react-intl';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

export const SyncedBlockOfflineError = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return <SyncedBlockErrorStateCard description={formatMessage(messages.offlineError)} />;
};
