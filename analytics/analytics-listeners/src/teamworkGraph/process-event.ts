import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { DEFAULT_SOURCE, type GasPayload } from '@atlaskit/analytics-gas-types';
import merge from 'lodash/merge';
import last from 'lodash/last';

import {
	getPackageHierarchy,
	getSources,
	getPackageInfo,
	getComponents,
	getExtraAttributes,
} from '../atlaskit/extract-data-from-event';

const listenerVersion = process.env._PACKAGE_VERSION_ as string;

export function processEvent(event: UIAnalyticsEvent): GasPayload {
	const sources = getSources(event);
	const { packageName, packageVersion } = last(getPackageInfo(event)) || ({} as any);

	const extraAttributes = getExtraAttributes(event);

	const tags: Set<string> = new Set(event.payload.tags || []);
	tags.add('teamworkGraph');

	const components = getComponents(event);

	const payload = {
		source: last(sources) || DEFAULT_SOURCE,
		actionSubject: event.payload.actionSubject,
		action: event.payload.action,
		eventType: event.payload.eventType,
		actionSubjectId: event.payload.actionSubjectId,
		name: event.payload.name,
		tags: Array.from(tags),
		attributes: {
			packageName,
			packageVersion,
			...merge({}, extraAttributes, event.payload.attributes),
			componentHierarchy: components.join('.') || undefined,
			packageHierarchy: getPackageHierarchy(event),
			sourceHierarchy: sources.join('.') || undefined,
			listenerVersion,
		},
		nonPrivacySafeAttributes: event.payload.nonPrivacySafeAttributes,
	};

	return payload;
}
