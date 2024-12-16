import { type EventHandler, type KeyboardEvent, type MouseEvent } from 'react';

import { type AnalyticsFacade } from '../../state/analytics';
import type {
	CardActionOptions,
	CardAppearance,
	CardPlatform,
	EmbedIframeUrlType,
	OnResolveCallback,
} from '../Card/types';
import { type FrameStyle } from '../EmbedCard/types';
import { type FlexibleUiOptions } from '../FlexibleCard/types';
import { type HoverPreviewOptions } from '../HoverCard/types';
import { type InlinePreloaderStyle, type OnErrorCallback } from '../types';

export type CardWithUrlContentProps = {
	id: string;
	url: string;
	appearance: CardAppearance;
	platform?: CardPlatform;
	onClick?: EventHandler<MouseEvent | KeyboardEvent>;
	isSelected?: boolean;
	isHovered?: boolean;
	frameStyle?: FrameStyle;
	container?: HTMLElement;
	testId?: string;
	onResolve?: OnResolveCallback;
	onError?: OnErrorCallback;
	actionOptions?: CardActionOptions;
	inheritDimensions?: boolean;
	embedIframeRef?: React.Ref<HTMLIFrameElement>;
	embedIframeUrlType?: EmbedIframeUrlType;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	ui?: FlexibleUiOptions;
	children?: React.ReactNode;
	showHoverPreview?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-23150 Internal documentation for deprecation (no external access)}
	 */
	showAuthTooltip?: boolean;
	analyticsEvents?: AnalyticsFacade;
	placeholder?: string;
	removeTextHighlightingFromTitle?: boolean;
	resolvingPlaceholder?: string;
	truncateInline?: boolean;
};
