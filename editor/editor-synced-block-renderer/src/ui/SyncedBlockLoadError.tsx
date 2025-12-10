import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';

import ExclamationWarning from './assets/ExclamationWarning.svg';
import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

interface SyncedBlockNotFoundProps {
	contentId?: string;
	isLoading?: boolean;
	onRetry?: () => void;
}

export const SyncedBlockLoadError = ({ onRetry, isLoading }: SyncedBlockNotFoundProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	return (
		<SyncedBlockErrorStateCard
			imageSrc={ExclamationWarning}
			imageAltText={formatMessage(messages.notFoundAltText)}
			secondaryMessage={formatMessage(messages.notFoundDescription)}
		>
			{onRetry && (
				<Button
					appearance="default"
					spacing="compact"
					onClick={(event) => {
						event.preventDefault();
						event.stopPropagation();
						onRetry();
					}}
					isLoading={isLoading}
					testId="sync-block-retry-btn"
				>
					{formatMessage(messages.retryButton)}
				</Button>
			)}
		</SyncedBlockErrorStateCard>
	);
};
