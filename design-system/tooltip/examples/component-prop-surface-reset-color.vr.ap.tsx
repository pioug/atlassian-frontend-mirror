/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';
import TooltipPrimitive, { type TooltipPrimitiveProps } from '@atlaskit/tooltip/TooltipPrimitive';

const styles = cssMap({
	// A red ancestor region. Under `platform-dst-top-layer-tooltip` the tooltip
	// host is a DOM sibling of the trigger, so it inherits from this region. This
	// red `color` is what leaks in if the host takes the trigger's colour.
	region: {
		color: token('color.text.danger'),
		backgroundColor: token('color.background.danger'),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		minHeight: '160px',
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.1000'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.1000'),
	},
	// Deliberately sets no `color`, like townsquare `MetricHovercard`. The
	// background and padding are only for legibility.
	tooltip: {
		backgroundColor: token('elevation.surface.overlay'),
		paddingBlockStart: token('space.100'),
		paddingInlineEnd: token('space.150'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.150'),
	},
});

/**
 * Gemini VR compares pixels with Playwright's default threshold (0.2), which
 * cannot tell UA `CanvasText` (#000000) from `color.text` (#292A2E). Setting
 * `--ds-text` to vivid blue (#0055FF) on the region makes the expected colour
 * differ from black and from the region red (`color.text.danger`, #AE2E24).
 * The host's `color: var(--ds-text)` resolves at the host, which inherits this
 * value. It beats the theme value, which is only set on `html`.
 */
const vividTextStyle = { '--ds-text': '#0055FF' } as CSSProperties;

const UncolouredTooltip: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TooltipPrimitiveProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(function UncolouredTooltip(
	{ children, className, ...rest },
	ref,
) {
	return (
		<TooltipPrimitive
			{...rest}
			// Manually passing on `className` so it gets merged correctly in the build output.
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop -- same pattern as `component-prop.vr.ap.tsx`
			className={className}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides -- a custom `component` that sets no colour is what this VR guards
			css={styles.tooltip}
			ref={ref}
		>
			{children}
		</TooltipPrimitive>
	);
});

/**
 * Baseline for the top-layer host `color` reset with a custom tooltip
 * `component` that sets no colour.
 *
 * Expected: the tooltip text is vivid blue (#0055FF).
 *
 * - Black text means the UA `[popover]` `color: CanvasText` came back.
 * - Red text means the region colour leaked into the tooltip.
 */
export default function TooltipComponentPropSurfaceResetColorExample(): JSX.Element {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- overrides a token variable for the VR, see `vividTextStyle`
		<div css={styles.region} style={vividTextStyle}>
			<Tooltip component={UncolouredTooltip} content="Tooltip text is blue" delay={0}>
				{(tooltipProps) => <Button {...tooltipProps}>Hover over me</Button>}
			</Tooltip>
		</div>
	);
}
