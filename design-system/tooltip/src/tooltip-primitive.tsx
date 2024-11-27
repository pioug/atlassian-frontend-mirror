/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { layers } from '@atlaskit/theme/constants';

import { type PositionType } from './types';

export interface TooltipPrimitiveProps {
	truncate?: boolean;
	style?: CSSProperties;
	className?: string;
	children: ReactNode;
	testId?: string;
	placement: PositionType;
	ref: React.Ref<any>;
	onMouseOver?: (e: React.MouseEvent<HTMLElement>) => void;
	onMouseOut?: (e: React.MouseEvent<HTMLElement>) => void;
	id?: string;
}

const VAR_PRIMITIVE_ZINDEX = 'tooltipPrimitiveZindex';

const primitiveStyles = css({
	zindex: `var(${VAR_PRIMITIVE_ZINDEX})`,
	cursor: `default`,
});

/**
 * The lower level component for rendering a tooltip.
 */
const TooltipPrimitive = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(
	function TooltipPrimitive(
		{ style, className, children, placement, testId, onMouseOut, onMouseOver, id },
		ref,
	) {
		const styleWithZIndex = {
			...style,
			[VAR_PRIMITIVE_ZINDEX]: layers.tooltip(),
		};
		return (
			<div
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={styleWithZIndex}
				data-testid={testId ? `${testId}--wrapper` : undefined}
			>
				{/* Re: non-interactive element interactions: Because we are creating a tooltip, we *need* these mouse handlers. */}
				{/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
				<div
					role="tooltip"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={className}
					// Because the tooltip should not be focusable, there is no reason to have key events.
					/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */
					onMouseOut={onMouseOut}
					/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */
					onMouseOver={onMouseOver}
					css={primitiveStyles}
					data-placement={placement}
					data-testid={testId}
					id={id}
				>
					{children}
				</div>
			</div>
		);
	},
);

TooltipPrimitive.displayName = 'TooltipPrimitive';

export default TooltipPrimitive;
