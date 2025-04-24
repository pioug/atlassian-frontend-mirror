/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../state/analytics/useLinkClicked';
import { handleClickCommon } from '../../common/utils';
import { type FrameStyle } from '../types';

import {
	className,
	ContentOldVisualRefresh,
	HeaderOldVisualRefresh,
	IconWrapperOldVisualRefresh,
	LinkWrapperOldVisualRefresh,
	TextWrapperOldVisualRefresh,
	TooltipWrapperOldVisualRefresh,
	WrapperOldVisualRefresh,
} from './styled';

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

export const ExpandedFrame = ({
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
		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				frameStyle !== 'hide' && ( // eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					<div className="embed-header" css={styles.header}>
						<div css={styles.headerIcon}>{icon}</div>
						<div css={styles.tooltipWrapper}>
							{!isPlaceholder && (
								<Tooltip content={text} hideTooltipOnMouseDown>
									<a
										css={styles.headerAnchor}
										href={href}
										onClick={handleClick}
										onMouseDown={handleMouseDown}
									>
										{text}
									</a>
								</Tooltip>
							)}
						</div>
					</div>
				)
			);
		}

		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<HeaderOldVisualRefresh className="embed-header" frameStyle={frameStyle}>
				<IconWrapperOldVisualRefresh isPlaceholder={isPlaceholder}>
					{!isPlaceholder && icon}
				</IconWrapperOldVisualRefresh>
				<TooltipWrapperOldVisualRefresh>
					<Tooltip content={text} hideTooltipOnMouseDown>
						<TextWrapperOldVisualRefresh isPlaceholder={isPlaceholder}>
							{!isPlaceholder && (
								<a href={href} onClick={handleClick} onMouseDown={handleMouseDown}>
									{text}
								</a>
							)}
						</TextWrapperOldVisualRefresh>
					</Tooltip>
				</TooltipWrapperOldVisualRefresh>
			</HeaderOldVisualRefresh>
		);
	};

	const interactive = isInteractive();
	const showBackgroundAlways = frameStyle === 'show' || (isSelected && frameStyle !== 'hide');
	const showBackgroundOnHover = interactive && frameStyle !== 'hide';

	const renderContent = () => {
		if (fg('platform-linking-visual-refresh-v1')) {
			return (
				<div
					data-testid="embed-content-wrapper"
					css={[
						styles.contentStyle,
						setOverflow && allowScrollBar && styles.contentOverflowAuto,
						interactive &&
							!showBackgroundAlways &&
							!showBackgroundOnHover &&
							styles.contentInteractiveActiveBorder,
					]}
					// This fixes an issue with input fields in cross domain iframes (ie. databases and jira fields from different domains)
					// See: HOT-107830
					contentEditable={false}
				>
					{children}
				</div>
			);
		}

		return (
			<ContentOldVisualRefresh
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
			</ContentOldVisualRefresh>
		);
	};

	if (fg('platform-linking-visual-refresh-v1')) {
		return (
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={className}
				style={{
					minWidth: minWidth ? `${minWidth}px` : '',
					maxWidth: maxWidth ? `${maxWidth}px` : '',
				}}
				css={[
					styles.linkWrapper,
					inheritDimensions && styles.linkWrapperInheritDimensions,
					isSelected && frameStyle !== 'hide' && styles.linkWrapperSelected,
					showBackgroundAlways && styles.linkWrapperBorderAndBackground,
					showBackgroundOnHover && !showBackgroundAlways && styles.linkWrapperInteractiveNotHidden,
				]}
				data-testid={testId}
				data-trello-do-not-use-override={testId}
				// Due to limitations of testing library, we can't assert ::after
				data-is-selected={isSelected}
				{...((isPlaceholder || !href) && {
					'data-wrapper-type': 'default',
					'data-is-interactive': isInteractive(),
				})}
			>
				{renderHeader()}
				{renderContent()}
			</div>
		);
	}

	if (!isPlaceholder && href) {
		return (
			<LinkWrapperOldVisualRefresh
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
			</LinkWrapperOldVisualRefresh>
		);
	} else {
		return (
			<WrapperOldVisualRefresh
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
			</WrapperOldVisualRefresh>
		);
	}
};

const styles = cssMap({
	linkWrapper: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		height: '432px',
		paddingTop: token('space.100', '8px'),
		paddingRight: token('space.100', '8px'),
		paddingBottom: token('space.100', '8px'),
		paddingLeft: token('space.100', '8px'),
		userSelect: 'none',
		'&::after': {
			content: '',
			position: 'absolute',
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			transition: `background 0.3s, box-shadow 0.3s`,
			backgroundColor: 'transparent',
			borderRadius: '12px',
			zIndex: 0,
			flexGrow: 0,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.embed-header': {
			opacity: 0,
		},
	},
	linkWrapperInheritDimensions: {
		height: '100%',
	},
	linkWrapperSelected: {
		'&::after': {
			boxShadow: `0 0 0 3px ${token('color.border.selected')}`,
		},
	},
	linkWrapperBorderAndBackground: {
		'&::after': {
			backgroundColor: token('elevation.surface.raised'),
			outline: `1px solid ${token('color.border')}`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'.embed-header': {
			opacity: 1,
		},
	},
	linkWrapperInteractiveNotHidden: {
		'&:hover': {
			'&::after': {
				backgroundColor: token('elevation.surface.raised'),
				outline: `1px solid ${token('color.border')}`,
			},
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'.embed-header': {
				opacity: 1,
			},
		},
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		font: token('font.heading.xsmall'),
		height: '20px',
		gap: token('space.050'),
		zIndex: 1,
	},
	tooltipWrapper: {
		overflow: 'hidden',
	},
	headerAnchor: {
		font: token('font.heading.xsmall'),
		display: 'block',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		'&:hover': {
			textDecoration: 'none',
		},
	},
	headerIcon: {
		font: token('font.heading.xsmall'),
		width: '16px',
		height: '16px',
	},
	contentStyle: {
		border: `solid 1px ${token('color.border')}`,
		borderRadius: '4px',
		backgroundColor: token('elevation.surface.raised'),
		flexGrow: 1,
		overflow: 'hidden',
		height: '100%',
		transition: 'outline 0.3s',
		zIndex: 1,
	},
	contentInteractiveActiveBorder: {
		'&:active': {
			outline: `8px solid ${token('color.background.selected')}`,
		},
	},
	contentOverflowAuto: {
		overflow: 'auto',
	},
});
