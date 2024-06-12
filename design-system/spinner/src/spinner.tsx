/** @jsx jsx */
import React, { useContext, useEffect, useLayoutEffect as useRealLayoutEffect } from 'react';

import { css, jsx, keyframes } from '@emotion/react';

import InteractionContext from '@atlaskit/interaction-context';
import { N0, N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { presetSizes } from './constants';
import { type Appearance, type SpinnerProps } from './types';

/**
 * Returns the appropriate circle stroke color.
 */
function getStrokeColor(appearance: Appearance): string {
	return appearance === 'inherit'
		? token('color.icon.subtle', N500)
		: token('color.icon.inverse', N0);
}

const rotate = keyframes({
	to: { transform: 'rotate(360deg)' },
});

const rotateStyles = css({
	animation: `${rotate} 0.86s infinite`,
	animationTimingFunction: 'cubic-bezier(0.4, 0.15, 0.6, 0.85)',
	transformOrigin: 'center',
});

/**
 * There are three parts to the load in animation:
 * 1. Fade in
 * 2. Accelerated spin
 * 3. Stretch the spinner line
 */
const loadIn = keyframes({
	from: {
		transform: 'rotate(50deg)',
		opacity: 0,
		strokeDashoffset: 60,
	},
	to: {
		transform: 'rotate(230deg)',
		opacity: 1,
		strokeDashoffset: 50,
	},
});

const loadInStyles = css({
	animation: `${loadIn} 1s ease-in-out`,
	/**
	 * When the animation completes, stay at the last frame of the animation.
	 */
	animationFillMode: 'forwards',
	/**
	 * We are going to animate this in.
	 */
	opacity: 0,
});

const wrapperStyles = css({
	display: 'inline-flex',
	/**
	 * Align better inline with text.
	 */
	verticalAlign: 'middle',
});

const circleStyles = css({
	fill: 'none',
	strokeDasharray: 60,
	strokeDashoffset: 'inherit',
	strokeLinecap: 'round',
	strokeWidth: 1.5,
	'@media screen and (forced-colors: active)': {
		filter: 'grayscale(100%)',
		stroke: 'CanvasText',
	},
});

/**
 * `useLayoutEffect` is being used in SSR safe form. On the server, this work doesn’t need to run.
 * `useEffect` is used in-place, because `useEffect` is not run on the server and it matches types
 * which makes things simpler than doing an `isServer` check or a `null` check.
 *
 * @see https://hello.atlassian.net/wiki/spaces/DST/pages/2081696628/DSTDACI-010+-+Interaction+Tracing+hooks+in+DS+components
 */
const useLayoutEffect = typeof window === 'undefined' ? useEffect : useRealLayoutEffect;

/**
 * __Spinner__
 *
 * A spinner is an animated spinning icon that lets users know content is being loaded.
 *
 * - [Examples](https://atlassian.design/components/{spinner}/examples)
 * - [Code](https://atlassian.design/components/{spinner}/code)
 * - [Usage](https://atlassian.design/components/{spinner}/usage)
 */
const Spinner = React.memo(
	React.forwardRef<SVGSVGElement, SpinnerProps>(function Spinner(
		{
			appearance = 'inherit',
			delay = 0,
			interactionName,
			label,
			size: providedSize = 'medium',
			testId,
		}: SpinnerProps,
		ref,
	) {
		const size: number =
			typeof providedSize === 'number' ? providedSize : presetSizes[providedSize];

		const animationDelay = `${delay}ms`;

		const stroke = getStrokeColor(appearance);

		const context = useContext(InteractionContext);
		useLayoutEffect(() => {
			if (context != null) {
				return context.hold(interactionName);
			}
		}, [context, interactionName]);

		/**
		 * The Spinner animation uses a combination of two
		 * css animations on two separate elements.
		 */
		return (
			<span
				/**
				 * This span exists to off-load animations from the circle element,
				 * which were causing performance issues (style recalculations)
				 * on Safari and older versions of Chrome.
				 *
				 * This can be removed and styles placed back on the circle element once
				 * Safari fixes this bug and off-loads rendering to the GPU from the CPU.
				 */
				css={[wrapperStyles, rotateStyles]}
				data-testid={testId && `${testId}-wrapper`}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ animationDelay, width: size, height: size }}
			>
				<svg
					height={size}
					width={size}
					viewBox="0 0 16 16"
					xmlns="http://www.w3.org/2000/svg"
					data-testid={testId}
					ref={ref}
					aria-label={label || undefined}
					css={loadInStyles}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					style={{ animationDelay }}
					role={label ? 'img' : 'none'}
				>
					<circle cx="8" cy="8" r="7" css={circleStyles} style={{ stroke }} />
				</svg>
			</span>
		);
	}),
);

export default Spinner;
