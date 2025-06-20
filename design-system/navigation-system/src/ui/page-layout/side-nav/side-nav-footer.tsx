/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

import { jsx } from '@compiled/react';

import { cssMap, type StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingTop: token('space.150'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.150'),
		paddingLeft: token('space.150'),
		borderBlockStartWidth: token('border.width'),
		borderBlockStartStyle: 'solid',
		borderBlockStartColor: token('color.border'),
	},
});

/**
 * The bottom part of the side nav.
 */
export const SideNavFooter = ({
	/**
	 * The content of the layout area.
	 */
	children,
	xcss,
}: {
	/**
	 * The content of the layout area.
	 */
	children: ReactNode;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
}) => {
	return (
		<div css={styles.root} className={xcss}>
			{children}
		</div>
	);
};
