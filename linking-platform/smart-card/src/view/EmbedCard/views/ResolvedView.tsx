import React from 'react';

import LinkGlyph from '@atlaskit/icon/core/migration/link';
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
	/** The optional click handler */
	onClick?: (evt: React.MouseEvent) => void;
	/** Optional callback for when user dwells cursor over iframe - for analytics **/
	onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
	/** Optional callback for when user navigates into an iframe - for analytics **/
	onIframeFocus?: () => void;
	/** The src to be used for the `iframe` */
	preview?: { aspectRatio?: number; src?: string };
	/** For testing purposes only. */
	testId?: string;
	/** The title of the link */
	title?: string;
	/** Type of the object */
	type?: string[];
}

export const EmbedCardResolvedView = React.forwardRef<
	HTMLIFrameElement,
	EmbedCardResolvedViewProps
>(
	(
		{
			link,
			context,
			onClick,
			isSelected,
			frameStyle,
			preview,
			title,
			isTrusted,
			testId = 'embed-card-resolved-view',
			inheritDimensions,
			onIframeDwell,
			onIframeFocus,
			isSupportTheming,
			type,
			CompetitorPrompt,
			hideIconLoadingSkeleton,
			extensionKey,
		},
		embedIframeRef,
	) => {
		const iconFromContext = context?.icon;
		const src = typeof iconFromContext === 'string' ? iconFromContext : undefined;
		const text = title || context?.text;
		const linkGlyph = React.useMemo(
			() => (
				<LinkGlyph
					label="icon"
					LEGACY_size="small"
					testId="embed-card-fallback-icon"
					color="currentColor"
				/>
			),
			[],
		);

		let icon = React.useMemo(() => {
			if (React.isValidElement(iconFromContext)) {
				return iconFromContext;
			}
			return (
				<ImageIcon
					src={src}
					default={linkGlyph}
					appearance={isProfileType(type) ? 'round' : 'square'}
					hideLoadingSkeleton={hideIconLoadingSkeleton}
				/>
			);
		}, [iconFromContext, src, linkGlyph, type, hideIconLoadingSkeleton]);

		useEmbedResolvePostMessageListener({
			url: link,
			embedIframeRef,
		});

		const themeState = useThemeObserver();
		let previewUrl = preview?.src;

		if (previewUrl && isSupportTheming) {
			previewUrl = getPreviewUrlWithTheme(previewUrl, themeState);
		}

		return (
			<ExpandedFrame
				isSelected={isSelected}
				frameStyle={frameStyle}
				href={link}
				testId={testId}
				icon={icon}
				text={text}
				onClick={onClick}
				inheritDimensions={inheritDimensions}
				setOverflow={false}
				CompetitorPrompt={CompetitorPrompt}
			>
				<Frame
					url={previewUrl}
					isTrusted={isTrusted}
					testId={testId}
					ref={embedIframeRef}
					onIframeDwell={onIframeDwell}
					onIframeFocus={onIframeFocus}
					title={text}
					extensionKey={extensionKey}
				/>
			</ExpandedFrame>
		);
	},
);
