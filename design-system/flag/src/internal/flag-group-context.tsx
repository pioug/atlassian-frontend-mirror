import { createContext } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { defaultFlagGroupContext } from './default-flag-group-context';

export type FlagGroupAPI = {
	onDismissed: (id: number | string, analyticsEvent: UIAnalyticsEvent) => void;
	isDismissAllowed: boolean;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const FlagGroupContext: import('react').Context<FlagGroupAPI> =
	createContext<FlagGroupAPI>(defaultFlagGroupContext);
