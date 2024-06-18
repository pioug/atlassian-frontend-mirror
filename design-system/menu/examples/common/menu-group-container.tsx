/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { Box, xcss } from '@atlaskit/primitives';

const baseStyles = xcss({
	backgroundColor: 'elevation.surface.overlay',
	boxShadow: 'elevation.shadow.overlay',
	borderRadius: 'border.radius',
	marginBlock: 'space.050',
	marginInline: 'auto',
	maxWidth: '320px',
});

const growingStyles = xcss({
	minWidth: '320px',
	maxWidth: '100%',
});

type MenuGroupContainer = {
	growing?: boolean;
	children?: React.ReactNode;
};

const MenuGroupContainer = ({ children, growing }: MenuGroupContainer) => {
	return <Box xcss={[baseStyles, growing && growingStyles]}>{children}</Box>;
};

export default MenuGroupContainer;
