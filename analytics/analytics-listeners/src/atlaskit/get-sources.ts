/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-from-event-context';

export const getSources = (event: UIAnalyticsEvent): any[] =>
	extractFromEventContext('source', event);
