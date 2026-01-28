import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

const styles = cssMap({
	buttonContainer: {
		marginLeft: token('space.100'),
		display: 'flex',
		alignItems: 'center',
	},
});

interface SyncedBlockNotFoundProps {
	contentId?: string;
	isLoading?: boolean;
	onRetry?: () => void;
}

export const SyncedBlockLoadError = ({
	onRetry,
	isLoading,
}: SyncedBlockNotFoundProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const button = (
		<Button
			appearance="default"
			spacing="compact"
			onClick={(event) => {
				event.preventDefault();
				event.stopPropagation();
				onRetry?.();
			}}
			isLoading={isLoading}
			testId="sync-block-retry-btn"
		>
			{formatMessage(messages.retryButton)}
		</Button>
	);
	return (
		<SyncedBlockErrorStateCard description={formatMessage(messages.generalErrorDescription)}>
			{onRetry &&
				(fg('platform_synced_block_dogfooding') ? (
					<Box xcss={styles.buttonContainer}>{button}</Box>
				) : (
					button
				))}
		</SyncedBlockErrorStateCard>
	);
};
