import { type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { type CardPlatform } from '@atlaskit/link-extractors';
import { type CardAppearance } from '@atlaskit/linking-common';

import type { CardAction } from '../../constants';
import { type FrameStyle } from '../EmbedCard/types';
import type { EmbedModalSize } from '../EmbedModal/types';
import { type FlexibleUiOptions } from '../FlexibleCard/types';
import { type HoverPreviewOptions } from '../HoverCard/types';
import {
	type EventHandlerWithData,
	type InlinePreloaderStyle,
	type OnErrorCallback,
} from '../types';

export type { CardAppearance, CardPlatform };
export type CardInnerAppearance =
	| CardAppearance
	| 'embedPreview'
	| 'flexible'
	| 'hoverCardPreview'
	| 'url';

export type EmbedIframeUrlType = 'href' | 'interactiveHref';

export type OnResolveCallback = (data: {
	aspectRatio?: number;
	extensionKey?: string;
	title?: string;
	url?: string;
}) => void;

/**
 * A CardActionOptions object contains the configuration for the actions available on the card.
 */
export type CardActionOptions = CardActionVisibilityOptions & {
	/**
	 * Contains configuration for the preview action.
	 */
	previewAction?: {
		/**
		 * Determines if the blanket behind the modal should be hidden when the preview action is clicked.
		 */
		hideBlanket?: boolean;
		/**
		 * Determines the size of the preview modal when the preview action is clicked.
		 */
		size?: EmbedModalSize;
	};
	/**
	 * Rovo Chat action sends prompt messages to Rovo Chat.
	 * It requires setting rovoOptions on SmartCardProvider and opt-in via this prop to surface.
	 *
	 * This is an experiment feature and maybe removed any given time.
	 */
	rovoChatAction?: {
		optIn: boolean;
	};
};

/**
 * Determines which actions are visible on the card.
 */
export type CardActionVisibilityOptions =
	| {
			hide: true;
	  }
	| { exclude?: Array<CardAction>; hide: false };

/**
 * Internal configuration for actionOptions.
 * This can be used for experiment before the prop become public API after experiment is successful.
 * Warning: Internal prop can be changed/refactored anytime without notice.
 */
export type InternalCardActionOptions = CardActionOptions & {
	// Add temporary CardActionOptions here
};

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
	/**
	 * Configuration for hover card.
	 */
	hoverPreviewOptions?: HoverPreviewOptions;
	/**
	 * Flag to display hover preview on hover.
	 */
	showHoverPreview?: boolean;
}

export type OnClickData = {
	/**
	 * The destination URL that Smart Link resolved and will navigate to.
	 * This may differ from the original `url` prop if Smart Link applied
	 * cross-product analytics parameters or resolved a preferred URL from metadata.
	 */
	destinationUrl?: string;

	/**
	 * The original `url` prop given to the component
	 * and the key to access link metadata in SmartCardProvider.
	 */
	url?: string;
};

/**
 * Callback type for click events on Smart Links.
 *
 * Equivalent to:
 *   (event: React.MouseEvent | React.KeyboardEvent, data?: OnClickData) => void
 *
 * Uses `EventHandlerWithData` (a bivariant method type) so that consumers can pass
 * callbacks with narrower event types (e.g. `React.MouseEvent<HTMLElement>`) without
 * TypeScript errors — the same technique React uses internally for `React.EventHandler`.
 *
 * The optional `data` argument provides additional context:
 * - `data.destinationUrl` — the URL Smart Link resolved and will navigate to.
 * - `data.url` — the original `url` prop passed to the component.
 *
 * Use this type when typing your own click handler variable or function outside JSX:
 * @example
 * const handleClick: OnClickCallback = (event, data) => {
 *   event.preventDefault();
 *   navigate(data?.destinationUrl ?? fallbackUrl);
 * };
 */
export type OnClickCallback = EventHandlerWithData<
	React.MouseEvent | React.KeyboardEvent,
	OnClickData
>;

interface CardEventProps {
	/**
	 * A React component responsible for returning a fallback UI when smart link fails to render because of uncaught errors.
	 */
	fallbackComponent?: React.ComponentType;

	/**
	 * A callback function triggered when a Smart Link is clicked.
	 *
	 * When defined, the default browser navigation is prevented and your handler
	 * is responsible for navigation — except for Flexible Card, which always opens
	 * the link and then calls the callback.
	 *
	 * The optional second argument `data` provides additional context about the click:
	 * - `data.destinationUrl` — the resolved URL Smart Link will navigate to.
	 *   This may differ from the original `url` prop if Smart Link resolved a
	 *   preferred URL from metadata or appended analytics parameters.
	 * - `data.url` — the original `url` prop passed to the component.
	 *
	 * @example
	 * // Basic usage
	 * onClick={(e) => { e.preventDefault(); window.location.href = myUrl; }}
	 *
	 * // With destination URL
	 * onClick={(e, data) => { navigate(data?.destinationUrl ?? url); }}
	 */
	onClick?: OnClickCallback;

	/**
	 * A callback function currently invoked in two cases:
	 * 1. When the `CardState.status` is one of `ErrorCardType`. "err" property in argument will be undefined in this case
	 *    This does not mean that smart card failed to render.
	 * 2. When there is any unhandled error inside smart card while rendering, resulting in failure to render smart card successfully.
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
}

export interface BaseCardProps {
	/**
	 * Define smart card default appearance.
	 */
	appearance: CardAppearance;
	/**
	 * Competitor Prompt Component for Competitor link experiment
	 */
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	/**
	 * The container which `react-lazily-render` listens to for scroll events.
	 * This property can be used in a scenario where you want to specify your own scroll container
	 * while the Card component is (lazy)loading.
	 */
	container?: HTMLElement;
	/**
	 * When Preview panel is supported, onClick is ignored and the panel opens by default.
	 * This prop allows smartlinks inside of editor to bypass that as they have other ways to open Preview panel.
	 */
	disablePreviewPanel?: boolean;
	/**
	 * Unique id for smart link used in analytics.
	 */
	id?: string;
	/**
	 * Show selected state of smart link.
	 */
	isSelected?: boolean;
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
	/**
	 * By default, inline resolving states show a frame with a spinner on the left.
	 * An alternative is to remove the frame and place the spinner on the right by setting this value to `on-right-without-skeleton`.
	 * This property is specific to inline links in the editor.
	 */
	inlinePreloaderStyle?: InlinePreloaderStyle;
	/**
	 * A flag that determines whether a card is in a hover state. Currently used for inline links in editor only.
	 */
	isHovered?: boolean;
	/**
	 * When set to true, the text fragment will be removed from the title.
	 * This will have no impact on the url and text highlighting will still persist in the url,
	 * however the text fragment will be stripped from the title of the smart card.
	 * For example, when set to true: "my name | :~:text=highlight this" will be displayed as "my name"
	 */
	removeTextHighlightingFromTitle?: boolean;
	/**
	 * When defined, this placeholder will be displayed while the smart card is resolving. This is only useful for inline cards.
	 */
	resolvingPlaceholder?: string;
	/**
	 * When set to true, inline cards will be truncated to one line
	 */
	truncateInline?: boolean;
}

export interface BlockProps extends ActionProps {}

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
	 * It is used together with link response `data.preview["atlassian:supportedPlatforms"]`.
	 * To make embed content available on all supported urls, use `web`.
	 * @deprecated The support for platform prop will be removed and `web` used as default
	 */
	platform?: CardPlatform;
}

export interface FlexibleProps extends ActionProps, HoverPreviewProps {
	children?: React.ReactNode;
	ui?: FlexibleUiOptions;
}

export interface CardProps
	extends BaseCardProps,
		CardEventProps,
		InlineProps,
		BlockProps,
		EmbedProps,
		FlexibleProps,
		WithAnalyticsEventsProps {}
