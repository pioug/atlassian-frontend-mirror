/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		marginTop: token('space.100', '8px'),
	},
	heading: {
		color: token('color.text.subtlest'),
		display: 'flex',
		fontSize: '0.8rem',
		fontWeight: token('font.weight.medium'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space -- needs manual remediation
		marginBottom: '0.5em',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		textTransform: 'uppercase',
	},
	wrapper: {
		alignItems: 'baseline',
		color: token('color.text'),
		display: 'flex',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > *': {
			marginRight: token('space.100', '8px'),
		},
	},
});

export const ExampleGroup = ({ children, heading }: { children?: ReactNode; heading?: string }) => (
	<div css={styles.container}>
		{heading ? <div css={styles.heading}>{heading}</div> : null}
		<div css={styles.wrapper}>{children}</div>
	</div>
);
