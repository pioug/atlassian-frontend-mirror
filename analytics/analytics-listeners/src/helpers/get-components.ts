/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-data-from-event';

export const getComponents = (event: UIAnalyticsEvent, contextName: string): any[] =>
	extractFromEventContext(['component', 'componentName'], event, false, contextName);
