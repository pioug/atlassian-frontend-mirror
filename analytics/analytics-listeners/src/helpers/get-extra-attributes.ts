/**
 * Largely taken from analytics-web-react
 */

import merge from 'lodash/merge';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-data-from-event';

export const getExtraAttributes = (event: UIAnalyticsEvent, contextName: string): any =>
	extractFromEventContext(['attributes'], event, true, contextName).reduce(
		(result, extraAttributes) => merge(result, extraAttributes),
		{},
	);
