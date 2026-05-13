import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { SyncBlockProduct } from '@atlaskit/editor-synced-block-provider';
import EyeOpenStrikethroughIcon from '@atlaskit/icon/core/eye-open-strikethrough';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor } from '@atlaskit/primitives/compiled';

import { SyncedBlockErrorStateCard } from './SyncedBlockErrorStateCard';

const styles = cssMap({
	link: {
		textDecoration: 'none',
	},
});

export const SyncedBlockUnpublishedError = ({
	sourceURL,
	sourceProduct,
}: {
	sourceProduct?: SyncBlockProduct;
	sourceURL?: string;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();

	// Pick the product-specific copy. Jira work items are described as "the item's
	// description is saved" rather than "the page is published" because Jira issues
	// don't have a page-level publish action — the description field is what's
	// being authored.
	//
	// Gated by `platform_synced_block_patch_11` so the new copy can be rolled out (and
	// dialled off) independently of the rest of the renderer.
	const message =
		sourceProduct === 'jira-work-item' && fg('platform_synced_block_patch_11')
			? messages.unpublishedErrorJiraWorkItem
			: messages.unpublishedError;

	const description = formatMessage(message, {
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
