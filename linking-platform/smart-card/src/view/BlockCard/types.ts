import { type CardAuthFlowOpts, type CardProviderRenderers } from '@atlaskit/link-provider';

import { type CardState } from '../../state/types';
import { type CardActionOptions, type OnResolveCallback } from '../Card/types';
import { type OnErrorCallback } from '../types';

export type BlockCardProps = {
	actionOptions?: CardActionOptions;
	authFlow?: CardAuthFlowOpts['authFlow'];
	cardState: CardState;
	CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
	handleAuthorize: (() => void) | undefined;
	handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	hideIconLoadingSkeleton?: boolean;
	id: string;
	isSelected?: boolean;
	onError?: OnErrorCallback;
	onResolve?: OnResolveCallback;
	renderers?: CardProviderRenderers;
	testId?: string;
	url: string;
};
