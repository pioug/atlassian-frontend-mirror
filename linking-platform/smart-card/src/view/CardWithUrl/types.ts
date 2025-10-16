import { type EventHandler, type KeyboardEvent, type MouseEvent } from 'react';

import type { SmartLinkResponse } from '@atlaskit/linking-types';

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
	actionOptions?: CardActionOptions;
	appearance: CardAppearance;
	children?: React.ReactNode;
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	container?: HTMLElement;
	disablePreviewPanel?: boolean;
	embedIframeRef?: React.Ref<HTMLIFrameElement>;
	embedIframeUrlType?: EmbedIframeUrlType;
	frameStyle?: FrameStyle;
	hideIconLoadingSkeleton?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	id: string;
	inheritDimensions?: boolean;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	isHovered?: boolean;
	isSelected?: boolean;
	onClick?: EventHandler<MouseEvent | KeyboardEvent>;
	onError?: OnErrorCallback;
	onResolve?: OnResolveCallback;
	placeholder?: string;
	placeholderData?: SmartLinkResponse;
	platform?: CardPlatform;
	removeTextHighlightingFromTitle?: boolean;
	resolvingPlaceholder?: string;
	showHoverPreview?: boolean;
	testId?: string;
	truncateInline?: boolean;
	ui?: FlexibleUiOptions;
	url: string;
};
