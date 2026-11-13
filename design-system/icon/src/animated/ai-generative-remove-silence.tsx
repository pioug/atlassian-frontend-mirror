/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors -- Animated glyphs are injected HTML strings, so inner elements can only be styled via nested selectors on the wrapper. */
import { type ForwardRefExoticComponent, forwardRef, type RefAttributes, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Icon from '../components/icon-new';
import { useAnimatedIconPlayback } from '../components/use-animated-icon-playback';
import { useSvgMaskId } from '../components/use-svg-mask-id';
import type { AnimatedIconProps, AnimatedIconRef } from '../types';

// Ring will rotate (0 to 284deg) from 0-700ms. It will snap to 429deg at 700ms and hold until 950ms.
// Ring will rotate (429 to 720deg) from 950-1650ms
// Mask will be applied onto the Ring from 0-700ms and hold until 950ms
// Mask will be removed from the Ring from 950-1650ms
// Star will scale (1 to 0.5) from 0-700ms and hold until 950ms
// Star will scale (0.5 to 1) from 950-1650ms and hold until 1650ms
const TIMELINE = [
	{ phase: 'start', durationMs: 700 },
	{ phase: 'hold', durationMs: 250 },
	{ phase: 'end', durationMs: 700 },
] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'transform, stroke-dasharray, stroke-dashoffset',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
		},
		'& [data-anim="ring"]': {
			transform: 'rotate(0deg)',
			transitionDuration: '0ms',
		},
		'& [data-anim="star"]': {
			transform: 'scale(1)',
		},
		'& [data-anim="window"]': {
			strokeDasharray: '360 0',
			strokeDashoffset: '-104',
		},
	},
	ringStart: {
		'& [data-anim="ring"]': {
			transform: 'rotate(284deg)',
			transitionDuration: '700ms',
		},
		'& [data-anim="window"]': {
			strokeDasharray: '83 277',
			strokeDashoffset: '-381',
			transitionDuration: '700ms',
		},
	},
	ringHold: {
		'& [data-anim="ring"]': {
			transform: 'rotate(429deg)',
			transitionDuration: '0ms',
		},
		'& [data-anim="window"]': {
			strokeDasharray: '0 360',
			strokeDashoffset: '-166',
			transitionDuration: '0ms',
		},
	},
	end: {
		'& [data-anim="ring"]': {
			transform: 'rotate(720deg)',
			transitionDuration: '700ms',
		},
		'& [data-anim="window"]': {
			strokeDasharray: '291 69',
			strokeDashoffset: '-166',
			transitionDuration: '700ms',
		},
		'& [data-anim="star"]': {
			transitionDuration: '700ms',
		},
	},
	starShrink: {
		'& [data-anim="star"]': {
			transform: 'scale(0.5)',
			transitionDuration: '700ms',
		},
	},
});

const getGlyph = (maskId: string) => `
<defs>
<mask id="${maskId}" maskUnits="userSpaceOnUse" x="-4" y="-4" width="24" height="24">
	<circle data-anim="window" cx="8" cy="8" r="7.25" pathLength="360" fill="none" stroke="white" stroke-width="4" transform="rotate(-90 8 8)"/>
	<path d="M11.795 9.494a.75.75 0 0 1 1.41 0l.615 1.687 1.686.615a.75.75 0 0 1 0 1.41l-1.686.615-.615 1.686a.75.75 0 0 1-1.41 0l-.615-1.686-1.686-.615a.75.75 0 0 1 0-1.41l1.686-.615z" fill="black" stroke="black" stroke-width="2" stroke-linejoin="round"/>
</mask>
</defs>
<g mask="url(#${maskId})">
<g data-anim="ring" style="transform-origin: 8px 8px;">
	<path d="M3.115 1.664A7.98 7.98 0 0 1 8 0v1.5a6.48 6.48 0 0 0-3.968 1.35zM1.5 8c0 1.664.635 3.326 1.904 4.595A6.48 6.48 0 0 0 8 14.5V16a7.98 7.98 0 0 1-5.657-2.343A7.97 7.97 0 0 1 0 8z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
	<path d="m2.92 3.95-1.17-.94A7.98 7.98 0 0 0 0 8a7.97 7.97 0 0 0 2.34 5.66A7.98 7.98 0 0 0 8 16v-1.5a6.48 6.48 0 0 1-4.6-1.9A6.48 6.48 0 0 1 1.5 8c0-1.44.47-2.87 1.42-4.05m10.45-1.8a.75.75 0 0 1-1 1.11l-.02-.01a.75.75 0 1 1 1-1.12zM10.69.55a.75.75 0 1 1-.5 1.41l-.02-.01a.75.75 0 1 1 .5-1.41zm4.59 4.27a.75.75 0 0 0-1.41.5l.01.02a.75.75 0 1 0 1.41-.5zM16 8.06a.75.75 0 0 0-1.5-.08V8a.75.75 0 0 0 1.5.08v-.01z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
</g>
<path data-anim="star" d="M11.795 9.494a.75.75 0 0 1 1.41 0l.615 1.687 1.686.615a.75.75 0 0 1 0 1.41l-1.686.615-.615 1.686a.75.75 0 0 1-1.41 0l-.615-1.686-1.686-.615a.75.75 0 0 1 0-1.41l1.686-.615z" fill="currentColor" style="transform-origin: 12.5px 12.5px;"/>
`;
/**
 * Animated AI remove silence icon: the ring turns and the star shrinks and returns.
 */
const AiGenerativeRemoveSilenceAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	function AiGenerativeRemoveSilenceAnimatedIcon(props, ref) {
		const [phase] = useAnimatedIconPlayback(ref, TIMELINE, { nonInterruptible: true });
		const maskId = useSvgMaskId('remove-silence-mask');
		const glyph = useMemo(() => getGlyph(maskId), [maskId]);

		return (
			<span
				css={[
					animatedStyles.base,
					(phase === 'start' || phase === 'hold') && animatedStyles.starShrink,
					phase === 'start' && animatedStyles.ringStart,
					phase === 'hold' && animatedStyles.ringHold,
					phase === 'end' && animatedStyles.end,
				]}
			>
				<Icon
					name="AiGenerativeRemoveSilenceIcon"
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

AiGenerativeRemoveSilenceAnimatedIcon.displayName = 'AiGenerativeRemoveSilenceIcon';

export default AiGenerativeRemoveSilenceAnimatedIcon;
