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

import { className } from './styled';

export interface ExpandedFrameProps {
	/**
	 * To enable scrolling in use cases where the content will not have it's own scrollbar.
	 *
	 * Requires `setOverflow` to be set to true.
	 *
	 * Always enable this when when the card is not resolved so the connect account button is not hiddden.
	 */
	allowScrollBar?: boolean;
	children?: React.ReactNode;
	/** Component to prompt for competitor link */
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	/** A prop that determines the style of a frame: whether to show it, hide it or only show it when a user hovers over embed */
	frameStyle?: FrameStyle;
	href?: string;
	icon?: React.ReactNode;
	/** If dimensions of the card are to be inherited from the parent */
	inheritDimensions?: boolean;
	isPlaceholder?: boolean;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	maxWidth?: number;
	minWidth?: number;
	/** The optional click handler */
	onClick?: (evt: React.MouseEvent) => void;
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
	/** For testing purposes only */
	testId?: string;
	text?: React.ReactNode;
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
	CompetitorPrompt,
}: ExpandedFrameProps) => {
	const isInteractive = () => !isPlaceholder && (Boolean(href) || Boolean(onClick));
	const handleClick = (event: MouseEvent) => handleClickCommon(event, onClick);
	const handleMouseDown = useMouseDownEvent();

	// Note: cleanup fg based on results of prompt_whiteboard_competitor_link experiment
	const CompetitorPromptComponent =
		CompetitorPrompt && href && fg('prompt_whiteboard_competitor_link_gate') ? (
			<CompetitorPrompt sourceUrl={href} linkType="embed" />
		) : null;

	const renderHeader = () => {
		return (
			frameStyle !== 'hide' && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				<div className="embed-header" css={styles.header}>
					<div css={styles.leftSection}>
						<div css={styles.headerIcon}>{icon}</div>
						<div css={styles.tooltipWrapper}>
							{!isPlaceholder && (
								<Tooltip content={text} hideTooltipOnMouseDown>
									{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
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
					{CompetitorPromptComponent}
				</div>
			)
		);
	};

	const interactive = isInteractive();
	const showBackgroundAlways = frameStyle === 'show' || (isSelected && frameStyle !== 'hide');
	const showBackgroundOnHover = interactive && frameStyle !== 'hide';

	const renderContent = () => {
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
	};

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
			borderRadius: token('radius.xlarge'),
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
		justifyContent: 'space-between',
		font: token('font.heading.xsmall'),
		height: '20px',
		gap: token('space.050'),
		zIndex: 1,
	},
	leftSection: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
		minWidth: 0,
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
		borderRadius: token('radius.small'),
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
