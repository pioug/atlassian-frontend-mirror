/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

import { cssMap as unboundCssMap } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

interface IconWrapperProps {
	bgColor?: string;
	children?: ReactNode;
	label?: string;
}

const styles = cssMap({
	root: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		height: '100%',
		alignItems: 'center',
		alignContent: 'center',
		borderRadius: token('border.radius.circle', '50%'),
		overflow: 'hidden',
		borderWidth: token('border.width.outline', '2px'),
		borderStyle: 'solid',
		backgroundColor: token('elevation.surface.overlay', '#FFFFFF'),
	},
});

const unboundStyles = unboundCssMap({
	root: {
		borderColor: token('elevation.surface.overlay', '#FFFFFF'),
	},
});

/**
 * __Icon wrapper__
 *
 * An icon wrapper is used internally only.
 */
const IconWrapper: FC<IconWrapperProps> = ({ bgColor, children }) => (
	<span
		css={[styles.root, unboundStyles.root]}
		role="presentation"
		style={{
			borderColor: bgColor,
			backgroundColor: bgColor,
		}}
	>
		{children}
	</span>
);

export default IconWrapper;
