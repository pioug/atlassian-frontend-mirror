import type { CardAuthFlowOpts, CardProviderRenderers } from '@atlaskit/link-provider/types';
import type { CardState } from '@atlaskit/linking-common/store';

import {
	type InternalCardActionOptions as CardActionOptions,
	type OnResolveCallback,
} from '../Card/types';
import { type OnErrorCallback } from '../types';

export type BlockCardProps = {
	actionOptions?: CardActionOptions;
	authFlow?: CardAuthFlowOpts['authFlow'];
	cardState: CardState;
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	handleAuthorize: (() => void) | undefined;
	/** Optional middle-click handler. */
	handleFrameAuxClick?: React.EventHandler<React.MouseEvent>;
	handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	/** Optional right-click handler. */
	handleFrameContextMenu?: React.EventHandler<React.MouseEvent>;
	hideIconLoadingSkeleton?: boolean;
	id: string;
	isSelected?: boolean;
	onError?: OnErrorCallback;
	onResolve?: OnResolveCallback;
	renderers?: CardProviderRenderers;
	testId?: string;
	url: string;
};
