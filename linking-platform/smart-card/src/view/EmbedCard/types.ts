import { type ReactNode } from 'react';

import { type CardProviderRenderers } from '@atlaskit/link-provider';

import { type InvokeHandler } from '../../model/invoke-handler';
import { type CardState } from '../../state/types';
import type {
	CardActionOptions,
	CardPlatform,
	EmbedIframeUrlType,
	OnResolveCallback,
} from '../Card/types';
import { type OnErrorCallback } from '../types';

export type EmbedCardProps = {
	url: string;
	cardState: CardState;
	handleAuthorize: (() => void) | undefined;
	handleErrorRetry: () => void;
	handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	handleInvoke: InvokeHandler;
	id?: string;
	isSelected?: boolean;
	frameStyle?: FrameStyle;
	platform?: CardPlatform;
	onResolve?: OnResolveCallback;
	onError?: OnErrorCallback;
	testId?: string;
	inheritDimensions?: boolean;
	actionOptions?: CardActionOptions;
	onIframeDwell?: (dwellTime: number, dwellPercentVisible: number) => void;
	onIframeFocus?: () => void;
	iframeUrlType?: EmbedIframeUrlType;
	renderers?: CardProviderRenderers;
};
export interface WithShowControlMethodProp {
	showControls?: () => void;
}

export interface ContextViewModel {
	icon?: ReactNode;
	image?: string;
	text: string;
}

export type AccessTypes =
	| 'REQUEST_ACCESS'
	| 'PENDING_REQUEST_EXISTS'
	| 'FORBIDDEN'
	| 'DIRECT_ACCESS'
	| 'DENIED_REQUEST_EXISTS'
	| 'APPROVED_REQUEST_EXISTS'
	| 'ACCESS_EXISTS';

export interface AccessContext {
	accessType?: AccessTypes;
	cloudId?: string;
	url?: string;
	smartLinksAccessMetadataExperimentCohort?: 'experiment' | 'control' | 'not-enrolled';
}

export type InlinePreloaderStyle = 'on-left-with-skeleton' | 'on-right-without-skeleton';

export type FrameStyle = 'show' | 'hide' | 'showOnHover';
