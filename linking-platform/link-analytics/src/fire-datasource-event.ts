import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE } from '@atlaskit/link-client-extension/use-data-source-client-extension';
import { getStatus } from '@atlaskit/linking-common/utils/get-status';
import {
	type DatasourceDataRequest,
	type DatasourceDataResponse,
} from '@atlaskit/linking-types/datasource';

import type { LinkCreatedAttributesType } from './common/utils/analytics/analytics.types';
import createEventPayload from './common/utils/analytics/create-event-payload';
import { EVENT_CHANNEL } from './common/utils/constants';
import { PACKAGE_DATA } from './fire-event';
import { type DatasourceLifecycleEventCallback, type LifecycleAction } from './types';
import { getDomainFromUrl } from './utils/get-domain-from-url';
import { mergeAttributes } from './utils/merge-attributes';

export const fireDatasourceEvent = (
	action: LifecycleAction,
	createAnalyticsEvent: CreateUIAnalyticsEvent,
	getDatasourceData: (
		datasourceId: string,
		data: DatasourceDataRequest,
		force?: any,
	) => Promise<DatasourceDataResponse>,
): DatasourceLifecycleEventCallback => {
	return async (details, sourceEvent, attributes = {}) => {
		const {
			data: { totalCount: totalItemCount, schema },
			meta,
			meta: { extensionKey, destinationObjectTypes },
		} = await getDatasourceData(details.datasourceId, {
			parameters: details.parameters,
			// Currently, pageSize doesn't change the values we are interested in
			pageSize: DEFAULT_GET_DATASOURCE_DATA_PAGE_SIZE,
			includeSchema: true,
			fields: [],
		});
		const status = getStatus({ meta });

		const resolvedAttributes = {
			extensionKey,
			status: status,
			destinationObjectTypes,
			totalItemCount,
			displayedColumnCount: schema?.defaultProperties?.length ?? schema?.properties?.length,
		};

		const mergedAttributes = mergeAttributes(
			action,
			{ ...details, url: details.url ?? 'unknown' },
			sourceEvent,
			{
				...resolvedAttributes,
				...attributes,
			},
		);

		const payload = createEventPayload(`track.datasource.${action}`, mergedAttributes);

		const event = createAnalyticsEvent({
			...payload,
			nonPrivacySafeAttributes: {
				domainName: details.url ? getDomainFromUrl(details.url) : '',
			},
		});

		if (extensionKey === 'jira-object-provider' && action === 'created') {
			// macro inserted event name is consistent with what confluence uses for JIM inserts
			const payload = createEventPayload(`track.macro.inserted`, {
				...(mergedAttributes as LinkCreatedAttributesType),
			});

			createAnalyticsEvent({
				...payload,
				actionSubjectId: 'jlol',
			}).fire(EVENT_CHANNEL);
		}

		event.context.push(PACKAGE_DATA);
		event.fire(EVENT_CHANNEL);
	};
};
