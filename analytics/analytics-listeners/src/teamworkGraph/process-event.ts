import last from 'lodash/last';
import merge from 'lodash/merge';

import { DEFAULT_SOURCE, type GasPayload } from '@atlaskit/analytics-gas-types';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { getComponents } from '../atlaskit/get-components';
import { getExtraAttributes } from '../atlaskit/get-extra-attributes';
import { getPackageHierarchy } from '../atlaskit/get-package-hierarchy';
import { getPackageInfo } from '../atlaskit/get-package-info';
import { getSources } from '../atlaskit/get-sources';

const listenerVersion = process.env._PACKAGE_VERSION_ as string;

export function processEvent(event: UIAnalyticsEvent): GasPayload {
	const sources = getSources(event);
	const { packageName, packageVersion } = last(getPackageInfo(event)) || ({} as any);

	const extraAttributes = getExtraAttributes(event);
	const tags: GasPayload['tags'] = event.payload.tags?.length
		? Array.from(new Set(event.payload.tags as string[]))
		: undefined;

	const components = getComponents(event);

	const payload = {
		source: last(sources) || DEFAULT_SOURCE,
		actionSubject: event.payload.actionSubject,
		action: event.payload.action,
		eventType: event.payload.eventType,
		actionSubjectId: event.payload.actionSubjectId,
		name: event.payload.name,
		...(tags ? { tags } : {}),
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
