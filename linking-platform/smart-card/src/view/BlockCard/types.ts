import { type CardAuthFlowOpts, type CardProviderRenderers } from '@atlaskit/link-provider';
import { type CardState } from '../../state/types';
import { type InvokeHandler } from '../../model/invoke-handler';
import type { CardPlatform, OnResolveCallback, CardActionOptions } from '../Card/types';
import { type OnErrorCallback } from '../types';
import { type AnalyticsFacade } from '../../state/analytics';

export type BlockCardProps = {
	id: string;
	url: string;
	cardState: CardState;
	authFlow?: CardAuthFlowOpts['authFlow'];
	handleAuthorize: (() => void) | undefined;
	handleErrorRetry: () => void;
	handleInvoke: InvokeHandler;
	handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	isSelected?: boolean;
	onResolve?: OnResolveCallback;
	onError?: OnErrorCallback;
	testId?: string;
	actionOptions?: CardActionOptions;
	renderers?: CardProviderRenderers;
	platform?: CardPlatform;
	analytics: AnalyticsFacade;
	enableFlexibleBlockCard?: boolean;
};
