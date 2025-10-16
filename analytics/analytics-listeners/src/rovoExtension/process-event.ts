import last from 'lodash/last';
import merge from 'lodash/merge';

import {
	DEFAULT_SOURCE,
	UI_EVENT_TYPE,
	SCREEN_EVENT_TYPE,
	TRACK_EVENT_TYPE,
	OPERATIONAL_EVENT_TYPE,
	type GasPayload,
	type GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

import {
	getSources,
	getExtraAttributes,
	getPackageInfo,
	getComponents,
} from '../helpers/extract-data-from-event';
import type Logger from '../helpers/logger';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ROVO_EXTENSION_CONTEXT } from '@atlaskit/analytics-namespaced-context';

const ROVO_EXTENSION_TAG = 'rovoExtension'
const listenerVersion = process.env._PACKAGE_VERSION_ as string;

/**
 * This util exists to convert the analytics-next event format into the analytics platform format.
 *
 * It's a copy paste from the other process-event mappers.
 */

export default (
	event: UIAnalyticsEvent,
	logger: Logger,
): GasPayload | GasScreenEventPayload | null => {
	const sources = getSources(event, ROVO_EXTENSION_CONTEXT);
	const source = last(sources) || DEFAULT_SOURCE;
	const extraAttributes = getExtraAttributes(event, ROVO_EXTENSION_CONTEXT);
	const components = getComponents(event, ROVO_EXTENSION_CONTEXT);
	const packages = getPackageInfo(event, ROVO_EXTENSION_CONTEXT);
	const { packageName, packageVersion } = last(getPackageInfo(event, ROVO_EXTENSION_CONTEXT)) || ({} as any);
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

	const tags: Set<string> = new Set(event.payload.tags || []);

	// "rovoExtension" allows us to differentiate our events from rovo events.
	tags.add(ROVO_EXTENSION_TAG);

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