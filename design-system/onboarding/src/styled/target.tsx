/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type HTMLAttributes, type ReactNode } from 'react';

import { css, jsx, keyframes } from '@compiled/react';

import { token } from '@atlaskit/tokens';
const reduceMotionAsPerUserPreference = css({
	'@media (prefers-reduced-motion: reduce)': {
		animation: 'none',
		transition: 'none',
	},
});
type BaseProps = React.HTMLAttributes<HTMLDivElement> & {
	bgColor?: string;
	children?: ReactNode;
	className?: string;
	radius?: number;
	testId?: string;
};

type TargetProps = Omit<BaseProps, 'css'> & {
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	pulse?: boolean;
};

// NOTE:
// Pulse color "rgb(101, 84, 192)" derived from "colors.P300"
const baseShadow = `0 0 0 2px ${token('color.border.discovery')}`;

const easing = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
const pulseKeyframes = keyframes({
	'0%, 33%': {
		boxShadow: `${baseShadow}, 0 0 0 ${token('color.border.discovery')}`,
	},
	'66%, 100%': {
		boxShadow: `${baseShadow}, 0 0 0 10px rgba(101, 84, 192, 0.01)`,
	},
});

const animationStyles = css({
	animationDuration: '3000ms',
	animationIterationCount: 'infinite',
	animationName: pulseKeyframes,
	animationTimingFunction: easing,
	// Keep a purple boxshadow on the Pulse component if `prefers-reduced-motion`
	// is applied so we still have a functioning semantic affordance.
	boxShadow: baseShadow,
});

const Base = ({
	bgColor,
	children,
	className,
	radius,
	testId,
	style,
	// The rest of these props are from `HTMLDivElement`
	...props
}: BaseProps) => (
	<div
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={className}
		data-testid={testId}
		style={
			{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Pass-through style is not allowed at the moment
				...style,
				backgroundColor: bgColor,
				borderRadius: radius ? `${radius}px` : undefined,
			} as React.CSSProperties
		}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	>
		{children}
	</div>
);

/**
 * __Target inner__
 *
 * Used to apply spotlight border and pulse to spotlight targets.
 *
 * @internal
 */
export const TargetInner = ({
	bgColor,
	children,
	className,
	pulse,
	radius,
	testId,
	// Thes rest of these are from `HTMLDivElement`
	...props
}: TargetProps) => (
	<Base
		bgColor={bgColor}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={className}
		radius={radius}
		testId={testId}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		css={[pulse && animationStyles, reduceMotionAsPerUserPreference]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={props.style}
	>
		{children}
	</Base>
);

const targetOverlayStyles = css({
	width: '100%',
	height: '100%',
	position: 'absolute',
	insetBlockStart: token('space.0'),
	insetInlineStart: token('space.0'),
});

/**
 * __Target overlay__
 *
 * Overlays a spotlight target, allowing for custom click events that are intended
 * only for onboarding.
 *
 * @internal
 */
export const TargetOverlay = ({ onClick, ...props }: HTMLAttributes<HTMLDivElement>) => (
	// eslint-disable-next-line jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlassian/a11y/click-events-have-key-events
	<div
		onClick={onClick}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		css={targetOverlayStyles}
		style={
			{
				cursor: onClick ? 'pointer' : 'auto',
			} as React.CSSProperties
		}
	/>
);

/**
 * __Spotlight pulse__
 *
 * A spotlight pulse draws attention to a new feature.
 *
 * - [Examples](https://atlassian.design/components/onboarding/examples)
 * - [Code](https://atlassian.design/components/onboarding/code)
 * - [Usage](https://atlassian.design/components/onboarding/usage)
 */
export const Pulse = ({
	bgColor,
	children,
	className,
	radius,
	pulse = true,
	testId,
	...props
}: TargetProps) => (
	<Base
		bgColor={bgColor}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={className}
		radius={radius}
		testId={testId}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		css={[pulse && animationStyles, reduceMotionAsPerUserPreference]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
		style={props.style}
	>
		{children}
	</Base>
);
