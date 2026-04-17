import React from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { selectField } from '@atlassian/teams-app-internal-playground/fields';
import {
	Playground,
	type PlaygroundConfig,
} from '@atlassian/teams-app-internal-playground/playground';

import { TeamContainerSkeleton } from '../src/next';

const styles = cssMap({
	wrapperLarge: {
		width: '600px',
	},
	wrapperSmall: {
		width: '300px',
	},
});

const config = {
	fields: [
		selectField({
			id: 'width',
			label: 'Container width',
			type: 'select',
			defaultValue: 'large',
			group: 'Layout',
			options: [
				{ value: 'large', label: 'Large (600px)' },
				{ value: 'small', label: 'Small (300px)' },
			],
		}),
	],
} satisfies PlaygroundConfig;

export default function Example(): React.JSX.Element {
	return (
		<Playground config={config}>
			{({ width }) => (
				<Box xcss={width === 'large' ? styles.wrapperLarge : styles.wrapperSmall}>
					<TeamContainerSkeleton numberOfContainers={3} />
				</Box>
			)}
		</Playground>
	);
}
