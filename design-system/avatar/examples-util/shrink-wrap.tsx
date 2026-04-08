/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	shrinkWrap: {
		height: '24px',
		width: '24px',
	},
});

export const ShrinkWrap: ({ children }: { children?: ReactNode }) => JSX.Element = ({
	children,
}: {
	children?: ReactNode;
}) => <Box xcss={styles.shrinkWrap}>{children}</Box>;
