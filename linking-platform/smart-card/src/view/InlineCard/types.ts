import { type EventHandler, type KeyboardEvent, type MouseEvent } from 'react';

import { type CardProviderRenderers } from '@atlaskit/link-provider';

import { type CardState } from '../../state/types';
import type { CardActionOptions } from '../Card/types';
import { type HoverPreviewOptions } from '../HoverCard/types';
import { type InlinePreloaderStyle, type OnErrorCallback } from '../types';

export type InlineCardProps = {
	actionOptions?: CardActionOptions;
	cardState: CardState;
	handleAuthorize: (() => void) | undefined;
	handleFrameClick: EventHandler<MouseEvent | KeyboardEvent>;
	hideIconLoadingSkeleton?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	id: string;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	isHovered?: boolean;
	isSelected?: boolean;
	onError?: OnErrorCallback;
	onResolve?: (data: { title?: string; url?: string }) => void;
	removeTextHighlightingFromTitle?: boolean;
	renderers?: CardProviderRenderers;
	resolvingPlaceholder?: string;
	showHoverPreview?: boolean;
	testId?: string;
	truncateInline?: boolean;
	url: string;
};
