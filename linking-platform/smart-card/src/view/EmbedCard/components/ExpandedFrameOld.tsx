/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent } from 'react';

import { jsx } from '@compiled/react';

import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../state/analytics/useLinkClicked';
import { handleClickCommon } from '../../common/utils';
import { type FrameStyle } from '../types';

import {
	className,
	Content,
	Header,
	IconWrapper,
	LinkWrapper,
	TextWrapper,
	TooltipWrapper,
	Wrapper,
} from './styledOld';

export interface ExpandedFrameProps {
	isPlaceholder?: boolean;
	href?: string;
	icon?: React.ReactNode;
	text?: React.ReactNode;
	minWidth?: number;
	maxWidth?: number;
	children?: React.ReactNode;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/** A prop that determines the style of a frame: whether to show it, hide it or only show it when a user hovers over embed */
	frameStyle?: FrameStyle;
	/** The optional click handler */
	onClick?: (evt: React.MouseEvent) => void;
	/** For testing purposes only */
	testId?: string;
	/** If dimensions of the card are to be inherited from the parent */
	inheritDimensions?: boolean;
	/**
	 * To enable scrolling in use cases where the content will not have it's own scrollbar.
	 *
	 * Requires `setOverflow` to be set to true.
	 *
	 * Always enable this when when the card is not resolved so the connect account button is not hiddden.
	 */
	allowScrollBar?: boolean;
	/**
	 * Should the CSS `overflow` property be set to hidden or auto (clipping or
	 * supporting a scroll bar), or left out altogether.
	 *
	 * Set to true when embed is unresolved to prevent account connection button being unreachable.
	 *
	 * Set to false when the card is resolved to mitigate blurry embed card issue (EDM-7188).
	 * @default true
	 */
	setOverflow?: boolean;
}

export const ExpandedFrameOld = ({
	isPlaceholder = false,
	children,
	onClick,
	icon,
	text,
	isSelected,
	frameStyle = 'showOnHover',
	href,
	minWidth,
	maxWidth,
	testId = 'expanded-frame',
	inheritDimensions,
	allowScrollBar = false,
	setOverflow = true,
}: ExpandedFrameProps) => {
	const isInteractive = () => !isPlaceholder && (Boolean(href) || Boolean(onClick));
	const handleClick = (event: MouseEvent) => handleClickCommon(event, onClick);
	const handleMouseDown = useMouseDownEvent();

	const renderHeader = () => {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<Header className="embed-header" frameStyle={frameStyle}>
				<IconWrapper isPlaceholder={isPlaceholder}>{!isPlaceholder && icon}</IconWrapper>
				<TooltipWrapper>
					<Tooltip content={text} hideTooltipOnMouseDown>
						<TextWrapper isPlaceholder={isPlaceholder}>
							{!isPlaceholder && (
								<a href={href} onClick={handleClick} onMouseDown={handleMouseDown}>
									{text}
								</a>
							)}
						</TextWrapper>
					</Tooltip>
				</TooltipWrapper>
			</Header>
		);
	};

	const renderContent = () => {
		return (
			<Content
				data-testid="embed-content-wrapper"
				allowScrollBar={allowScrollBar}
				removeOverflow={!setOverflow}
				isInteractive={isInteractive()}
				frameStyle={frameStyle}
				// This fixes an issue with input fields in cross domain iframes (ie. databases and jira fields from different domains)
				// See: HOT-107830
				contentEditable={'false'}
				suppressContentEditableWarning={true}
			>
				{children}
			</Content>
		);
	};
	if (!isPlaceholder && href) {
		return (
			<LinkWrapper
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				isInteractive={isInteractive()}
				isSelected={isSelected}
				frameStyle={frameStyle}
				minWidth={minWidth}
				maxWidth={maxWidth}
				data-testid={testId}
				data-trello-do-not-use-override={testId}
				// Due to limitations of testing library, we can't assert ::after
				data-is-selected={isSelected}
				inheritDimensions={inheritDimensions}
			>
				{renderHeader()}
				{renderContent()}
			</LinkWrapper>
		);
	} else {
		return (
			<Wrapper
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				isInteractive={isInteractive()}
				isSelected={isSelected}
				minWidth={minWidth}
				frameStyle={frameStyle}
				maxWidth={maxWidth}
				data-testid={testId}
				data-trello-do-not-use-override={testId}
				data-is-selected={isSelected}
				data-wrapper-type="default"
				data-is-interactive={isInteractive()}
			>
				{renderHeader()}
				{renderContent()}
			</Wrapper>
		);
	}
};
