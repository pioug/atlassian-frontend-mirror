/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import Tooltip, { TooltipPrimitive, type TooltipPrimitiveProps } from '@atlaskit/tooltip';

const styles = cssMap({
	root: {
		backgroundColor: token('elevation.surface'),
		borderRadius: token('radius.small'),
		boxShadow: token('elevation.shadow.overlay'),
		color: token('color.text'),
		maxHeight: '300px',
		maxWidth: '300px',
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInlineStart: token('space.150'),
		paddingInlineEnd: token('space.150'),
	},
});

const CustomTooltip: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TooltipPrimitiveProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(function CustomTooltip(
	{ children, className, ...rest },
	ref,
) {
	return (
		<TooltipPrimitive
			{...rest}
			// Manually passing on `className` so it gets merged correctly in the build output.
			// The passed classname is mostly used for integration testing (`.Tooltip`)
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			// "css" does not "exist" - it gets transformed into "className" by compiled
			css={styles.root}
			ref={ref}
		>
			{children}
		</TooltipPrimitive>
	);
});

export default function TooltipComponentPropExample() {
	return (
		<Tooltip component={CustomTooltip} content="This is a customized tooltip">
			{(tooltipProps) => <Button {...tooltipProps}>Hover or keyboard focus on me</Button>}
		</Tooltip>
	);
}
