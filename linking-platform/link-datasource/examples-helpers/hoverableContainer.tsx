/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const styles = cssMap({
	containerStyles: {
		height: '100%',
		paddingTop: token('space.400'),
		paddingRight: token('space.400'),
		paddingBottom: token('space.400'),
		paddingLeft: token('space.400'),
		backgroundColor: token('elevation.surface.overlay'),
		'&:hover': {
			backgroundColor: token('elevation.surface.overlay.hovered'),
		},
	},
});

// To simulate Jira description's hover background wrapper
export const HoverableContainer = ({ children }: React.PropsWithChildren<{}>) => {
	return (
		<div data-testid="examples-hoverable-container" css={styles.containerStyles}>
			{children}
		</div>
	);
};
