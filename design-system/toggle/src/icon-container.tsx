/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, cx, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type Size } from './types';

const styles = cssMap({
	iconContainer: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		transition: 'opacity 0.2s ease',

		position: 'absolute',
		insetBlockStart: token('space.025'),
	},

	iconContainerRegular: {
		width: '16px',
		height: '16px',
	},

	iconContainerLarge: {
		width: '20px',
		height: '20px',
	},

	hidden: {
		opacity: 0,
	},

	left: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		insetInlineStart: '3px' as any,
	},

	right: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
		insetInlineEnd: '3px' as any,
	},
});

type IconContainerProps = {
	children: React.ReactNode;
	size: Size;
	isHidden: boolean;
	position: 'left' | 'right';
};

/**
 * __Icon container__
 *
 * Positions a toggle's check and close icons.
 */
const IconContainer: ({
	children,
	size,
	isHidden,
	position,
}: IconContainerProps) => JSX.Element = ({
	children,
	size,
	isHidden,
	position,
}: IconContainerProps) => {
	return (
		<Box
			as="span"
			xcss={cx(
				styles.iconContainer,
				isHidden && styles.hidden,
				size === 'regular' && styles.iconContainerRegular,
				size === 'large' && styles.iconContainerLarge,
				position === 'left' && styles.left,
				position === 'right' && styles.right,
			)}
		>
			{children}
		</Box>
	);
};

export default IconContainer;
