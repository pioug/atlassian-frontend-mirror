/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
	},
	card: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		borderRadius: token('radius.small'),
		backgroundColor: token('elevation.surface'),
		boxShadow: token('elevation.shadow.overlay'),
		cursor: 'pointer',
	},
});

export default () => {
	return (
		<div css={styles.container}>
			<Focusable
				as="div"
				xcss={styles.card}
				tabIndex={0}
				role="button"
				aria-pressed="false"
				onClick={() => console.log('Card clicked!')}
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						console.log('Card clicked!');
					}
				}}
			>
				<h3>Focusable Card</h3>
				<p>This is a custom card component that's focusable and clickable.</p>
			</Focusable>
		</div>
	);
};
