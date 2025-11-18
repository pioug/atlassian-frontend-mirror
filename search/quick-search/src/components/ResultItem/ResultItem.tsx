import React from 'react';
import { LinkItem } from '@atlaskit/menu';

import {
	ResultItemAfter,
	ResultItemAfterWrapper,
	ResultItemCaption,
	ResultItemIcon,
	ResultItemTextAfter,
	ResultItemSubText,
} from './styled';

type Props = {
	/** Text to appear to the right of the text. It has a lower font-weight. */
	caption?: string;
	/** Location to link out to on click. This is passed down to the custom link component if one is provided. */
	href?: string;
	/** Target frame for item `href` link to be aimed at. */
	target?: string;
	/** React element to appear to the left of the text. This should be an @atlaskit/icon component. */
	icon?: React.ReactNode;
	/** Set whether the item should be highlighted as selected. Selected items have a different background color. */
	isSelected?: boolean;
	/** Set whether the item has been highlighted using mouse navigation. Mouse selected items will not display the selectedIcon. */
	isMouseSelected?: boolean;
	/** Function to be called on click. This is passed down to a custom link component, if one is provided.  */
	onClick?(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>): void;
	/** Text to be shown alongside the main `text`. */
	subText?: React.ReactNode;
	/** Main text to be displayed as the item. Accepts a react component but in most cases this should just be a string. */
	text?: React.ReactNode;
	/** React component to be placed to the right of the main text. */
	textAfter?: React.ReactNode;
	/** React component to be placed to the right of the main text when the item is selected with keyboard navigation. */
	selectedIcon?: React.ReactNode;
};

class ResultItem extends React.PureComponent<Props> {
	static defaultProps: Partial<Props> = {
		isSelected: false,
		isMouseSelected: false,
	};

	render(): React.JSX.Element {
		const icon = this.props.icon ? <ResultItemIcon>{this.props.icon}</ResultItemIcon> : null;

		const textAfter = this.props.textAfter ? (
			<ResultItemTextAfter>{this.props.textAfter}</ResultItemTextAfter>
		) : null;
		const after =
			this.props.textAfter || this.props.selectedIcon ? (
				<ResultItemAfterWrapper>
					<ResultItemAfter shouldTakeSpace={!!this.props.textAfter}>
						{textAfter}
						{this.props.isSelected && !this.props.isMouseSelected ? this.props.selectedIcon : null}
					</ResultItemAfter>
				</ResultItemAfterWrapper>
			) : null;

		const wrappedCaption = this.props.caption ? (
			<ResultItemCaption>{this.props.caption}</ResultItemCaption>
		) : null;

		const wrappedSubText = this.props.subText ? (
			<ResultItemSubText>{this.props.subText}</ResultItemSubText>
		) : null;

		const interactiveWrapperProps = {
			onClick: this.props.onClick,
			href: this.props.href,
		};

		return (
			<LinkItem
				iconBefore={icon}
				iconAfter={after}
				description={wrappedSubText || undefined}
				isSelected={this.props.isSelected}
				target={this.props.target}
				{...interactiveWrapperProps}
			>
				{this.props.text}
				{wrappedCaption}
			</LinkItem>
		);
	}
}

export default ResultItem;
