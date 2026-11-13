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

// Pencil will rotate (0 to -24deg) from 0-200ms and hold until 400ms
// Star will scale (1 to 0.5) from 200ms-400ms
// Exit duration is 250ms to return to original state
const TIMELINE = [{ phase: 'interaction', durationMs: 400 }] as const;

const animatedStyles = cssMap({
	base: {
		'& [data-anim]': {
			transitionProperty: 'transform',
			transitionTimingFunction: 'cubic-bezier(0.42, 0, 0.58, 1)',
			transitionDuration: '250ms',
		},
		'& [data-anim="pencil"]': {
			transform: 'rotate(0deg)',
		},
		'& [data-anim="star"]': {
			transform: 'scale(1)',
		},
	},
	interaction: {
		'& [data-anim="pencil"]': {
			transform: 'rotate(-24deg)',
			transitionDuration: '200ms',
		},
		'& [data-anim="star"]': {
			transform: 'scale(0.5)',
			transitionDelay: '200ms',
			transitionDuration: '200ms',
		},
	},
});

const glyph = `
	<path
		data-anim="star"
		d="M12.617 9.011a.75.75 0 0 1 .588.483l.615 1.687 1.687.615a.75.75 0 0 1 0 1.41l-1.687.615-.615 1.686a.75.75 0 0 1-1.409 0l-.616-1.686-1.686-.616a.75.75 0 0 1 0-1.409l1.686-.615.616-1.687.048-.106A.75.75 0 0 1 12.5 9z"
		fill="currentColor"
		style="transform-origin: 12.5px 12.5px;"
	/>
	<path
		data-anim="pencil"
		d="M9.337.604a2 2 0 0 1 2.828 0l1.233 1.232a2 2 0 0 1 0 2.828l-8.1 8.099a2 2 0 0 1-1.022.547l-3.378.676a.75.75 0 0 1-.883-.883l.676-3.38a2 2 0 0 1 .546-1.02zm-7.04 9.159a.5.5 0 0 0-.136.256l-.456 2.275 2.278-.455a.5.5 0 0 0 .254-.137l6.078-6.078-1.94-1.94zm8.808-8.099a.5.5 0 0 0-.707 0l-.961.961 1.94 1.94.96-.961a.5.5 0 0 0 0-.707z"
		fill="currentColor"
		fill-rule="evenodd"
		clip-rule="evenodd"
		style="transform-origin: 12.5px 12.5px;"
	/>`;
/**
 * Animated AI write icon: the pencil tilts and the star shrinks.
 */
const AiGenerativeTextAnimatedIcon: ForwardRefExoticComponent<
	AnimatedIconProps & RefAttributes<AnimatedIconRef>
> = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	function AiGenerativeTextAnimatedIcon(props, ref) {
		const [phase] = useAnimatedIconPlayback(ref, TIMELINE);

		return (
			<span css={[animatedStyles.base, phase === 'interaction' && animatedStyles.interaction]}>
				<Icon
					name="AiGenerativeTextIcon"
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

AiGenerativeTextAnimatedIcon.displayName = 'AiGenerativeTextIcon';

export default AiGenerativeTextAnimatedIcon;
