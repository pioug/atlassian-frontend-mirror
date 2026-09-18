/**
 * Inspired by analytics-web-react
 */

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
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { getComponents } from '../helpers/get-components';
import { getExtraAttributes } from '../helpers/get-extra-attributes';
import { getPackageInfo } from '../helpers/get-package-info';
import { getSources } from '../helpers/get-sources';
import type Logger from '../helpers/logger';

const A2UI_CONTEXT = 'a2ui';
const A2UI_TAG = 'a2ui';
const listenerVersion = process.env._PACKAGE_VERSION_ as string;

/**
 * This util exists to convert A2UI analytics-next events into the analytics platform format.
 */
export default (
	event: UIAnalyticsEvent,
	logger: Logger,
): GasPayload | GasScreenEventPayload | null => {
	const sources = getSources(event, A2UI_CONTEXT);
	const source = last(sources) || DEFAULT_SOURCE;
	const extraAttributes = getExtraAttributes(event, A2UI_CONTEXT);
	const components = getComponents(event, A2UI_CONTEXT);

	const packages = getPackageInfo(event, A2UI_CONTEXT);
	const { packageName, packageVersion } =
		last(packages) ?? ({} as { packageName?: string; packageVersion?: string });
	const packageHierarchy = packages.map((p) =>
		p.packageVersion ? `${p.packageName}@${p.packageVersion}` : p.packageName,
	);

	const {
		eventType = UI_EVENT_TYPE,
		action,
		actionSubject,
		actionSubjectId,
		attributes: payloadAttributes,
		containerId,
		containerType,
		name,
		objectId,
		objectType,
		path,
		url,
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
	tags.add(A2UI_TAG);

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
				...(objectId && { objectId }),
				...(objectType && { objectType }),
				...(containerType && { containerType }),
				...(containerId && { containerId }),
			};
		case SCREEN_EVENT_TYPE:
			return {
				eventType,
				name,
				attributes,
				tags: Array.from(tags),
				...(path && { path }),
				...(url && { url }),
			};
		default:
			logger.error('Invalid event type', eventType);
			break;
	}

	return null;
};
