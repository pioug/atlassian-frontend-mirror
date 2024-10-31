/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import { token } from '@atlaskit/tokens';

import { Box } from '../src/compiled';

const styles = cssMap({
	container: {
		position: 'relative',
		width: '12rem',
		overflow: 'clip',
	},
	header: {
		position: 'absolute',
		top: token('space.0'),
		right: token('space.0'),
		left: token('space.0'),
		borderBottom: `${token('border.width')} solid ${token('color.border')}`,
		boxShadow: token('elevation.shadow.overflow'),
	},
});

export default () => {
	return (
		<Box backgroundColor="elevation.surface.raised" padding="space.200" xcss={styles.container}>
			<Box
				backgroundColor="utility.elevation.surface.current"
				padding="space.200"
				xcss={styles.header}
			>
				<Heading size="small">Header overlay</Heading>
			</Box>
			<p>Some text that is partially covered by the header.</p>
		</Box>
	);
};
