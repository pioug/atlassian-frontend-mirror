import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box, Stack } from '@atlaskit/primitives/compiled';
import { Playground } from '@atlassian/teams-app-internal-playground/playground';

import { AddContainerCard } from '../src/next';

const styles = cssMap({
	wrapper: {
		width: '300px',
	},
});

export default function Example(): React.JSX.Element {
	return (
		<Playground>
			{() => (
				<Box xcss={styles.wrapper}>
					<Stack space="space.200">
						<AddContainerCard containerType="ConfluenceSpace" onAddAContainerClick={() => {}} />
						<AddContainerCard containerType="JiraProject" onAddAContainerClick={() => {}} />
						<AddContainerCard containerType="WebLink" onAddAContainerClick={() => {}} />
					</Stack>
				</Box>
			)}
		</Playground>
	);
}
