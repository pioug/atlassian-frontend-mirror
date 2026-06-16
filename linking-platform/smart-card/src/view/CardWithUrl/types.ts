import type { SmartLinkResponse } from '@atlaskit/linking-types';

import type {
	CardAppearance,
	CardPlatform,
	EmbedIframeUrlType,
	InternalCardActionOptions,
	OnClickCallback,
	OnResolveCallback,
} from '../Card/types';
import { type FrameStyle } from '../EmbedCard/types';
import { type FlexibleUiOptions } from '../FlexibleCard/types';
import { type HoverPreviewOptions } from '../HoverCard/types';
import { type InlinePreloaderStyle, type OnErrorCallback } from '../types';

export type CardWithUrlContentProps = {
	actionOptions?: InternalCardActionOptions;
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
	onClick?: OnClickCallback;
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
	title?: string;
};
