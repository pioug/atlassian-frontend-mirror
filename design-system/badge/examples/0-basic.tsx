/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import Badge from '@atlaskit/badge';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		display: 'flex',
		maxWidth: '300px',
		padding: '0.6em 1em',
		alignItems: 'center',
		justifyContent: 'space-between',
		background: 'none',
		borderRadius: token('radius.small', '3px'),
		color: 'inherit',
		marginBlockEnd: token('space.050', '4px'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.hovered'),
		},
	},
	inverted: {
		backgroundColor: token('color.background.brand.bold'),
		color: token('color.text.inverse'),
		'&:hover': {
			backgroundColor: token('color.background.brand.bold.hovered'),
		},
	},
});

export default function Example() {
	return (
		<React.StrictMode>
			<div data-testid="badge">
				<div css={styles.root}>
					<p>Added</p>
					<Badge appearance="added" max={99}>
						3000
					</Badge>
				</div>
				<div css={styles.root}>
					<p>Default</p>
					<Badge testId="badge-default">{5}</Badge>
				</div>
				<div css={styles.root}>
					<p>Default (∞)</p>
					<Badge max={Infinity}>{Infinity}</Badge>
				</div>
				<div css={styles.root}>
					<p>Important</p>
					<Badge appearance="important">{25}</Badge>
				</div>
				<div css={styles.root}>
					<p>Primary</p>
					<Badge appearance="primary">{-5}</Badge>
				</div>
				<div css={[styles.root, styles.inverted]}>
					<p>Primary Inverted</p>
					<Badge appearance="primaryInverted">{5}</Badge>
				</div>
				<div css={styles.root}>
					<p>Removed</p>
					<Badge appearance="removed">{100}</Badge>
				</div>
				<div css={styles.root}>
					<p>Added code</p>
					<Badge appearance="added">+100</Badge>
				</div>
				<div css={styles.root}>
					<p>Removed code</p>
					<Badge appearance="removed">-100</Badge>
				</div>
				<div css={styles.root}>
					<p>Added</p>
					<Badge appearance="added" max={4000}>
						3000
					</Badge>
				</div>
			</div>
		</React.StrictMode>
	);
}
