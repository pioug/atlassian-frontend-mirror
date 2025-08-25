import { type CardState } from '@atlaskit/linking-common';

import type { ActionName } from '../../../../../constants';
import { type LinkAction } from '../../../../../state/hooks-external/useSmartLinkActions';
import { type HoverCardLoadingViewProps } from '../resolving/types';

export type HoverCardResolvedProps = {
	cardActions?: LinkAction[];
	cardState: CardState;
	extensionKey?: string;
	id?: string;
	isAISummaryEnabled?: boolean;
	onActionClick: (actionId: string | ActionName) => void;
	url: string;
} & HoverCardLoadingViewProps;
