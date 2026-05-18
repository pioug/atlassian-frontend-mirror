import React from 'react';

import { cssMap } from '@compiled/react';
import { useIntl } from 'react-intl';

import { syncBlockMessages as messages } from '@atlaskit/editor-common/messages';
import type { SyncBlockProduct } from '@atlaskit/editor-synced-block-provider';
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
	const message =
		sourceProduct === 'jira-work-item'
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
