import React from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ProjectNode } from '../src/plugins/rich-inline-nodes/nodes/project';

import emojiMockData from './__mocks__/emojiData.json';

// Unmatched routes will fall back to the network
fetchMock.config.fallbackToNetwork = true;

// Mocking the emoji API endpoint
fetchMock.mock('path:/gateway/api/emoji/standard', () => emojiMockData, {
	overwriteRoutes: true,
});

const styles = cssMap({
	nodeContainer: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.100'),

		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		alignItems: 'flex-start',
	},
});

export default (): React.JSX.Element => {
	return (
		<Box xcss={styles.nodeContainer}>
			<ProjectNode
				text={'Atlas Project node'}
				emojiName={':sparkles:'}
				selected={false}
				error={false}
			/>

			<ProjectNode
				text={'Atlas Project node without emoji'}
				selected={false}
				error={false}
			/>

			<ProjectNode
				text={'Atlas Project node selected'}
				emojiName={':avocado:'}
				selected={true}
				error={false}
			/>

			<ProjectNode
				selected={false}
				error={false}
				isRestricted={true}
			/>

			<ProjectNode
				selected={true}
				error={false}
				isRestricted={true}
			/>

			<ProjectNode
				text={'Atlas Project node with error'}
				selected={false}
				error={true}
			/>

			<ProjectNode
				text={'Atlas Project node with error selected'}
				selected={true}
				error={true}
			/>
		</Box>
	);
};
