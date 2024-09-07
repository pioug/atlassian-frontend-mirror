import { type EventHandler, type MouseEvent, type KeyboardEvent } from 'react';
import type {
	CardAppearance,
	CardPlatform,
	EmbedIframeUrlType,
	OnResolveCallback,
	CardActionOptions,
} from '../Card/types';
import { type AnalyticsHandler } from '../../utils/types';
import { type FlexibleUiOptions } from '../FlexibleCard/types';
import { type InlinePreloaderStyle, type OnErrorCallback } from '../types';
import { type AnalyticsFacade } from '../../state/analytics';
import { type FrameStyle } from '../EmbedCard/types';
import { type HoverPreviewOptions } from '../HoverCard/types';

export type CardWithUrlContentProps = {
	id: string;
	url: string;
	appearance: CardAppearance;
	platform?: CardPlatform;
	onClick?: EventHandler<MouseEvent | KeyboardEvent>;
	isSelected?: boolean;
	isHovered?: boolean;
	isFrameVisible?: boolean;
	frameStyle?: FrameStyle;
	container?: HTMLElement;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-2681 Internal documentation for deprecation (no external access)}
	 * Avoid prop drilling analytics handlers
	 */
	dispatchAnalytics?: AnalyticsHandler;
	testId?: string;
	onResolve?: OnResolveCallback;
	onError?: OnErrorCallback;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
	 *
	 * Prefer 'actionOptions' prop.
	 */
	showActions?: boolean;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-6348 Internal documentation for deprecation (no external access)}
	 *
	 * Prefer 'actionOptions' prop.
	 */
	showServerActions?: boolean;
	actionOptions?: CardActionOptions;
	inheritDimensions?: boolean;
	embedIframeRef?: React.Ref<HTMLIFrameElement>;
	embedIframeUrlType?: EmbedIframeUrlType;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	ui?: FlexibleUiOptions;
	children?: React.ReactNode;
	showHoverPreview?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	showAuthTooltip?: boolean;
	analyticsEvents?: AnalyticsFacade;
	placeholder?: string;
	useLegacyBlockCard?: boolean;
	removeTextHighlightingFromTitle?: boolean;
	resolvingPlaceholder?: string;
};
