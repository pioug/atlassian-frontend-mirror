/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { ProgressTracker, type Stages } from '@atlaskit/progress-tracker';

const styles = cssMap({
	container: {
		maxWidth: '400px',
		margin: 'auto',
	},
});

const items: Stages = [
	{
		id: 'welcome',
		label: 'Welcome',
		percentageComplete: 100,
		status: 'disabled',
		href: '#',
	},
	{
		id: 'create-space',
		label: 'Create a space',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: 'upload-photo',
		label: 'Upload a photo',
		percentageComplete: 0,
		status: 'current',
		href: '#',
	},
	{
		id: 'your-details',
		label: 'Your details',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'invite-users',
		label: 'Invite users',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'confirmation',
		label: 'Confirmation',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
];

export default () => (
	<Box xcss={styles.container}>
		<ProgressTracker items={items} spacing="cosy" />
	</Box>
);
