/**
 * Basic MediaInlineCardRelay Example
 *
 * Demonstrates how to use MediaInlineCardRelay with mock Relay fragment refs.
 * It uses interim mock utilities (RelayMock, useMockMediaItemRef) that will be
 * replaced when the AGG MediaItem schema lands (Phases 1-4 of BMPT-7771).
 *
 * At that point, use useLazyLoadQuery + fragment spread instead of mocks.
 *
 * MediaInlineCardRelay wraps @atlaskit/media-card's MediaInlineCard. It accepts
 * a Relay fragment ref (`mediaItemRef`) and forwards all other MediaInlineCard
 * props through.
 */

import React from 'react';

import { cssMap } from '@atlaskit/css';
import type { FileIdentifier } from '@atlaskit/media-client';
import { MediaProvider } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import {
	audioFileId,
	imageFileId,
	largePdfFileId,
	videoFileId,
} from '@atlaskit/media-test-helpers';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MediaInlineCardRelay } from '../src';

import RelayMock, {
	MOCK_AUDIO_ITEM,
	MOCK_IMAGE_ITEM,
	MOCK_PDF_ITEM,
	MOCK_VIDEO_ITEM,
	useMockMediaItemRef,
} from './utils/relay-mock';
import { useMockMediaConfig } from './utils/useMockMediaConfig';

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	row: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
	},
});

/**
 * Row rendering a single MediaInlineCardRelay seeded with a mock fragment.
 * Kept tiny so each hook call is co-located with the card that consumes it
 * (useMockMediaItemRef must run inside RelayMock).
 */
function InlineRow({
	fixture,
	identifier,
	label,
	mediaClientConfig,
}: {
	fixture: Parameters<typeof useMockMediaItemRef>[0];
	identifier: FileIdentifier;
	label: string;
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const mediaItemRef = useMockMediaItemRef(fixture);

	return (
		<Box xcss={styles.row}>
			<span>{label}:</span>
			<MediaInlineCardRelay
				mediaItemRef={mediaItemRef}
				identifier={identifier}
				mediaClientConfig={mediaClientConfig}
			/>
		</Box>
	);
}

/**
 * Example component listing several MediaInlineCardRelay instances, one per
 * file type, all seeded via the same useMockMediaItemRef hook.
 */
const InlineBasicExample = (): React.JSX.Element => {
	const mediaClientConfig = useMockMediaConfig();

	if (!mediaClientConfig) {
		return <Box xcss={styles.root}>Loading auth…</Box>;
	}

	return (
		<Box xcss={styles.root}>
			<h2>MediaInlineCardRelay Basic Example</h2>
			<p>
				Rendering MediaInlineCardRelay with mock fragment refs. Each row is seeded with SSR metadata
				from a fixture; the underlying MediaInlineCard resolves real metadata via the storybook MSW
				backend using the identifier.
			</p>

			<MediaProvider mediaClientConfig={mediaClientConfig}>
				<Stack space="space.050">
					<InlineRow
						fixture={{
							...MOCK_IMAGE_ITEM,
							id: imageFileId.id,
						}}
						identifier={imageFileId}
						label="Image"
						mediaClientConfig={mediaClientConfig}
					/>
					<InlineRow
						fixture={{
							...MOCK_VIDEO_ITEM,
							id: videoFileId.id,
						}}
						identifier={videoFileId}
						label="Video"
						mediaClientConfig={mediaClientConfig}
					/>
					<InlineRow
						fixture={{
							...MOCK_AUDIO_ITEM,
							id: audioFileId.id,
						}}
						identifier={audioFileId}
						label="Audio"
						mediaClientConfig={mediaClientConfig}
					/>
					<InlineRow
						fixture={{
							...MOCK_PDF_ITEM,
							id: largePdfFileId.id,
						}}
						identifier={largePdfFileId}
						label="PDF"
						mediaClientConfig={mediaClientConfig}
					/>
				</Stack>
			</MediaProvider>
		</Box>
	);
};

export default (): React.JSX.Element => (
	<RelayMock>
		<InlineBasicExample />
	</RelayMock>
);
