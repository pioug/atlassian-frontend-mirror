import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type CardClient from '@atlaskit/link-provider/client';

import createEventPayload from './common/utils/analytics/create-event-payload';
import { EVENT_CHANNEL } from './common/utils/constants';
import { type LinkLifecycleEventCallback, type LifecycleAction, type CardStore } from './types';
import { getDomainFromUrl } from './utils/get-domain-from-url';
import { mergeAttributes } from './utils/merge-attributes';
import { resolveAttributes } from './utils/resolve-attributes';

export const PACKAGE_DATA: any = {
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

const fireEvent = (
	action: LifecycleAction,
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	client: CardClient,
	store: CardStore,
): LinkLifecycleEventCallback => {
	return async (details, sourceEvent, attributes = {}) => {
		const resolvedAttributes = await resolveAttributes(details, client, store);

		const mergedAttributes = mergeAttributes(action, details, sourceEvent, {
			...attributes,
			...resolvedAttributes,
		});

		const payload = createEventPayload(`track.link.${action}`, mergedAttributes);

		const event = createAnalyticsEvent({
			...payload,
			nonPrivacySafeAttributes: {
				domainName: getDomainFromUrl(details.url),
			},
		});

		event.context.push(PACKAGE_DATA);
		event.fire(EVENT_CHANNEL);
	};
};

export default fireEvent;
