/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap } from '@compiled/react';

import { jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

type ContainerProps = {
	children: React.ReactNode;
	testId?: string;
};

const unboundedStyles = cssMap({
	container: {
		padding: '21px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:first-child': {
			paddingBlockEnd: token('space.150'),
			backgroundColor: 'powderblue',
		},
		'@media (min-width: 48rem)': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
			'&:first-child': {
				paddingBlockStart: token('space.400'),
			},
		},
		'&:hover': {
			backgroundColor: 'royalblue',
			color: 'white',
		},
	},
});

export default ({ children, testId }: ContainerProps) => (
	<div css={unboundedStyles.container} data-testid={testId}>
		Hover over me
		{children}
	</div>
);
