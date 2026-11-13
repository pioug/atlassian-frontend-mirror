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

// Lifts the whole icon from (0, 0) to (0, -2) from 0-500ms
// Wand will rotate (0 to 12deg) from 250m-500ms and returns to 0deg from 500ms-750ms
// Sparkles will scale and move sequentially with the first sparkle starting at 0ms and the last sparkle ending at 450ms.
// Sparkles will start returning sequentially with the first sparkle starting at 550ms and the last sparkle ending at 1000ms.
const TIMELINE = [{ phase: 'interaction', durationMs: 500 }] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'transform',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
		},
		'& [data-anim="lift"]': {
			transform: 'translateY(0px)',
			transitionDuration: '500ms',
		},
		'& [data-anim="wand"]': {
			transform: 'rotate(0deg)',
			transitionDuration: '250ms',
		},
		'& [data-anim="sparkle0"]': {
			transform: 'scale(1)',
			transitionDuration: '250ms',
			transitionDelay: '50ms',
		},
		'& [data-anim="sparkle1"]': {
			transform: 'scale(1)',
			transitionDuration: '250ms',
			transitionDelay: '100ms',
		},
		'& [data-anim="sparkle2"]': {
			transform: 'scale(1)',
			transitionDuration: '250ms',
			transitionDelay: '150ms',
		},
		'& [data-anim="sparkle3"]': {
			transform: 'scale(1)',
			transitionDuration: '250ms',
			transitionDelay: '200ms',
		},
		'& [data-anim="sparkle4"]': {
			transform: 'scale(1)',
			transitionDuration: '250ms',
			transitionDelay: '250ms',
		},
	},
	interaction: {
		'& [data-anim="lift"]': {
			transform: 'translateY(-2px)',
			transitionDuration: '500ms',
		},
		'& [data-anim="wand"]': {
			transform: 'rotate(12deg)',
			transitionDelay: '250ms',
			transitionDuration: '250ms',
		},
		'& [data-anim="sparkle0"]': {
			transform: 'scale(0.8) translate(-1.377px, -2.127px)',
			transitionDelay: '200ms',
			transitionDuration: '250ms',
		},
		'& [data-anim="sparkle1"]': {
			transform: 'scale(0.8) translate(0.375px, -2.750px)',
			transitionDelay: '150ms',
			transitionDuration: '250ms',
		},
		'& [data-anim="sparkle2"]': {
			transform: 'scale(0.8) translate(2.128px, -2.127px)',
			transitionDelay: '100ms',
			transitionDuration: '250ms',
		},
		'& [data-anim="sparkle3"]': {
			transform: 'scale(0.8) translate(2.750px, -0.375px)',
			transitionDelay: '50ms',
			transitionDuration: '250ms',
		},
		'& [data-anim="sparkle4"]': {
			transform: 'scale(0.8) translate(2.128px, 1.378px)',
			transitionDelay: '0ms',
			transitionDuration: '250ms',
		},
	},
});

const glyph = `
<g data-anim="lift">
	<path data-anim="wand" d="M9.027 3.911a1.376 1.376 0 0 1 1.841-.094l.105.094 1.116 1.116a1.376 1.376 0 0 1 0 1.946l-8.616 8.616a1.376 1.376 0 0 1-1.946 0L.411 14.473a1.376 1.376 0 0 1 0-1.946zM1.561 13.5l.939.94L7.938 9 7 8.061zM8.061 7l.938.938L10.939 6l-.94-.94z" fill="currentColor" style="transform-origin: 0.969px 15.031px;"/>
	<path data-anim="sparkle0" d="M7.982 2.422l-1.06 1.06-1.414-1.414 1.06-1.06z" fill="currentColor" style="transform-origin: 6.745px 2.245px;"/>
	<path data-anim="sparkle1" d="M11 0v2H9.5V0z" fill="currentColor" style="transform-origin: 10.25px 1px;"/>
	<path data-anim="sparkle2" d="M14.992 2.068l-1.414 1.414-1.06-1.06 1.414-1.414z" fill="currentColor" style="transform-origin: 13.755px 2.245px;"/>
	<path data-anim="sparkle3" d="M16 5v1.5h-2V5z" fill="currentColor" style="transform-origin: 15px 5.75px;"/>
	<path data-anim="sparkle4" d="M14.992 9.433l-1.06 1.06-1.415-1.414 1.061-1.06z" fill="currentColor" style="transform-origin: 13.755px 9.256px;"/>
</g>
`;

const MagicWandAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(function MagicWandAnimatedIcon(props, ref) {
	const [phase] = useAnimatedIconPlayback(ref, TIMELINE);

	return (
		<span css={[animatedStyles.base, phase === 'interaction' && animatedStyles.interaction]}>
			<Icon
				name="MagicWandIcon"
				dangerouslySetGlyph={glyph}
				isAnimatedIcon
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...props}
				size="medium"
			/>
		</span>
	);
});

MagicWandAnimatedIcon.displayName = 'MagicWandIcon';

export default MagicWandAnimatedIcon;
