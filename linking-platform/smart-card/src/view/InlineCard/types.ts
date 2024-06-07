import { type EventHandler, type MouseEvent, type KeyboardEvent } from 'react';
import { type CardProviderRenderers } from '@atlaskit/link-provider';
import { type CardState } from '../../state/types';
import { type InlinePreloaderStyle, type OnErrorCallback } from '../types';
import { type AnalyticsFacade } from '../../state/analytics';
import type { CardActionOptions } from '../Card/types';

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
	showAuthTooltip?: boolean;
	actionOptions?: CardActionOptions;
	analytics: AnalyticsFacade;
};
