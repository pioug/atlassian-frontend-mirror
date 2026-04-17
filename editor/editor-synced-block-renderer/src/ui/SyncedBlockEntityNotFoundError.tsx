import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import { SYNCED_BLOCKS_DOCUMENTATION_URL } from '@atlaskit/editor-common/sync-block';
import LinkBrokenIcon from '@atlaskit/icon/core/link-broken';
import { Anchor } from '@atlaskit/primitives/compiled';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

const styles = cssMap({
	link: {
		textDecoration: 'none',
	},
});

export const SyncedBlockEntityNotFoundError = (): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const description = formatMessage(messages.entityNotFoundDescription, {
		link: (chunks: React.ReactNode) => (
			<Anchor
				href={SYNCED_BLOCKS_DOCUMENTATION_URL}
				target="_blank"
				rel="noopener noreferrer"
				xcss={styles.link}
			>
				{chunks}
			</Anchor>
		),
	});

	return <SyncedBlockErrorStateCard description={description} icon={LinkBrokenIcon} />;
};
