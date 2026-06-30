/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import type { JSX } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Focusable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.100'),
	},
	card: {
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderRadius: token('radius.small'),
		backgroundColor: token('elevation.surface'),
		boxShadow: token('elevation.shadow.overlay'),
		cursor: 'pointer',
	},
});

export default (): JSX.Element => {
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
