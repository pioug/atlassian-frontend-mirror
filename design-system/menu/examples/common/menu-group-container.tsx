/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	base: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
		marginBlock: token('space.050'),
		marginInline: 'auto',
		maxWidth: '320px',
	},
	growing: {
		minWidth: '320px',
		maxWidth: '100%',
	},
});

type MenuGroupContainer = {
	growing?: boolean;
	children?: React.ReactNode;
};

const MenuGroupContainer: ({ children, growing }: MenuGroupContainer) => JSX.Element = ({
	children,
	growing,
}: MenuGroupContainer) => {
	return <Box xcss={cx(styles.base, growing && styles.growing)}>{children}</Box>;
};

export default MenuGroupContainer;
