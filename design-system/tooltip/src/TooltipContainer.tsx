/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N0, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import TooltipPrimitive, { type TooltipPrimitiveProps } from './TooltipPrimitive';

export interface TooltipContainerProps extends TooltipPrimitiveProps {}

const baseStyles = css({
	boxSizing: 'border-box',
	maxWidth: '240px',
	padding: `${token('space.025', '2px')} ${token('space.075', '6px')}`,
	insetBlockStart: token('space.0', '0px'),
	insetInlineStart: token('space.0', '0px'),
	borderRadius: token('border.radius', '3px'),
	font: token('font.body.UNSAFE_small'),
	overflowWrap: 'break-word',
	wordWrap: 'break-word',
	backgroundColor: token('color.background.neutral.bold', N800),
	color: token('color.text.inverse', N0),
});

const truncateStyles = css({
	maxWidth: '420px',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(
	function TooltipContainer(
		{ style, className, children, truncate, placement, testId, onMouseOut, onMouseOver, id },
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
				css={[baseStyles, truncate ? truncateStyles : null]}
			>
				{children}
			</TooltipPrimitive>
		);
	},
);

TooltipContainer.displayName = 'TooltipContainer';

export default TooltipContainer;
