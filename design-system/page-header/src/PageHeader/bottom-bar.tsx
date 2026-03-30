/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	bottomBar: {
		marginBlockStart: token('space.200'),
	},
});

/**
 * __Bottom bar__.
 *
 * A bottom bar is a wrapper for the bottom bar, which appears at the bottom of the PageHeader component.
 *
 */
const BottomBar: ({ children }: { children: ReactNode }) => JSX.Element = ({
	children,
}: {
	children: ReactNode;
}) => {
	return <Box xcss={styles.bottomBar}>{children}</Box>;
};

export default BottomBar;
