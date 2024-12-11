import { type CardAuthFlowOpts, type CardProviderRenderers } from '@atlaskit/link-provider';

import { type AnalyticsFacade } from '../../state/analytics';
import { type CardState } from '../../state/types';
import { type CardActionOptions, type OnResolveCallback } from '../Card/types';
import { type OnErrorCallback } from '../types';

export type BlockCardProps = {
	id: string;
	url: string;
	cardState: CardState;
	authFlow?: CardAuthFlowOpts['authFlow'];
	handleAuthorize: (() => void) | undefined;
	handleFrameClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
	isSelected?: boolean;
	onResolve?: OnResolveCallback;
	onError?: OnErrorCallback;
	testId?: string;
	actionOptions?: CardActionOptions;
	renderers?: CardProviderRenderers;
	analytics: AnalyticsFacade;
};
