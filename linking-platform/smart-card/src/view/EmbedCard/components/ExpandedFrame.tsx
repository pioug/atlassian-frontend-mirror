/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type MouseEvent, useRef } from 'react';

// eslint-disable-next-line no-unused-vars
import { cssMap, jsx } from '@compiled/react';

import { cssMap as cssMapFromADS } from '@atlaskit/css';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { useMouseDownEvent } from '../../../state/analytics/useMouseDownEvent';
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
	/** Optional middle-click handler. */
	onAuxClick?: React.EventHandler<React.MouseEvent>;
	/** The optional click handler */
	onClick?: (evt: React.MouseEvent) => void;
	/** Callback for when mouse enters the content wrapper - for dwell tracking */
	onContentMouseEnter?: () => void;
	/** Callback for when mouse leaves the content wrapper - for dwell tracking */
	onContentMouseLeave?: () => void;
	/** Optional right-click handler. */
	onContextMenu?: React.EventHandler<React.MouseEvent>;
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

const styles = cssMap({
	linkWrapper: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		height: '432px',
		paddingTop: token('space.100'),
		paddingRight: token('space.100'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.100'),
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
			outline: `${token('border.width')} solid ${token('color.border')}`,
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
				outline: `${token('border.width')} solid ${token('color.border')}`,
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
		border: `solid ${token('border.width')} ${token('color.border')}`,
		borderRadius: token('radius.large', '4px'),
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

const navigationStyles = cssMapFromADS({
	headerAnchor: {
		cursor: 'pointer',
		// The header's stacking context keeps the link below controls and embedded content.
		'&::after': {
			content: '',
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			zIndex: -1,
		},
	},
});

export const ExpandedFrame = ({
	isPlaceholder = false,
	children,
	onClick,
	onAuxClick,
	onContextMenu,
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
	onContentMouseEnter,
	onContentMouseLeave,
}: ExpandedFrameProps): React.JSX.Element => {
	const headerRef = useRef<HTMLDivElement>(null);
	const headerAnchorRef = useRef<HTMLAnchorElement>(null);
	const isInteractive = () => !isPlaceholder && (Boolean(href) || Boolean(onClick));
	const isEmbedOpenInNewTabEnabled = isExperimentEnabled('platform_editor_embed_open_in_new_tab');
	const isModifierNavigationClick = (event: MouseEvent) =>
		isEmbedOpenInNewTabEnabled &&
		frameStyle !== 'hide' &&
		!isPlaceholder &&
		Boolean(href) &&
		((event.button === 0 && (event.metaKey || event.ctrlKey)) || event.button === 1);
	const isUnmodifiedPrimaryDoubleClick = (event: MouseEvent) =>
		isEmbedOpenInNewTabEnabled &&
		frameStyle !== 'hide' &&
		!isPlaceholder &&
		Boolean(href) &&
		event.type === 'dblclick' &&
		event.button === 0 &&
		event.detail === 2 &&
		!event.metaKey &&
		!event.ctrlKey &&
		!event.shiftKey &&
		!event.altKey;
	const handleClick = (event: MouseEvent) => {
		if (isModifierNavigationClick(event)) {
			// CardWithUrl must see the uncancelled event so it can respect consumer preventDefault.
			event.stopPropagation();
			onClick?.(event);
			return;
		}

		handleClickCommon(event, onClick);
	};
	const isHeaderAnchorTarget = (target: EventTarget | null) =>
		target instanceof Node && Boolean(headerAnchorRef.current?.contains(target));
	const isChromeTarget = (event: MouseEvent<HTMLDivElement>): boolean => {
		const { target } = event;
		if (!(target instanceof Element)) {
			return false;
		}

		const isInHeader = headerRef.current?.contains(target) ?? false;
		const isFrameChrome = target === event.currentTarget;
		if (!isInHeader && !isFrameChrome) {
			return false;
		}

		const interactiveAncestor = target.closest(
			'a, button, input, select, textarea, [role="button"], [role="link"], [contenteditable="true"], [tabindex]',
		);
		const isHeaderControl = interactiveAncestor && headerRef.current?.contains(interactiveAncestor);
		return !isHeaderControl || interactiveAncestor === headerAnchorRef.current;
	};
	const handleChromeMouseDownCapture = (event: MouseEvent<HTMLDivElement>) => {
		if (isModifierNavigationClick(event) && isChromeTarget(event)) {
			if (event.button === 1 && !isHeaderAnchorTarget(event.target)) {
				// Non-link middle presses otherwise trigger autoscroll or clipboard paste.
				event.preventDefault();
			}
			event.stopPropagation();
		}
	};
	const handleChromeNavigationEvent = (event: MouseEvent<HTMLDivElement>) => {
		if (
			isModifierNavigationClick(event) &&
			!isHeaderAnchorTarget(event.target) &&
			isChromeTarget(event)
		) {
			handleClick(event);
		}
	};
	const handleChromeDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
		if (isUnmodifiedPrimaryDoubleClick(event) && isChromeTarget(event)) {
			event.stopPropagation();
			onClick?.(event);
		}
	};
	const handleMouseDown = useMouseDownEvent();

	const CompetitorPromptComponent =
		CompetitorPrompt && href ? <CompetitorPrompt sourceUrl={href} linkType="embed" /> : null;

	const renderHeader = () => {
		return (
			frameStyle !== 'hide' && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				<div ref={headerRef} className="embed-header" css={styles.header}>
					<div css={styles.leftSection}>
						<div css={styles.headerIcon}>{icon}</div>
						<div css={styles.tooltipWrapper}>
							{!isPlaceholder && (
								<Tooltip content={text} hideTooltipOnMouseDown>
									{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
									<a
										ref={headerAnchorRef}
										css={[
											styles.headerAnchor,
											isEmbedOpenInNewTabEnabled && Boolean(href) && navigationStyles.headerAnchor,
										]}
										href={href}
										onClick={handleClick}
										onAuxClick={onAuxClick}
										onContextMenu={onContextMenu}
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
				onMouseEnter={onContentMouseEnter}
				onMouseLeave={onContentMouseLeave}
				onFocus={onContentMouseEnter}
				onBlur={onContentMouseLeave}
			>
				{children}
			</div>
		);
	};

	return (
		// Chrome gestures supplement the native header link without making the frame another control.
		<div
			role="none"
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
			onMouseDownCapture={handleChromeMouseDownCapture}
			onClick={handleChromeNavigationEvent}
			onAuxClick={handleChromeNavigationEvent}
			onDoubleClick={handleChromeDoubleClick}
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
