/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Grid } from '@atlaskit/primitives/compiled';

import ExampleBox from '../shared/example-box';

const styles = cssMap({
	responsive: {
		gridTemplateColumns: 'repeat(1, 1fr)',
		'@media (min-width: 30rem)': {
			gridTemplateColumns: 'repeat(2, 1fr)',
		},
		'@media (min-width: 48rem)': {
			gridTemplateColumns: 'repeat(3, 1fr)',
		},
		'@media (min-width: 90rem)': {
			gridTemplateColumns: 'repeat(4, 1fr)',
		},
	},
});

const ResponsiveGrid = () => {
	return (
		<Grid xcss={styles.responsive} gap="space.200" alignItems="center">
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
			<ExampleBox />
		</Grid>
	);
};

export default ResponsiveGrid;
