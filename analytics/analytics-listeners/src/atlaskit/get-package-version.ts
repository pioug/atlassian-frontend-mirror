/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-from-event-context';

export const getPackageVersion = (event: UIAnalyticsEvent): any[] =>
	extractFromEventContext('packageVersion', event);
