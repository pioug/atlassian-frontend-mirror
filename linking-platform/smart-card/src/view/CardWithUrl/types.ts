import { type EventHandler, type KeyboardEvent, type MouseEvent } from 'react';

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
	placeholder?: string;
	removeTextHighlightingFromTitle?: boolean;
	resolvingPlaceholder?: string;
	truncateInline?: boolean;
	CompetitorPrompt?: React.ComponentType<{ sourceUrl: string; linkType?: string }>;
	hideIconLoadingSkeleton?: boolean;
};
