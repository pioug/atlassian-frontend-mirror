/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingInline: token('space.150'),
		paddingBlockStart: token('space.150'),
		paddingBlockEnd: token('space.050'),
	},
});

/**
 * The top part of the side nav.
 */
export const SideNavHeader = ({
	children,
}: {
	/**
	 * The content of the layout area.
	 */
	children: ReactNode;
}) => {
	return <div css={styles.root}>{children}</div>;
};
