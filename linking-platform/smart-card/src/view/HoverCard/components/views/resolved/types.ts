import { type CardState } from '@atlaskit/linking-common';

import type { ActionName } from '../../../../../constants';
import { type AnalyticsFacade } from '../../../../../state/analytics';
import { type LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import { type HoverCardLoadingViewProps } from '../resolving/types';

export type HoverCardResolvedProps = {
	extensionKey?: string;
	id?: string;
	url: string;
	analytics: AnalyticsFacade;
	cardActions?: LinkAction[];
	cardState: CardState;
	isAISummaryEnabled?: boolean;
	onActionClick: (actionId: string | ActionName) => void;
} & HoverCardLoadingViewProps;
