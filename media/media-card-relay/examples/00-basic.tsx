/**
 * Basic MediaCardRelay Example
 *
 * This example demonstrates how to use MediaCardRelay with mock Relay fragment refs.
 * It uses interim mock utilities (RelayMock, useMockMediaItemRef) that will be
 * replaced when the AGG MediaItem schema lands (Phases 1-4 of BMPT-7771).
 *
 * At that point, use useLazyLoadQuery + fragment spread instead of mocks.
 */

import React from 'react';

import { cssMap } from '@atlaskit/css';
import { MediaProvider } from '@atlaskit/media-client-react';
import { imageFileId } from '@atlaskit/media-test-helpers';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MediaCardRelay } from '../src';

import RelayMock, { useMockMediaItemRef, MOCK_IMAGE_ITEM } from './utils/relay-mock';
import { useMockMediaConfig } from './utils/useMockMediaConfig';

const styles = cssMap({
	root: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	cardWrapper: {
		width: '300px',
	},
});

/**
 * BasicExample component that renders a single MediaCardRelay with a mock image fragment ref.
 *
 * The component is wrapped in RelayMock to provide the mock Relay environment,
 * and uses useMockMediaItemRef to create a fragment ref from a fixture. The
 * `identifier` is a real test file id from media-test-helpers so the underlying
 * Card resolves real metadata via the storybook MSW backend.
 */
const BasicExample = (): React.JSX.Element => {
	const config = useMockMediaConfig();

	const mediaItemRef = useMockMediaItemRef(MOCK_IMAGE_ITEM);

	if (!config) {
		return <Box xcss={styles.root}>Loading auth…</Box>;
	}

	return (
		<Box xcss={styles.root}>
			<h2>MediaCardRelay Basic Example</h2>
			<p>
				Rendering a MediaCardRelay with a mock image fragment ref. The card is seeded with SSR
				metadata from the mock data.
			</p>

			<MediaProvider mediaClientConfig={config}>
				<Box xcss={styles.cardWrapper}>
					<MediaCardRelay
						mediaItemRef={mediaItemRef}
						identifier={imageFileId}
						dimensions={{ width: 300, height: 200 }}
						mediaClientConfig={config}
					/>
				</Box>
			</MediaProvider>
		</Box>
	);
};

/**
 * Export the example wrapped in RelayMock to provide the mock Relay environment.
 * This is the entry point for the example.
 */
export default (): React.JSX.Element => (
	<RelayMock>
		<BasicExample />
	</RelayMock>
);
