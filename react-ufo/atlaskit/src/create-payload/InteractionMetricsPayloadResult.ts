import { type getPageVisibilityTimeline } from '../hidden-timing';
import {
	type createMemoryStateReport,
	type createPressureStateReport,
} from '../machine-utilisation';

export /**
 * The return type of createInteractionMetricsPayload.
 *
 * This is the GASv3 event envelope containing the interaction metrics payload
 * in `attributes.properties`. The properties object contains a mix of
 * well-known keys (event:*, metric:*, ufo:*, ssr:*, experience:*, interactionMetrics)
 * and dynamic keys from various helper functions.
 *
 * For a more detailed schema of the payload shape, see ReactUFOPayload in
 * `../common/react-ufo-payload-schema.ts`.
 */
type InteractionMetricsPayloadResult = {
	actionSubject: string;
	action: string;
	eventType: string;
	source: string;
	tags: string[];
	attributes: {
		properties: {
			'event:hostname': string;
			'event:product': string;
			'event:population': string;
			'event:schema': string;
			'event:sizeInKb': number;
			'event:source': {
				name: string;
				version: string;
			};
			'event:region': string;
			'experience:key': string;
			'experience:name': string;
			'event:cpu:usage': ReturnType<typeof createPressureStateReport>;
			'event:memory:usage': ReturnType<typeof createMemoryStateReport>;
			'ufo:pageVisibilityHiddenTimestamp': number | undefined;
			'ufo:wasPageHiddenBeforeInit': boolean | undefined;
			'ufo:isOpenedInBackground': boolean | undefined;
			'ufo:isTabThrottled': boolean | undefined;
			'ufo:pageVisibilityTimeline': ReturnType<typeof getPageVisibilityTimeline>;
			interactionMetrics: {
				[key: string]: unknown;
			};
			'ufo:payloadTime': number;
			[key: string]: unknown;
		};
	};
};
