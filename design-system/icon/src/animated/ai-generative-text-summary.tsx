/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors -- Animated glyphs are injected HTML strings, so inner elements can only be styled via nested selectors on the wrapper. */
import { type ForwardRefExoticComponent, forwardRef, type RefAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Icon from '../components/icon-new';
import { useAnimatedIconPlayback } from '../components/use-animated-icon-playback';
import type { AnimatedIconProps, AnimatedIconRef } from '../types';

// Lines will scale (1 to 0) sequentially with the first line starting at 0ms and the last line ending at 450ms.
// Lines will scale (0 to 1) sequentially with the first line starting at 500ms and the last line ending at 950ms.
// Sparkle will scale (1 to 0.5) from 150ms-650ms and will scale back (0.5 to 1) from 650ms-1150ms.
// The direction of the lines is reversed on exit if the motion is interrupted while the lines are scaling back.
const TIMELINE = [
	{ phase: 'lines-exit-sparkle-shrink', durationMs: 500 },
	{ phase: 'lines-enter-sparkle-shrink', durationMs: 150 },
	{ phase: 'lines-enter-sparkle-enlarge', durationMs: 500 },
] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'transform',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
		},
		'& [data-anim="sparkle"]': {
			transform: 'scale(1)',
			transformOrigin: '12.5px 12.5px',
			transitionDuration: '500ms',
		},
		'& [data-anim="line0"]': {
			transform: 'scaleX(1)',
			transformOrigin: '1px 2.75px',
			transitionDuration: '250ms',
		},
		'& [data-anim="line1"]': {
			transform: 'scaleX(1)',
			transitionDelay: '100ms',
			transformOrigin: '1px 8px',
			transitionDuration: '250ms',
		},
		'& [data-anim="line2"]': {
			transform: 'scaleX(1)',
			transitionDelay: '200ms',
			transformOrigin: '1px 13.25px',
			transitionDuration: '250ms',
		},
	},
	linesScaleDown: {
		'& [data-anim="line0"]': {
			transform: 'scaleX(0)',
			transformOrigin: '1px 2.75px',
			transitionDuration: '250ms',
		},
		'& [data-anim="line1"]': {
			transform: 'scaleX(0)',
			transformOrigin: '1px 8px',
			transitionDuration: '250ms',
		},
		'& [data-anim="line2"]': {
			transform: 'scaleX(0)',
			transformOrigin: '1px 13.25px',
			transitionDuration: '250ms',
		},
	},
	sparkleShrink: {
		'& [data-anim="sparkle"]': {
			transform: 'scale(0.5)',
			transitionDelay: '150ms',
			transitionDuration: '500ms',
		},
	},
	linesScaleUp: {
		'& [data-anim="line0"]': {
			transformOrigin: '15px 2.75px',
		},
		'& [data-anim="line1"]': {
			transformOrigin: '9.5px 8px',
		},
		'& [data-anim="line2"]': {
			transformOrigin: '6px 13.25px',
		},
	},
});

const glyph = `
<path data-anim="line0" d="M15 2v1.5H1V2z" fill="currentColor"/>
<path data-anim="line1" d="M9.5 7.25v1.5H1v-1.5z" fill="currentColor"/>
<path data-anim="line2" d="M6 12.5V14H1v-1.5z" fill="currentColor"/>
<path data-anim="sparkle" d="M12.5 9a.75.75 0 0 1 .71.49l.61 1.69 1.69.62a.75.75 0 0 1 .49.7l-.01.12a.75.75 0 0 1-.48.59l-1.69.61-.61 1.69a.75.75 0 0 1-.59.48l-.12.01a.75.75 0 0 1-.7-.49l-.61-1.69-1.69-.61a.75.75 0 0 1-.48-.59L9 12.5a.75.75 0 0 1 .49-.7l1.69-.61.62-1.69a.75.75 0 0 1 .59-.48z" fill="currentColor" style="transform-origin: 12.5px 12.5px;"/>
`;
/**
 * Animated AI summary icon: the lines collapse and return while the sparkle shrinks and re-enlarges.
 */
const AiGenerativeTextSummaryAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	function AiGenerativeTextSummaryAnimatedIcon(props, ref) {
		const [phases, lastPhase] = useAnimatedIconPlayback(ref, TIMELINE);

		// If the motion is interrupted while the lines are entering, keep the entering transform origins so they
		// finish scaling back from the right place.
		const wasInterruptedWhileEntering =
			phases === undefined &&
			(lastPhase === 'lines-enter-sparkle-shrink' || lastPhase === 'lines-enter-sparkle-enlarge');

		return (
			<span
				css={[
					animatedStyles.base,
					phases === 'lines-exit-sparkle-shrink' && animatedStyles.linesScaleDown,
					(phases === 'lines-enter-sparkle-enlarge' || phases === 'lines-enter-sparkle-shrink') &&
						animatedStyles.linesScaleUp,
					(phases === 'lines-enter-sparkle-shrink' || phases === 'lines-exit-sparkle-shrink') &&
						animatedStyles.sparkleShrink,
					wasInterruptedWhileEntering && animatedStyles.linesScaleUp,
				]}
			>
				<Icon
					name="AiGenerativeTextSummaryIcon"
					dangerouslySetGlyph={glyph}
					isAnimatedIcon
					// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
					{...props}
					size="medium"
				/>
			</span>
		);
	},
);

AiGenerativeTextSummaryAnimatedIcon.displayName = 'AiGenerativeTextSummaryIcon';

export default AiGenerativeTextSummaryAnimatedIcon;
