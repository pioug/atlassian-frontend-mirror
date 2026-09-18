import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors/extract-smart-link-provider';
import type { SmartLinkResponse } from '@atlaskit/linking-types/smart-link';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { SmartLinkStatus } from '../../constants';
import { extractRequestAccessContextImproved } from '../../extractors/common/context/extractAccessContext';
import { type MessageKey, messages } from '../../messages';
import { getForbiddenJsonLd } from '../../utils/get-forbidden-json-ld';
import { handleOnClick } from '../../utils/handle-on-click';
import { type RetryOptions } from './types';

const getForbiddenMessageKey = (meta: JsonLd.Meta.BaseMeta): MessageKey => {
	const accessType = meta?.requestAccess?.accessType;
	switch (accessType) {
		case 'DIRECT_ACCESS':
			return fg('confluence-issue-terminology-refresh')
				? 'join_to_viewIssueTermRefresh'
				: 'join_to_view';
		case 'REQUEST_ACCESS':
			return fg('confluence-issue-terminology-refresh')
				? 'request_access_to_viewIssueTermRefresh'
				: 'request_access_to_view';
		case 'PENDING_REQUEST_EXISTS':
			return 'pending_request';
		case 'FORBIDDEN':
			return 'forbidden_access';
		case 'DENIED_REQUEST_EXISTS':
			return 'request_denied';
		default:
			return 'restricted_link';
	}
};

export const getRetryOptions = (
	url: string,
	status?: SmartLinkStatus,
	response?: SmartLinkResponse,
	onAuthorize?: (() => void) | undefined,
): RetryOptions | undefined => {
	const provider = extractSmartLinkProvider(response);

	const context = provider?.text;
	const values = context ? { context } : undefined;
	switch (status) {
		case SmartLinkStatus.Forbidden:
			const meta = response?.meta ?? getForbiddenJsonLd().meta;
			const access = extractRequestAccessContextImproved({
				jsonLd: meta,
				url,
				product: context ?? '',
			});
			const messageKey = getForbiddenMessageKey(meta);
			const descriptor = messages[messageKey as MessageKey];
			const retry = onAuthorize || access?.action?.promise;
			const onClick =
				retry && !(access?.buttonDisabled ?? false) ? handleOnClick(retry) : undefined;
			return { descriptor, onClick, values };
		case SmartLinkStatus.Unauthorized:
			return onAuthorize
				? {
						descriptor: messages.connect_link_account_card_name,
						onClick: handleOnClick(onAuthorize),
						values,
					}
				: undefined;
		case SmartLinkStatus.NotFound:
			return { descriptor: messages.cannot_find_link };
	}
};
