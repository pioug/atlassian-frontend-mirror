/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, cx, jsx } from '@atlaskit/css';
import type MediaForcedColorsOrLegacyHighContrast from '@atlaskit/css/at-rules/media-forced-colors-or-legacy-high-contrast';
import type MediaReducedMotion from '@atlaskit/css/at-rules/media-reduced-motion';
import { Box } from '@atlaskit/primitives/compiled/box';
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

	motion: {
		transition: token(
			'motion.input.toggle',
			'background-color 150ms cubic-bezier(0.4, 1, 0.6, 1), color 150ms cubic-bezier(0.4, 1, 0.6, 1), transform 150ms cubic-bezier(0.4, 1, 0.6, 1), opacity 150ms cubic-bezier(0.4, 1, 0.6, 1)',
		),
		['@media (prefers-reduced-motion: reduce)' satisfies MediaReducedMotion]: {
			// Retain the fade, but move to the final position immediately.
			transitionProperty: 'opacity',
		},
		['@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)' satisfies MediaForcedColorsOrLegacyHighContrast]:
			{ transition: 'none' },
	},
	noMotion: { transition: 'none' },
	outsideRight: { transform: 'translateX(100%)' },
	outsideLeft: { transform: 'translateX(-100%)' },

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
	hasMotion: boolean;
	isDisabled: boolean;
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
	hasMotion,
	isDisabled,
}: IconContainerProps) => JSX.Element = ({
	children,
	size,
	isHidden,
	position,
	hasMotion,
	isDisabled,
}: IconContainerProps) => {
	return (
		<Box
			as="span"
			xcss={cx(
				styles.iconContainer,
				hasMotion && styles.motion,
				hasMotion && isDisabled && styles.noMotion,
				// Icons enter and exit at their nearest track edge, travelling with the handle.
				hasMotion && isHidden && position === 'left' && styles.outsideLeft,
				hasMotion && isHidden && position === 'right' && styles.outsideRight,
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
