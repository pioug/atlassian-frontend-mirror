import { type JsonLd } from '@atlaskit/json-ld-types';
import {
	extractProvider,
	extractSmartLinkProvider,
	isEntityPresent,
} from '@atlaskit/link-extractors';
import { SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { InternalActionName, SmartLinkStatus } from '../../constants';
import { extractRequestAccessContextImproved } from '../../extractors/common/context';
import extractFlexibleUiContext from '../../extractors/flexible';
import extractPreview, {
	extractSmartLinkPreviewImage,
} from '../../extractors/flexible/extract-preview';
import { extractErrorIcon } from '../../extractors/flexible/icon';
import extractProviderIcon, {
	extractSmartLinkProviderIcon,
} from '../../extractors/flexible/icon/extract-provider-icon';
import { type MessageKey, messages } from '../../messages';
import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { handleOnClick } from '../../utils';
import { getEmptyJsonLd, getForbiddenJsonLd } from '../../utils/jsonld';

import { type ExtractFlexibleUiDataContextParams, type RetryOptions } from './types';

export const getContextByStatus = (
	params: ExtractFlexibleUiDataContextParams,
): FlexibleUiDataContext | undefined => {
	const { response, status, url } = params ?? {};
	switch (status) {
		case SmartLinkStatus.Pending:
		case SmartLinkStatus.Resolving:
			return { title: url, url };
		case SmartLinkStatus.Resolved:
			return extractFlexibleUiContext(params);
		case SmartLinkStatus.Unauthorized:
		case SmartLinkStatus.Forbidden:
		case SmartLinkStatus.NotFound:
		case SmartLinkStatus.Errored:
		case SmartLinkStatus.Fallback:
		default:
			const actions = fg('platform-linking-flexible-card-unresolved-action')
				? {
						[InternalActionName.UnresolvedAction]: getRetryOptions(
							url,
							status,
							response,
							params.onAuthorize,
						),
					}
				: undefined;

			if (fg('smart_links_noun_support')) {
				if (isEntityPresent(response)) {
					return {
						url,
						title: url,
						linkIcon: extractErrorIcon(response, status),
						preview: extractSmartLinkPreviewImage(response),
						provider: extractSmartLinkProviderIcon(response),
						actions,
					};
				}
			}

			return {
				url,
				title: url,
				linkIcon: extractErrorIcon(response, status),
				preview: extractPreview(response?.data as JsonLd.Data.BaseData),
				provider: extractProviderIcon(response?.data as JsonLd.Data.BaseData),
				actions,
			};
	}
};

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
	const data = (response && response.data) || getEmptyJsonLd();
	const provider = fg('smart_links_noun_support')
		? extractSmartLinkProvider(response)
		: extractProvider(data as JsonLd.Data.BaseData);

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
