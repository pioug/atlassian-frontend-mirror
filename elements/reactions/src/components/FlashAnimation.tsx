/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type PropsWithChildren } from 'react';
import { jsx, css, keyframes } from '@compiled/react';
import { B75, B300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const flashTime = 700;

const flashAnimation = keyframes({
	'0%': {
		backgroundColor: 'transparent',
	},
	'20%': {
		backgroundColor: token('color.background.selected.pressed', B75),
		borderColor: token('color.border.selected', B300),
	},
	'75%': {
		backgroundColor: token('color.background.selected.pressed', B75),
		borderColor: token('color.border.selected', B300),
	},
	'100%': {
		backgroundColor: token('color.background.selected.pressed', B75),
		borderColor: token('color.border.selected', B300),
	},
});

const containerStyle = css({
	width: '100%',
	height: '100%',
});

const flashStyle = css({
	animationName: flashAnimation,
	animationDuration: `${flashTime}ms`,
	animationTimingFunction: 'ease-in-out',
});

export type FlashAnimationProps = PropsWithChildren<{
	/**
	 * Optional wrapper div class anme
	 */
	className?: string;
	/**
	 * Show custom animation or render as standard without animation (defaults to false)
	 */
	flash?: boolean;
}>;

/**
 * Test id for wrapper FlashAnimation div
 */
export const RENDER_FLASHANIMATION_TESTID = 'flash-animation';
/**
 * Flash animation background component. See Reaction component for usage.
 */
export const FlashAnimation = (props: FlashAnimationProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		className={props.className}
		css={[containerStyle, props.flash && flashStyle]}
		data-testid={RENDER_FLASHANIMATION_TESTID}
	>
		{props.children}
	</div>
);
