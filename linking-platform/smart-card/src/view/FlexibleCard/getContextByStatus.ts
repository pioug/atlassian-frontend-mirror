import { InternalActionName, SmartLinkStatus } from '../../constants';
import extractFlexibleUiContext from '../../extractors/flexible';
import { extractHostName } from '../../extractors/flexible/extract-host-name';
import extractLinkTitle from '../../extractors/flexible/extract-link-title';
import extractProvider from '../../extractors/flexible/extract-provider';
import { extractSmartLinkPreviewImage } from '../../extractors/flexible/extract-smart-link-preview-image';
import { extractErrorIcon } from '../../extractors/flexible/icon/extract-error-icon';
import { type FlexibleUiDataContext } from '../../state/flexible-ui-context/types';
import { getRetryOptions } from './getRetryOptions';
import { type ExtractFlexibleUiDataContextParams } from './types';

export const getContextByStatus = (
	params: ExtractFlexibleUiDataContextParams,
): FlexibleUiDataContext | undefined => {
	const { onClick, response, status, url } = params ?? {};
	switch (status) {
		case SmartLinkStatus.Pending:
		case SmartLinkStatus.Resolving:
			return { linkTitle: extractLinkTitle(status, url, response, onClick), url };
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
				linkIcon: extractErrorIcon(response, status),
				linkTitle: extractLinkTitle(status, url, response, onClick),
				preview: extractSmartLinkPreviewImage(response),
				provider: extractProvider(response),
				actions: {
					[InternalActionName.UnresolvedAction]: getRetryOptions(
						url,
						status,
						response,
						params.onAuthorize,
					),
				},
				meta: {
					accessType: response?.meta?.requestAccess?.accessType,
				},
				hostName: extractHostName(response),
			};
	}
};
