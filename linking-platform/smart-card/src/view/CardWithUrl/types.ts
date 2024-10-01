import { type EventHandler, type MouseEvent, type KeyboardEvent } from 'react';
import type {
	CardAppearance,
	CardPlatform,
	EmbedIframeUrlType,
	OnResolveCallback,
	CardActionOptions,
} from '../Card/types';
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
	showAuthTooltip?: boolean;
	analyticsEvents?: AnalyticsFacade;
	placeholder?: string;
	useLegacyBlockCard?: boolean;
	removeTextHighlightingFromTitle?: boolean;
	resolvingPlaceholder?: string;
	truncateInline?: boolean;
};
