/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-data-from-event';

export const getPackageVersion = (event: UIAnalyticsEvent, contextName: string): any[] =>
	extractFromEventContext(['packageVersion'], event, true, contextName);
