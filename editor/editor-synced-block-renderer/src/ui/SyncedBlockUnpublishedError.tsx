import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';
import { Anchor } from '@atlaskit/primitives/compiled';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

const styles = cssMap({
	link: {
		textDecoration: 'none',
	},
});

export const SyncedBlockUnpublishedError = ({
	sourceURL,
}: {
	sourceURL?: string;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const description = formatMessage(messages.unpublishedError, {
		link: (chunks: React.ReactNode[]) =>
			sourceURL ? (
				<Anchor href={sourceURL} target="_blank" rel={'noopener noreferrer'} xcss={styles.link}>
					{chunks}
				</Anchor>
			) : (
				chunks
			),
	});

	return <SyncedBlockErrorStateCard description={description} icon={EyeOpenStrikethroughIcon} />;
};
