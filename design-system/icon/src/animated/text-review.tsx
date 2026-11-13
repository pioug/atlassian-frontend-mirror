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

// The ring and check erase (start), then each resets to empty in turn (intermediate, check-intermediate).
// Check will undraw itself from 0-250ms and hold till 900ms. It will redraw itself from 900-1150ms and hold for 50ms.
// Ring will undraw itself from 100-350ms and hold till 800ms. It will redraw itself from 800-1050ms and hold for 150ms.
// Sparke will scale (1 to 0.5) from 200-700ms and return to 1 from 700-1200ms.
// The direction of the check and ring is reversed on exit if the motion is interrupted after 700ms.
const TIMELINE = [
	{ phase: 'start', durationMs: 700 },
	{ phase: 'intermediate', durationMs: 100 },
	{ phase: 'check-intermediate', durationMs: 100 },
] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'transform, stroke-dasharray, stroke-dashoffset',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
		},
		'& [data-anim="ring"]': {
			strokeDasharray: '100 200',
			strokeDashoffset: '0',
			transitionDuration: '250ms',
		},
		'& [data-anim="check"]': {
			strokeDasharray: '100 200',
			strokeDashoffset: '0',
			transitionDuration: '250ms',
		},
		'& [data-anim="star"]': {
			transform: 'scale(1)',
			transitionDuration: '500ms',
		},
	},
	start: {
		'& [data-anim="ring"]': {
			strokeDasharray: '0 300',
			strokeDashoffset: '-100',
			transitionDuration: '250ms',
			transitionDelay: '100ms',
		},
		'& [data-anim="check"]': {
			strokeDasharray: '0 300',
			strokeDashoffset: '-100',
			transitionDuration: '250ms',
		},
		'& [data-anim="star"]': {
			transform: 'scale(0.5)',
			transitionDelay: '200ms',
		},
	},
	ringIntermediate: {
		'& [data-anim="ring"]': {
			strokeDasharray: '0 300',
			strokeDashoffset: '0',
			transitionDuration: '0ms',
		},
	},
	checkIntermediate: {
		'& [data-anim="check"]': {
			strokeDasharray: '0 300',
			strokeDashoffset: '0',
			transitionDuration: '0ms',
		},
	},
});

const getGlyph = (ringMaskId: string, checkMaskId: string) => `
<defs>
	<mask id="${ringMaskId}" maskUnits="userSpaceOnUse" x="-4" y="-4" width="24" height="24">
		<path data-anim="ring" d="M8 15.25A7.25 7.25 0 1 1 15.25 8" stroke="white" stroke-width="3" fill="none" stroke-linecap="butt" pathLength="100" />
	</mask>
	<mask id="${checkMaskId}" maskUnits="userSpaceOnUse" x="-4" y="-4" width="24" height="24">
		<path data-anim="check" d="M4.25 8L6.75 11L11.75 5" stroke="white" stroke-width="3" fill="none" stroke-linecap="butt" stroke-linejoin="miter" pathLength="100" />
	</mask>
</defs>
<path d="M0 8a8 8 0 1 1 16 0h-1.5A6.5 6.5 0 1 0 8 14.5V16a8 8 0 0 1-8-8z" fill="currentColor" mask="url(#${ringMaskId})"/>
<path d="M12.326 5.48l-5 6a.75.75 0 0 1-1.152 0l-2.5-3 1.152-.96L6.75 9.828l4.424-5.308z" fill="currentColor" mask="url(#${checkMaskId})"/>
<path data-anim="star" d="M13.115 10.009a.75.75 0 0 1 .541.378l.05.106.4 1.102c.051.138.16.248.3.299l1.1.4a.75.75 0 0 1 0 1.411l-1.1.401a.5.5 0 0 0-.3.3l-.4 1.1a.75.75 0 0 1-1.411 0l-.401-1.1a.5.5 0 0 0-.3-.3l-1.1-.4a.75.75 0 0 1-.485-.59L10 13l.009-.116a.75.75 0 0 1 .484-.59l1.102-.4a.5.5 0 0 0 .299-.3l.4-1.1.05-.107a.75.75 0 0 1 .655-.387z" fill="currentColor" style="transform-origin: 13px 13px;"/>
`;

/**
 * Animated text review icon: the ring and check redraw while the star shrinks and returns.
 */
const TextReviewAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(function TextReviewAnimatedIcon(props, ref) {
	const [phase] = useAnimatedIconPlayback(ref, TIMELINE);
	const ringMaskId = useSvgMaskId('text-review-ring');
	const checkMaskId = useSvgMaskId('text-review-check');
	const glyph = useMemo(() => getGlyph(ringMaskId, checkMaskId), [ringMaskId, checkMaskId]);

	return (
		<span
			css={[
				animatedStyles.base,
				phase === 'start' && animatedStyles.start,
				phase === 'intermediate' && animatedStyles.ringIntermediate,
				(phase === 'check-intermediate' || phase === 'intermediate') &&
					animatedStyles.checkIntermediate,
			]}
		>
			<Icon
				name="TextReviewIcon"
				dangerouslySetGlyph={glyph}
				isAnimatedIcon
				// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
				{...props}
				size="medium"
			/>
		</span>
	);
});

TextReviewAnimatedIcon.displayName = 'TextReviewIcon';

export default TextReviewAnimatedIcon;
