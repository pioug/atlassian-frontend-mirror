import React, { forwardRef, type MouseEvent, useCallback } from 'react';

import { useMouseDownEvent } from '../../../state/analytics/useLinkClicked';

import { WrapperAnchor, WrapperSpan } from './styled';

export type ViewType = 'default' | 'unauthorised' | 'errored';

export interface FrameViewProps {
	children?: React.ReactNode;
	className?: string;
	/** A flag that determines whether a card is in hover state in edit mode. */
	isHovered?: boolean;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	link?: string;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/** A flag that determines whether a card is truncated to 1 line */
	truncateInline?: boolean;
	/** A flag that determines the type of view */
	viewType?: ViewType;
	/** A flag that determines whether the card needs a backgorund or not */
	withoutBackground?: boolean;
}

export const Frame = forwardRef<HTMLSpanElement & null, FrameViewProps>((props, ref) => {
	const {
		isSelected,
		children,
		onClick,
		link,
		viewType,
		withoutBackground,
		testId,
		className,
		isHovered,
		truncateInline,
	} = props;

	const handleClick = useCallback(
		(event: MouseEvent) => {
			if (onClick) {
				event.preventDefault();
				event.stopPropagation();
				onClick(event);
			}
		},
		[onClick],
	);

	const handleKeyPress = useCallback(
		(event: React.KeyboardEvent<HTMLAnchorElement>) => {
			if (event.key !== ' ' && event.key !== 'Enter') {
				return;
			}
			if (onClick) {
				event.preventDefault();
				event.stopPropagation();
				onClick(event);
			}
		},
		[onClick],
	);

	const handleMouseDown = useMouseDownEvent();

	const isInteractive = Boolean(onClick);
	const isAnchor = Boolean(link || onClick);

	// Depending on whenever Frame was given onClick or link itself we display span or anchor elements
	const Wrapper = isAnchor ? WrapperAnchor : WrapperSpan;

	return (
		<Wrapper
			href={link}
			withoutBackground={withoutBackground}
			isSelected={isSelected}
			isInteractive={isInteractive}
			tabIndex={isInteractive ? 0 : undefined}
			role={isInteractive ? 'button' : undefined}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			onKeyPress={handleKeyPress}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			ref={ref}
			isHovered={isHovered}
			truncateInline={truncateInline}
			viewType={viewType}
		>
			{children}
		</Wrapper>
	);
});
