/**
 * Largely taken from analytics-web-react
 */

import merge from 'lodash/merge';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-from-event-context';

export const getExtraAttributes = (event: UIAnalyticsEvent): any =>
	extractFromEventContext('attributes', event).reduce(
		(result, extraAttributes) => merge(result, extraAttributes),
		{},
	);
