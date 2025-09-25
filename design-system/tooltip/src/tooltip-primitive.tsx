/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';

import { TooltipShortcut } from './tooltip-shortcut';
import { type PositionType } from './types';

export interface TooltipPrimitiveProps {
	truncate?: boolean;
	style?: CSSProperties;
	className?: string;
	children: ReactNode;
	testId?: string;
	placement: PositionType;
	ref?: React.Ref<HTMLDivElement>;
	onMouseOver?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onMouseOut?: (e: React.MouseEvent<HTMLDivElement>) => void;
	id?: string;
	shortcut?: string[];
}

const primitiveStyles = css({
	cursor: `default`,
});

/**
 * The lower level component for rendering a tooltip.
 */
const TooltipPrimitive = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(
	function TooltipPrimitive(
		{ style, className, children, placement, testId, onMouseOut, onMouseOver, id, shortcut },
		ref,
	) {
		return (
			<div
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={style}
				data-testid={testId ? `${testId}--wrapper` : undefined}
			>
				{/* Re: non-interactive element interactions: Because we are creating a tooltip, we *need* these mouse handlers. */}
				{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
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
					{shortcut && fg('platform-dst-tooltip-shortcuts') && (
						<TooltipShortcut shortcut={shortcut} />
					)}
				</div>
			</div>
		);
	},
);

TooltipPrimitive.displayName = 'TooltipPrimitive';

export default TooltipPrimitive;
