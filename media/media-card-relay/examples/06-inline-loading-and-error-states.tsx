/**
 * Example demonstrating MediaInlineCardRelay with different loading and error states.
 *
 * Shows three rows (inline cards render as small inline elements, so a vertical
 * stack reads better here than the column layout used by 02-loading-and-error-states):
 * 1. Processing state — seeded with `processing` status; polling subscription will start
 * 2. Failed state — demonstrates the error rendering path
 * 3. No fragment ref — fallback behavior; MediaInlineCard will attempt client fetch
 */

import React from 'react';

import { cssMap } from '@atlaskit/css';
import type { FileIdentifier } from '@atlaskit/media-client';
import { MediaProvider } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { errorFileId, imageFileId } from '@atlaskit/media-test-helpers';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MediaInlineCardRelay } from '../src';

import RelayMock, {
	MOCK_FAILED_ITEM,
	MOCK_PROCESSING_ITEM,
	useMockMediaItemRef,
} from './utils/relay-mock';
import { useMockMediaConfig } from './utils/useMockMediaConfig';

const styles = cssMap({
	root: {
		paddingTop: token('space.300'),
	paddingRight: token('space.300'),
	paddingBottom: token('space.300'),
	paddingLeft: token('space.300'),
	},
	row: {
		paddingTop: token('space.150'),
		paddingBottom: token('space.150'),
		borderBottomWidth: token('border.width'),
		borderBottomStyle: 'solid',
		borderBottomColor: token('color.border'),
	},
	rowTitle: {
		font: token('font.heading.xsmall'),
		paddingBottom: token('space.050'),
	},
	rowDescription: {
		font: token('font.body.small'),
		color: token('color.text.subtlest'),
		paddingBottom: token('space.100'),
	},
	cardWrapper: {
		paddingTop: token('space.050'),
	},
});

/**
 * Row component grouping a heading + description with the inline card under test.
 * Mirrors the StateColumn pattern from 02-loading-and-error-states but stacks
 * vertically because inline cards are inline elements.
 */
function StateRow({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<Box xcss={styles.row}>
			<Box xcss={styles.rowTitle}>{title}</Box>
			<Box xcss={styles.rowDescription}>{description}</Box>
			<Box xcss={styles.cardWrapper}>{children}</Box>
		</Box>
	);
}

/**
 * Processing state example — inline card seeded with `processing` status.
 * Polling subscription starts automatically once the card is mounted.
 */
function ProcessingStateRow({
	identifier,
	mediaClientConfig,
}: {
	identifier: FileIdentifier;
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const mediaItemRef = useMockMediaItemRef(MOCK_PROCESSING_ITEM);

	return (
		<StateRow
			title="Processing State"
			description="Item is being processed. The inline card is seeded with 'processing' status and a polling subscription will start automatically."
		>
			<MediaInlineCardRelay
				mediaItemRef={mediaItemRef}
				identifier={identifier}
				mediaClientConfig={mediaClientConfig}
			/>
		</StateRow>
	);
}

/**
 * Failed state example — demonstrates the error rendering path when the
 * underlying item has failed processing.
 */
function FailedStateRow({
	identifier,
	mediaClientConfig,
}: {
	identifier: FileIdentifier;
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const mediaItemRef = useMockMediaItemRef(MOCK_FAILED_ITEM);

	return (
		<StateRow
			title="Failed State"
			description="Item processing has failed. The inline card displays the error state with appropriate messaging."
		>
			<MediaInlineCardRelay
				mediaItemRef={mediaItemRef}
				identifier={identifier}
				mediaClientConfig={mediaClientConfig}
			/>
		</StateRow>
	);
}

/**
 * No fragment ref example — fallback behavior when no mediaItemRef is provided.
 * The card will attempt to fetch metadata client-side via the media client.
 */
function NoFragmentRefRow({
	identifier,
	mediaClientConfig,
}: {
	identifier: FileIdentifier;
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	return (
		<StateRow
			title="No Fragment Ref"
			description="No mediaItemRef provided (null). The inline card will attempt to fetch data client-side."
		>
			<MediaInlineCardRelay
				mediaItemRef={null}
				identifier={identifier}
				mediaClientConfig={mediaClientConfig}
			/>
		</StateRow>
	);
}

/**
 * Main example component demonstrating loading and error states for the
 * inline card variant across three rows.
 */
export const InlineLoadingAndErrorStatesExample = (): React.JSX.Element => {
	const mediaClientConfig = useMockMediaConfig();

	if (!mediaClientConfig) {
		return <Box xcss={styles.root}>Loading auth…</Box>;
	}

	return (
		<RelayMock>
			<MediaProvider mediaClientConfig={mediaClientConfig}>
				<Box xcss={styles.root}>
					<h2>MediaInlineCardRelay — Loading and Error States</h2>
					<Stack space="space.100">
						<ProcessingStateRow identifier={imageFileId} mediaClientConfig={mediaClientConfig} />
						<FailedStateRow identifier={errorFileId} mediaClientConfig={mediaClientConfig} />
						<NoFragmentRefRow identifier={imageFileId} mediaClientConfig={mediaClientConfig} />
					</Stack>
				</Box>
			</MediaProvider>
		</RelayMock>
	);
};

export default InlineLoadingAndErrorStatesExample;
