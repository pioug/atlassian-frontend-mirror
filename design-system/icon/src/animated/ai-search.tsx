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

// Lens will scale (1 to 1.2) from 0-300ms and will scale back from 300ms-600ms
// Sparkle will scale (1 to 1.3 scale) from 60ms-360ms and will scale back from 360ms-660ms
const TIMELINE = [
	{ phase: 'lens-sparkle-grow', durationMs: 300 }, // Lens and sparkle scale up
	{ phase: 'sparkle-grow', durationMs: 60 }, // Sparkle continues to scale, whilst lens returns
] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'transform',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
			transitionDuration: '300ms',
		},
		'& [data-anim="lens"]': {
			transform: 'scale(1)',
		},
		'& [data-anim="sparkle"]': {
			transform: 'scale(1)',
		},
	},
	lensGrow: {
		'& [data-anim="lens"]': {
			transform: 'scale(1.2)',
			transitionDuration: '300ms',
		},
	},
	sparkleGrow: {
		'& [data-anim="sparkle"]': {
			transform: 'scale(1.3)',
			transitionDelay: '60ms',
			transitionDuration: '300ms',
		},
	},
});

const glyph = `
<path data-anim="lens" d="M6 2.612A4.501 4.501 0 0 0 7 11.5a4.48 4.48 0 0 0 3.182-1.318A4.5 4.5 0 0 0 11.387 8h1.53a6 6 0 0 1-1.179 2.678l3.292 3.292-1.06 1.06-3.292-3.292A6 6 0 1 1 6 1.084z" fill="currentColor" style="transform-origin: 8px 7.5px;"/>
<path data-anim="sparkle" d="M14 3.25a.75.75 0 0 1-.493.705l-1.285.469a.5.5 0 0 0-.298.298l-.469 1.285a.75.75 0 0 1-1.41 0l-.469-1.285a.5.5 0 0 0-.298-.298l-1.285-.469a.75.75 0 0 1-.484-.589L7.5 3.25l.009-.116a.75.75 0 0 1 .484-.59l1.285-.468a.5.5 0 0 0 .298-.298l.469-1.285.049-.106A.75.75 0 0 1 10.749 0l.116.009a.75.75 0 0 1 .541.378l.05.106.468 1.285a.5.5 0 0 0 .298.298l1.285.469A.75.75 0 0 1 14 3.25" fill="currentColor" style="transform-origin: 10.75px 3.25px;"/>
`;
/**
 * Animated AI search icon: the lens and sparkle scale up.
 */
const AiSearchAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(function AiSearchAnimatedIcon(props, ref) {
	const [phase] = useAnimatedIconPlayback(ref, TIMELINE);

	return (
		<span
			css={[
				animatedStyles.base,
				phase === 'lens-sparkle-grow' && animatedStyles.lensGrow,
				(phase === 'lens-sparkle-grow' || phase === 'sparkle-grow') && animatedStyles.sparkleGrow,
			]}
		>
			<Icon
				name="AiSearchIcon"
				dangerouslySetGlyph={glyph}
				isAnimatedIcon
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...props}
				size="medium"
			/>
		</span>
	);
});

AiSearchAnimatedIcon.displayName = 'AiSearchIcon';

export default AiSearchAnimatedIcon;
