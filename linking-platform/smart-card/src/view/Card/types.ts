import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type CardAppearance, type CardState } from '@atlaskit/linking-common';

import { type CardPlatform } from '@atlaskit/link-extractors';

import { type FlexibleUiOptions } from '../FlexibleCard/types';
import { type ErrorCardType, type InlinePreloaderStyle, type OnErrorCallback } from '../types';
import { type FrameStyle } from '../EmbedCard/types';
import { type HoverPreviewOptions } from '../HoverCard/types';

export type { CardAppearance, CardPlatform };
export type CardInnerAppearance = CardAppearance | 'embedPreview' | 'flexible' | 'hoverCardPreview';

export type EmbedIframeUrlType = 'href' | 'interactiveHref';

export type OnResolveCallback = (data: {
	url?: string;
	title?: string;
	aspectRatio?: number;
}) => void;

export enum CardAction {
	DownloadAction = 'DownloadAction',
	PreviewAction = 'PreviewAction',
	ViewAction = 'ViewAction',
	ChangeStatusAction = 'ChangeStatusAction',
	FollowAction = 'FollowAction',
	CopyLinkAction = 'CopyLinkAction',
	AISummaryAction = 'AISummaryAction',
	AutomationAction = 'AutomationAction',
}

export type CardActionOptions =
	| {
			hide: true;
	  }
	| { hide: false; exclude?: Array<CardAction> };

interface ActionProps {
	/**
	 * Configure visibility of actions available.
	 * By default, smart links show all actions available on the views.
	 * Set `hide` to true to disable all actions.
	 * Set `hide` to false and set `exclude` to enable only specific actions.
	 */
	actionOptions?: CardActionOptions;
}

interface HoverPreviewProps extends ActionProps {
	showHoverPreview?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	showAuthTooltip?: boolean;
}

export interface BaseCardProps {
	/**
	 * Define smart card default appearance.
	 */
	appearance: CardAppearance;
	/**
	 * The container which `react-lazily-render` listens to for scroll events.
	 * This property can be used in a scenario where you want to specify your own scroll container
	 * while the Card component is (lazy)loading.
	 */
	container?: HTMLElement;
	/**
	 * A React component responsible for returning a fallback UI when smart link fails to render because of uncaught errors.
	 */
	fallbackComponent?: React.ComponentType;
	/**
	 * Unique id for smart link used in analytics.
	 */
	id?: string;
	/**
	 * Show selected state of smart link.
	 */
	isSelected?: boolean;
	/**
	 * A callback function after a link is clicked.
	 */
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/**
	 * A callback function currently invoked in two cases:
	 * 1. When the {@link CardState.status} is one of {@link ErrorCardType}. "err" property in argument will be undefined in this case
	 *    This does not mean that smart card failed to render.
	 * 2. When there is any unhandled error inside smart card while rendering, resulting in failure to render smart card succesfully.
	 *    "err" property in argument will be provided in this case.
	 *    Presence of an err property indicates that the client should either render their own fallback
	 *    or provide a fallbackComponent prop which will be rendered instead smart card component.
	 *    If fallbackComponent is not provided, smart card will render null
	 */
	onError?: OnErrorCallback;
	/**
	 * A callback function after the url is resolved into smart card.
	 */
	onResolve?: OnResolveCallback;
	/**
	 * String to be displayed while the Card component is (lazy)loading.
	 */
	placeholder?: string;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * The url link of the resource to be resolved and shown as Smart Link.
	 */
	url?: string;
}

export interface InlineProps extends HoverPreviewProps {
	inlinePreloaderStyle?: InlinePreloaderStyle;
	/** A flag that determines whether a card is in a hover state in edit mode. Currently used for inline links only */
	isHovered?: boolean;
	/**
	 * When set to true, the text fragment will be removed from the title.
	 * This will have no impact on the url and text highlighting will still persist in the url,
	 * however the the text fragment will be stripped from the title of the smart card.
	 * For example, when set to true: "my name | :~:text=highlight this" will be displayed as "my name"
	 */
	removeTextHighlightingFromTitle?: boolean;
	/**
	 * When defined, this placeholder will be displayed while the smart card is resolving. This is only useful for inline cards.
	 */
	resolvingPlaceholder?: string;
	/** When set to true, inline cards will be truncated to one line. */
	truncateInline?: boolean;
}

export interface BlockProps extends ActionProps {
	/**
	 * When enabled the legacy block card is always used, even if the enableFlexibleBlockCard flag is set to true.
	 * Usage is strongly discouraged. This should only be used if there is a specific reason you're
	 * unable to use the new flexible block cards.
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-15021 Internal documentation for deprecation (no external access)}
	 */
	useLegacyBlockCard?: boolean;
}

export interface EmbedProps {
	/**
	 * React referenced value on embed iframe.
	 */
	embedIframeRef?: React.Ref<HTMLIFrameElement>;
	/**
	 * Type of URL used with embed iframe. By default, the embed use `data.preview.href` from link response.
	 * `interactiveHref` is suitable for displaying iframe content that contains "more editable" version of
	 * the link, e.g. includes toolbar.
	 * It is only available on supported link response with `data.preview.interactiveHref`.
	 */
	embedIframeUrlType?: EmbedIframeUrlType;
	/**
	 * A prop that determines the style of a frame:
	 * whether to show it, hide it or only show it when a user hovers over embed.
	 */
	frameStyle?: FrameStyle;
	/**
	 * Determines whether width and height of an embed card are to be inherited from the parent.
	 * If `true`, embed iframe will remove restrictions on iframe aspect ratio, height and width.
	 * The parent container needs to override a style `.loader-wrapper` and set the desirable height there.
	 * (For instance, 'height: 100%')
	 */
	inheritDimensions?: boolean;
	/**
	 * Informs Smart Link of the device it is rendered in. Available values are `web` and `mobile`.
	 * It is used together with link response `data.preview['atlassian:supportedPlatforms']`.
	 * To make embed content available on all supported urls, use `web`.
	 */
	platform?: CardPlatform;
}

export interface FlexibleProps extends ActionProps, HoverPreviewProps {
	children?: React.ReactNode;
	ui?: FlexibleUiOptions;
}

export interface CardProps
	extends BaseCardProps,
		InlineProps,
		BlockProps,
		EmbedProps,
		FlexibleProps,
		WithAnalyticsEventsProps {
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3226 Internal documentation for deprecation (no external access)}
	 * Likely here for legacy reason where editor would store data in ADF instead of resolving it everytime
	 * https://product-fabric.atlassian.net/browse/EDM-10930
	 */
	data?: any;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-3226 Internal documentation for deprecation (no external access)}
	 * Likely here for legacy reason where editor would store data in ADF instead of resolving it everytime
	 * https://product-fabric.atlassian.net/browse/EDM-10930
	 */
	importer?: (target: any) => void;
}
