import {
	DEFAULT_SOURCE,
	UI_EVENT_TYPE,
	SCREEN_EVENT_TYPE,
	TRACK_EVENT_TYPE,
	OPERATIONAL_EVENT_TYPE,
	type GasPayload,
	type GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

import type Logger from '../helpers/logger';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { OMNI_CHANNEL_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import {
	getSources,
	getExtraAttributes,
	getPackageInfo,
	getComponents,
} from '../helpers/extract-data-from-event';
import last from 'lodash/last';
import merge from 'lodash/merge';
import { FabricChannel } from '../types';
const listenerVersion = process.env._PACKAGE_VERSION_ as string;

export default (
	event: UIAnalyticsEvent,
	logger: Logger,
): GasPayload | GasScreenEventPayload | null => {
	const sources = getSources(event, OMNI_CHANNEL_CONTEXT);
	const source = last(sources) || DEFAULT_SOURCE;
	const extraAttributes = getExtraAttributes(event, OMNI_CHANNEL_CONTEXT);
	const components = getComponents(event, OMNI_CHANNEL_CONTEXT);

	const packages = getPackageInfo(event, OMNI_CHANNEL_CONTEXT);
	const { packageName, packageVersion } =
		last(getPackageInfo(event, OMNI_CHANNEL_CONTEXT)) || ({} as any);
	const packageHierarchy = packages.map((p) =>
		p.packageVersion ? `${p.packageName}@${p.packageVersion}` : p.packageName,
	);

	const {
		eventType = UI_EVENT_TYPE,
		action,
		actionSubject,
		actionSubjectId,
		attributes: payloadAttributes,
		name,
	} = event.payload;
	const attributes = {
		listenerVersion,
		sourceHierarchy: sources.join('.') || undefined,
		componentHierarchy: components.join('.') || undefined,
		packageHierarchy: packageHierarchy.join(',') || undefined,
		...{ packageName, packageVersion },
		...merge(extraAttributes, payloadAttributes),
	};
	// Ensure navigation tag is not duplicated by using Set
	const tags: Set<string> = new Set(event.payload.tags || []);
	tags.add(FabricChannel.omniChannel);

	if (event.payload) {
		switch (eventType) {
			case UI_EVENT_TYPE:
			case OPERATIONAL_EVENT_TYPE:
			case TRACK_EVENT_TYPE:
				return {
					eventType,
					source,
					actionSubject,
					action,
					actionSubjectId,
					attributes,
					tags: Array.from(tags),
				} as any;
			case SCREEN_EVENT_TYPE:
				return {
					eventType,
					name,
					attributes,
					tags: Array.from(tags),
				};
			default:
				logger.error('Invalid event type', eventType);
				break;
		}
	}

	return null;
};
