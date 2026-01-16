import React from 'react';

// @ts-ignore - TS1192 TypeScript 5.9.2 upgrade
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { Box, Inline, Stack, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ProjectIcon } from '../src/ProjectIcon';

import emojiMockData from './__mocks__/emojiData.json';

fetchMock.config.fallbackToNetwork = true;

fetchMock.mock('path:/gateway/api/emoji/standard', emojiMockData, {
	overwriteRoutes: true,
});

const styles = cssMap({
	container: {
		width: '230px',
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
});

export default function ProjectIconExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box xcss={styles.container}>
				<Stack space="space.200">
					<Text as="strong" weight="semibold">
						Project Icon Examples
					</Text>

					<Inline space="space.200">
						<ProjectIcon emoji=":astonished:" isPrivate={false} />
						<ProjectIcon emoji=":astonished:" isPrivate={true} />
						<ProjectIcon emoji=":heart:" isPrivate={false} />
						<ProjectIcon emoji=":heart:" isPrivate={true} />
						<ProjectIcon emoji=":thinking:" isPrivate={false} />
						<ProjectIcon emoji=":thinking:" isPrivate={true} />
					</Inline>
					<Inline space="space.200">
						<ProjectIcon emoji=":fire:" isPrivate={false} />
						<ProjectIcon emoji=":fire:" isPrivate={true} />
						<ProjectIcon emoji=":tada:" isPrivate={false} />
						<ProjectIcon emoji=":tada:" isPrivate={true} />
						<ProjectIcon emoji=":clap:" isPrivate={false} />
						<ProjectIcon emoji=":clap:" isPrivate={true} />
					</Inline>
				</Stack>
			</Box>
		</IntlProvider>
	);
}
