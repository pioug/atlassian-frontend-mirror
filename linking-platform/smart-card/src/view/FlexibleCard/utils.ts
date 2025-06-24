import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractSmartLinkProvider } from '@atlaskit/link-extractors';
import { type SmartLinkResponse } from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import { InternalActionName, SmartLinkStatus } from '../../constants';
import { extractRequestAccessContextImproved } from '../../extractors/common/context';
import extractFlexibleUiContext from '../../extractors/flexible';
import extractLinkTitle from '../../extractors/flexible/extract-link-title';
import { extractSmartLinkPreviewImage } from '../../extractors/flexible/extract-preview';
import { extractErrorIcon } from '../../extractors/flexible/icon';
import { extractSmartLinkProviderIcon } from '../../extractors/flexible/icon/extract-provider-icon';
import { type MessageKey, messages } from '../../messages';
import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { handleOnClick } from '../../utils';
import { getForbiddenJsonLd } from '../../utils/jsonld';

import { type ExtractFlexibleUiDataContextParams, type RetryOptions } from './types';

export const getContextByStatus = (
	params: ExtractFlexibleUiDataContextParams,
): FlexibleUiDataContext | undefined => {
	const { onClick, response, status, url } = params ?? {};
	switch (status) {
		case SmartLinkStatus.Pending:
		case SmartLinkStatus.Resolving:
			return fg('platform-linking-flexible-card-context')
				? { linkTitle: extractLinkTitle(status, url, response, onClick), url }
				: { title: url, url };
		case SmartLinkStatus.Resolved:
			return extractFlexibleUiContext(params);
		case SmartLinkStatus.Unauthorized:
		case SmartLinkStatus.Forbidden:
		case SmartLinkStatus.NotFound:
		case SmartLinkStatus.Errored:
		case SmartLinkStatus.Fallback:
		default:
			return {
				url,
				title: fg('platform-linking-flexible-card-context') ? undefined : url,
				linkIcon: extractErrorIcon(response, status),
				linkTitle: fg('platform-linking-flexible-card-context')
					? extractLinkTitle(status, url, response, onClick)
					: undefined,
				preview: extractSmartLinkPreviewImage(response),
				provider: extractSmartLinkProviderIcon(response),
				actions: fg('platform-linking-flexible-card-unresolved-action')
					? {
							[InternalActionName.UnresolvedAction]: getRetryOptions(
								url,
								status,
								response,
								params.onAuthorize,
							),
						}
					: undefined,
				...(fg('bandicoots-smart-card-teamwork-context')
					? {
							meta: {
								accessType: response?.meta?.requestAccess?.accessType,
							},
						}
					: undefined),
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
