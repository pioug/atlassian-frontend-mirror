import React from 'react';

import LinkGlyph from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { useThemeObserver } from '@atlaskit/tokens';

import { getPreviewUrlWithTheme, isProfileType } from '../../../utils';
import { ExpandedFrame } from '../components/ExpandedFrame';
import { Frame } from '../components/Frame';
import { ImageIcon } from '../components/ImageIcon';
import { type ContextViewModel, type FrameStyle } from '../types';
import { useEmbedResolvePostMessageListener } from '../useEmbedResolvePostMessageListener';

export interface EmbedCardResolvedViewProps {
	/** Component to prompt for competitor link */
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	/** The context view model */
	context?: ContextViewModel;
	/** The extension key */
	extensionKey?: string;
	/** A prop that determines the style of a frame: whether to show it, hide it or only show it when a user hovers over embed */
	frameStyle?: FrameStyle;
	/** For image icons in the title, whether to hide the loading skeleton while the image is loading. */
	hideIconLoadingSkeleton?: boolean;
	inheritDimensions?: boolean;
	/** A flag that determines whether the card is selected in edit mode. */
	isSelected?: boolean;
	/* It determines whether a link source supports different design theme modes */
	isSupportTheming?: boolean;
	/** A flag that determines whether link source can be trusted in iframe **/
	isTrusted?: boolean;
	/** The link to display */
	link: string;
	/** Optional middle-click handler. */
	onAuxClick?: React.EventHandler<React.MouseEvent>;
	/** The optional click handler */
	onClick?: (evt: React.MouseEvent) => void;
	/** Optional right-click handler. */
	onContextMenu?: React.EventHandler<React.MouseEvent>;
	/** Optional callback for when user dwells cursor over iframe - for analytics **/
	onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
	/** Optional callback for when user navigates into an iframe - for analytics **/
	onIframeFocus?: () => void;
	/** Optional callback for when user hovers over an iframe - for analytics **/
	onIframeMouseEnter?: () => void;
	/** Optional callback for when user stops hovering over an iframe - for analytics **/
	onIframeMouseLeave?: () => void;
	/** The src to be used for the `iframe` */
	preview?: { aspectRatio?: number; src?: string };
	/** For testing purposes only. */
	testId?: string;
	/** The title of the link */
	title?: string;
	/** Type of the object */
	type?: string[];
}

export const EmbedCardResolvedView: React.ForwardRefExoticComponent<
	EmbedCardResolvedViewProps & React.RefAttributes<HTMLIFrameElement>
> = React.forwardRef<HTMLIFrameElement, EmbedCardResolvedViewProps>(
	(
		{
			link,
			context,
			onClick,
			onAuxClick,
			onContextMenu,
			isSelected,
			frameStyle,
			preview,
			title,
			isTrusted,
			testId = 'embed-card-resolved-view',
			inheritDimensions,
			onIframeDwell,
			onIframeFocus,
			onIframeMouseEnter,
			onIframeMouseLeave,
			isSupportTheming,
			type,
			CompetitorPrompt,
			hideIconLoadingSkeleton,
			extensionKey,
		},
		embedIframeRef,
	) => {
		const iconFromContext = context?.icon;
		const iconLabel = context?.iconLabel;
		const src = typeof iconFromContext === 'string' ? iconFromContext : undefined;
		const text = title || context?.text;
		const linkGlyph = React.useMemo(
			() => <LinkGlyph label="icon" testId="embed-card-fallback-icon" color="currentColor" />,
			[],
		);

		const icon = React.useMemo(() => {
			if (React.isValidElement(iconFromContext)) {
				return iconFromContext;
			}

			return (
				<ImageIcon
					src={src}
					{...(fg('platform_lp_use_entity_icon_url_for_icon') ? { alt: iconLabel } : undefined)}
					default={linkGlyph}
					appearance={isProfileType(type) ? 'round' : 'square'}
					hideLoadingSkeleton={hideIconLoadingSkeleton}
				/>
			);
		}, [iconFromContext, src, linkGlyph, type, hideIconLoadingSkeleton, iconLabel]);

		useEmbedResolvePostMessageListener({
			url: link,
			embedIframeRef,
		});

		const themeState = useThemeObserver();
		let previewUrl = preview?.src;

		if (previewUrl && isSupportTheming) {
			previewUrl = getPreviewUrlWithTheme(previewUrl, themeState);
		}

		const [isMouseOver, setMouseOver] = React.useState(false);

		return (
			<ExpandedFrame
				isSelected={isSelected}
				frameStyle={frameStyle}
				href={link}
				testId={testId}
				icon={icon}
				text={text}
				onClick={onClick}
				onAuxClick={onAuxClick}
				onContextMenu={onContextMenu}
				inheritDimensions={inheritDimensions}
				setOverflow={false}
				CompetitorPrompt={CompetitorPrompt}
				onContentMouseEnter={() => {
					setMouseOver(true);
					onIframeMouseEnter?.();
				}}
				onContentMouseLeave={() => {
					setMouseOver(false);
					onIframeMouseLeave?.();
				}}
			>
				<Frame
					url={previewUrl}
					isTrusted={isTrusted}
					testId={testId}
					ref={embedIframeRef}
					onIframeDwell={onIframeDwell}
					onIframeFocus={onIframeFocus}
					onIframeMouseEnter={onIframeMouseEnter}
					onIframeMouseLeave={onIframeMouseLeave}
					isMouseOver={isMouseOver}
					title={text}
					extensionKey={extensionKey}
				/>
			</ExpandedFrame>
		);
	},
);
