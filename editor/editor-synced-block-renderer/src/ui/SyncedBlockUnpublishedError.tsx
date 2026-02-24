import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Text } from '@atlaskit/primitives/compiled';

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
				<Text>
					<Anchor
						href={sourceURL}
						target="_blank"
						rel={fg('platform_synced_block_patch_4') ? 'noopener noreferrer' : undefined}
						xcss={styles.link}
					>
						{chunks}
					</Anchor>
				</Text>
			) : (
				chunks
			),
	});

	return <SyncedBlockErrorStateCard description={description} icon={EyeOpenStrikethroughIcon} />;
};
