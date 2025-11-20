import React from 'react';
import { Wrapper } from './styled';

export interface FrameViewProps {
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	isError?: boolean;
	isInteractive?: boolean;
	children?: React.ReactNode;
	/** The optional click handler */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	innerRef?: React.Ref<HTMLSpanElement>;
}

export class Frame extends React.Component<FrameViewProps> {
	handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		const { onClick } = this.props;
		if (onClick) {
			event.preventDefault();
			event.stopPropagation();
			onClick(event);
		}
	};

	handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key !== ' ' && event.key !== 'Enter') {
			return;
		}
		const { onClick } = this.props;
		if (onClick) {
			event.preventDefault();
			event.stopPropagation();
			onClick(event);
		}
	};

	render(): React.JSX.Element {
		const { isSelected, children, onClick, innerRef, testId, isError } = this.props;
		const isInteractive = Boolean(onClick);

		return (
			<Wrapper
				ref={innerRef}
				isSelected={isSelected}
				isError={isError}
				tabIndex={isInteractive ? 0 : undefined}
				role={isInteractive ? 'button' : undefined}
				onClick={this.handleClick}
				onKeyPress={this.handleKeyPress}
				data-testid={testId}
			>
				{children}
			</Wrapper>
		);
	}
}
