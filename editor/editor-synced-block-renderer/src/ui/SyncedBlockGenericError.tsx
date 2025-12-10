import React from 'react';

import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';

import ExclamationWarning from './assets/ExclamationWarning.svg';
import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

export const SyncedBlockGenericError = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<SyncedBlockErrorStateCard
			imageSrc={ExclamationWarning}
			secondaryMessage={formatMessage(messages.generalErrorDescription)}
		/>
	);
};
