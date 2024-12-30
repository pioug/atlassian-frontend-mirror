import { type EventHandler, type KeyboardEvent, type MouseEvent } from 'react';

import { type CardProviderRenderers } from '@atlaskit/link-provider';

import { type CardState } from '../../state/types';
import type { CardActionOptions } from '../Card/types';
import { type HoverPreviewOptions } from '../HoverCard/types';
import { type InlinePreloaderStyle, type OnErrorCallback } from '../types';

export type InlineCardProps = {
	id: string;
	url: string;
	cardState: CardState;
	handleAuthorize: (() => void) | undefined;
	handleFrameClick: EventHandler<MouseEvent | KeyboardEvent>;
	isSelected?: boolean;
	isHovered?: boolean;
	testId?: string;
	onResolve?: (data: { url?: string; title?: string }) => void;
	onError?: OnErrorCallback;
	inlinePreloaderStyle?: InlinePreloaderStyle;
	renderers?: CardProviderRenderers;
	showHoverPreview?: boolean;
	hoverPreviewOptions?: HoverPreviewOptions;
	actionOptions?: CardActionOptions;
	removeTextHighlightingFromTitle?: boolean;
	resolvingPlaceholder?: string;
	truncateInline?: boolean;
};
