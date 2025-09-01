/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Focusable } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		display: 'block',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		border: 'none',
		borderRadius: token('radius.small'),
		marginBlock: token('space.150'),
		marginInline: 0,
		cursor: 'pointer',
	},
	stack: {
		display: 'flex',
		maxWidth: '18.75rem',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
		gap: token('space.100'),
		flexDirection: 'column',
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
	textfield: {
		borderWidth: token('border.width.outline'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
	},
});

export default () => {
	const cardRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (cardRef.current) {
			cardRef.current.focus();
		}
	}, []);

	return (
		<div data-testid="outerDiv" css={styles.stack}>
			<Focusable
				as="div"
				ref={cardRef}
				xcss={styles.card}
				tabIndex={0}
				role="button"
				aria-pressed="false"
				onClick={() => alert('Card clicked!')}
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						alert('Card clicked!');
					}
				}}
			>
				<h3>Focusable Card</h3>
				<p>This is a custom card component that's focusable and clickable.</p>
			</Focusable>

			<Focusable
				as="span"
				xcss={styles.base}
				tabIndex={0}
				role="button"
				aria-pressed="false"
				onClick={() => alert('Span clicked!')}
				onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						alert('Span clicked!');
					}
				}}
			>
				Focusable Span
			</Focusable>

			<Textfield placeholder="AK Textfield (No focus ring)" />

			<Focusable
				as="input"
				testId="input"
				xcss={cx(styles.base, styles.textfield)}
				isInset={true}
				placeholder="Native Textfield (Inset)"
			/>
		</div>
	);
};
