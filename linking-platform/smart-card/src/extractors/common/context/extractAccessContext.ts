import { type JsonLd } from 'json-ld-types';

import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import { messages } from '../../../messages';
import { ANALYTICS_CHANNEL } from '../../../utils/analytics';
import { ForbiddenAction } from '../../../view/BlockCard/actions/ForbiddenAction';
import { type RequestAccessContextProps } from '../../../view/types';
import extractHostname from '../hostname/extractHostname';

export const extractRequestAccessContextImproved = ({
	jsonLd,
	url,
	product,
	createAnalyticsEvent,
}: {
	jsonLd: JsonLd.Meta.BaseMeta;
	url: string;
	product: string;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
}): RequestAccessContextProps => {
	const requestAccess = jsonLd?.requestAccess
		? {
				...jsonLd?.requestAccess,
				hostname: extractHostname(url),
			}
		: undefined;
	switch (jsonLd?.requestAccess?.accessType) {
		case 'DIRECT_ACCESS':
			return {
				...requestAccess,
				titleMessageKey: 'direct_access_title',
				descriptiveMessageKey: 'direct_access_description',
				callToActionMessageKey: 'direct_access',
				action: ForbiddenAction(
					() => {
						if (createAnalyticsEvent !== undefined) {
							createAnalyticsEvent({
								action: 'clicked',
								actionSubject: 'button',
								actionSubjectId: 'crossJoin',
								eventType: 'ui',
							}).fire(ANALYTICS_CHANNEL);
						}
						window.open(url);
					},
					'direct_access',
					messages.direct_access,
					{ product },
				),
			};
		case 'REQUEST_ACCESS':
			return {
				...requestAccess,
				titleMessageKey: 'default_no_access_title',
				descriptiveMessageKey: 'request_access_description',
				callToActionMessageKey: 'request_access',
				action: ForbiddenAction(
					() => {
						if (createAnalyticsEvent !== undefined) {
							createAnalyticsEvent({
								action: 'clicked',
								actionSubject: 'button',
								actionSubjectId: 'requestAccess',
								eventType: 'ui',
							}).fire(ANALYTICS_CHANNEL);
						}

						window.open(url);
					},
					'request_access',
					messages.request_access,
				),
			};
		case 'PENDING_REQUEST_EXISTS':
			return {
				...requestAccess,
				titleMessageKey: 'request_access_pending_title',
				descriptiveMessageKey: 'request_access_pending_description',
				callToActionMessageKey: 'request_access_pending',
				action: ForbiddenAction(
					() => window.open(url),
					'request_access_pending',
					messages.request_access_pending,
				),
				buttonDisabled: true,
			};
		case 'DENIED_REQUEST_EXISTS':
			return {
				...requestAccess,
				titleMessageKey: 'forbidden_title',
				descriptiveMessageKey: 'request_denied_description',
			};
		case 'ACCESS_EXISTS':
			if (jsonLd?.visibility === 'not_found') {
				return {
					...requestAccess,
					titleMessageKey: 'not_found_title',
					descriptiveMessageKey: 'not_found_description',
				};
			}

			return {
				...requestAccess,
				titleMessageKey: 'forbidden_title',
				descriptiveMessageKey: 'access_exists_description',
				callToActionMessageKey: 'request_access',
				action: ForbiddenAction(
					() => {
						if (createAnalyticsEvent !== undefined) {
							createAnalyticsEvent({
								action: 'clicked',
								actionSubject: 'button',
								actionSubjectId: 'requestAccess',
								eventType: 'ui',
							}).fire(ANALYTICS_CHANNEL);
						}

						window.open(url);
					},
					'access_exists',
					messages.request_access,
				),
			};
		case 'FORBIDDEN':
			return {
				...requestAccess,
				titleMessageKey: 'forbidden_title',
				descriptiveMessageKey: 'forbidden_description',
			};
		default:
			return requestAccess;
	}
};
