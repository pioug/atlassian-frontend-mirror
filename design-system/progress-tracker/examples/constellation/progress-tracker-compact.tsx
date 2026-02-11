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
		id: 'create-account',
		label: 'Create account',
		percentageComplete: 100,
		status: 'visited',
		href: '#',
	},
	{
		id: 'details',
		label: 'Your details',
		percentageComplete: 0,
		status: 'current',
		href: '#',
	},
	{
		id: 'select-plan',
		label: 'Select a plan',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'payment-methods',
		label: 'Add payment method',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
	{
		id: 'confirmation',
		label: 'Complete purchase',
		percentageComplete: 0,
		status: 'unvisited',
		href: '#',
	},
];

const _default: () => JSX.Element = () => (
	<Box xcss={styles.container}>
		<ProgressTracker items={items} spacing="compact" />
	</Box>
);
export default _default;
