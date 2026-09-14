import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import {
	type LinkCreatedAttributesType,
	type LinkUpdatedAttributesType,
	type LinkDeletedAttributesType,
} from '../common/utils/analytics/analytics.types';
import { type LifecycleAction, type LinkDetails } from '../types';
import { processAttributesFromBaseEvent } from './process-attributes-from-base-event';

const DEFAULT_ATTRIBUTES_MAP: {
	created: LinkCreatedAttributesType;
	deleted: LinkDeletedAttributesType;
	updated: LinkUpdatedAttributesType;
} = {
	created: {
		sourceEvent: null,
		creationMethod: 'unknown',
	},
	updated: {
		sourceEvent: null,
		updateMethod: 'unknown',
	},
	deleted: {
		sourceEvent: null,
		deleteMethod: 'unknown',
	},
};

export const mergeAttributes = (
	action: LifecycleAction,
	details: LinkDetails,
	event?: UIAnalyticsEvent | null,
	attributes?: Record<string, unknown>,
):
	| {
			creationMethod: string;
			smartLinkId: string | undefined;
			sourceEvent: string | null;
	  }
	| {
			deleteMethod: string;
			smartLinkId: string | undefined;
			sourceEvent: string | null;
	  }
	| {
			smartLinkId: string | undefined;
			sourceEvent: string | null;
			updateMethod: string;
	  } => {
	const defaultAttributes = DEFAULT_ATTRIBUTES_MAP[action];
	const derivedAttributes = event ? processAttributesFromBaseEvent(action, event) : {};

	return {
		...defaultAttributes,
		...attributes,
		...derivedAttributes,
		smartLinkId: details.smartLinkId,
	};
};
