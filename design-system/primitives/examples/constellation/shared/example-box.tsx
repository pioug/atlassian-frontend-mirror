/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type JSX, type ReactNode } from 'react';

import {
	cssMap,
	cx,
	jsx,
	type StrictXCSSProp,
	type XCSSAllProperties,
	type XCSSAllPseudos,
} from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import type { Space } from '@atlaskit/primitives/compiled/components/types';
import type { BackgroundColor } from '@atlaskit/primitives/compiled/utils/types';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	block: {
		display: 'flex',
		borderRadius: token('radius.small'),
		minWidth: '2rem',
		minHeight: '2rem',
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.discovery'),
	},
});

const Block = ({
	xcss,
	padding = 'space.200',
	backgroundColor = 'color.background.discovery',
	children,
}: {
	xcss?: StrictXCSSProp<Exclude<XCSSAllProperties, 'background'>, XCSSAllPseudos>;
	padding?: Space;
	backgroundColor?: BackgroundColor;
	children?: ReactNode;
}): JSX.Element => (
	<Box xcss={cx(styles.block, xcss)} padding={padding} backgroundColor={backgroundColor}>
		{children}
	</Box>
);

export default Block;
