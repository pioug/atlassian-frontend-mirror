/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { type HTMLAttributes, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx, keyframes } from '@emotion/react';

import { reduceMotionAsPerUserPreference } from '@atlaskit/motion';
import { P300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type BaseProps = React.HTMLAttributes<HTMLDivElement> & {
	bgColor?: string;
	radius?: number;
	className?: string;
	testId?: string;
	children?: ReactNode;
};

type TargetProps = Omit<BaseProps, 'css'> & {
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	pulse?: boolean;
	testId?: string;
};

// NOTE:
// Pulse color "rgb(101, 84, 192)" derived from "colors.P300"
const baseShadow = `0 0 0 2px ${token('color.border.discovery', P300)}`;

const easing = 'cubic-bezier(0.55, 0.055, 0.675, 0.19)';
const pulseKeyframes = keyframes({
	'0%, 33%': {
		boxShadow: `${baseShadow}, 0 0 0 ${token('color.border.discovery', 'rgba(101, 84, 192, 1)')}`,
	},
	'66%, 100%': {
		boxShadow: `${baseShadow}, 0 0 0 10px rgba(101, 84, 192, 0.01)`,
	},
});
// This is needed for unit tests
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const pulseKeyframesName = pulseKeyframes.name;
const animationStyles = css({
	animation: `${pulseKeyframes} 3000ms ${easing} infinite`,
	// Keep a purple boxshadow on the Pulse component if `prefers-reduced-motion`
	// is applied so we still have a functioning semantic affordance.
	boxShadow: baseShadow,
});

const Base = ({ children, bgColor, radius, style, testId, ...props }: BaseProps) => (
	<div
		data-testid={testId}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={
			{
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
export const TargetInner = ({ children, pulse, ...props }: TargetProps) => (
	<Base
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		css={[pulse && animationStyles, reduceMotionAsPerUserPreference]}
	>
		{children}
	</Base>
);

const targetOverlayStyles = css({
	width: '100%',
	height: '100%',
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	insetBlockStart: 0,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	insetInlineStart: 0,
});

/**
 * __Target overlay__
 *
 * Overlays a spotlight target, allowing for custom click events that are intended
 * only for onboarding.
 *
 * @internal
 */
export const TargetOverlay = (props: HTMLAttributes<HTMLDivElement>) => (
	<div
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		css={targetOverlayStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={
			{
				cursor: props.onClick ? 'pointer' : 'auto',
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
export const Pulse = ({ children, pulse = true, testId, ...props }: TargetProps) => (
	<Base
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		css={[
			pulse && animationStyles,
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			reduceMotionAsPerUserPreference,
		]}
		testId={testId}
	>
		{children}
	</Base>
);
