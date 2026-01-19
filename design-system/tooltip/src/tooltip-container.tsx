/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import TooltipPrimitive, { type TooltipPrimitiveProps } from './tooltip-primitive';

export interface TooltipContainerProps extends TooltipPrimitiveProps {}

const styles = cssMap({
	base: {
		boxSizing: 'border-box',
		maxWidth: '240px',
		backgroundColor: token('color.background.neutral.bold', '#172B4D'),
		borderRadius: token('radius.small', '3px'),
		color: token('color.text.inverse', '#FFFFFF'),
		font: token('font.body.small'),
		insetBlockStart: token('space.0', '0px'),
		insetInlineStart: token('space.0', '0px'),
		overflowWrap: 'break-word',
		paddingBlockStart: token('space.050', '4px'),
		paddingBlockEnd: token('space.050', '4px'),
		paddingInlineEnd: token('space.075', '6px'),
		paddingInlineStart: token('space.075', '6px'),
		wordWrap: 'break-word',
	},
	truncate: {
		maxWidth: '420px',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
});

/**
 * Used as the default tooltip container component for the exported `Tooltip` component.
 * Adds some styles to the tooltip primitive.
 */
const TooltipContainer: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<TooltipContainerProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TooltipContainerProps>(function TooltipContainer(
	{
		style,
		className,
		children,
		truncate,
		placement,
		testId,
		onMouseOut,
		onMouseOver,
		id,
		shortcut,
	},
	ref,
) {
	return (
		<TooltipPrimitive
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			placement={placement}
			testId={testId}
			id={id}
			onMouseOut={onMouseOut}
			onMouseOver={onMouseOver}
			shortcut={shortcut}
			css={[styles.base, truncate && styles.truncate]}
		>
			{children}
		</TooltipPrimitive>
	);
});

TooltipContainer.displayName = 'TooltipContainer';

export default TooltipContainer;
