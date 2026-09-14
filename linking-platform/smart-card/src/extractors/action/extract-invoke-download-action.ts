import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import { extractSmartLinkDownloadUrl } from '@atlaskit/link-extractors/extract-smart-link-download-url';

import { ActionName, CardAction } from '../../constants';
import { getDefinitionId } from '../../state/getDefinitionId';
import { getExtensionKey } from '../../state/getExtensionKey';
import { getResourceType } from '../../state/getResourceType';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { downloadUrl as download } from '../../utils/download-url';
import { canShowAction } from '../../utils/actions/can-show-action';
import { getActionsFromJsonLd } from '../common/actions/extractActions';
import { type ExtractClientActionsParam } from './types';

export const extractInvokeDownloadAction = ({
	actionOptions,
	appearance,
	id,
	response,
}: ExtractClientActionsParam): InvokeClientActionProps | undefined => {
	if (!canShowAction(CardAction.DownloadAction, actionOptions)) {
		return;
	}

	const data = response.data as JsonLd.Data.BaseData;
	const downloadActionExists = getActionsFromJsonLd(data).find(
		(action) => action['@type'] === 'DownloadAction',
	);

	if (downloadActionExists) {
		const downloadUrl = extractSmartLinkDownloadUrl(response);
		return {
			actionFn: async () => download(downloadUrl),
			actionSubjectId: 'downloadDocument',
			actionType: ActionName.DownloadAction,
			definitionId: getDefinitionId(response),
			display: appearance,
			extensionKey: getExtensionKey(response),
			id,
			resourceType: getResourceType(response),
		};
	}
};
