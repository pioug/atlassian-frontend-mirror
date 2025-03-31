import type { JsonLd } from '@atlaskit/json-ld-types';

import { ActionName, CardAction } from '../../index';
import { getDefinitionId, getExtensionKey, getResourceType } from '../../state/helpers';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { downloadUrl as download } from '../../utils';
import { canShowAction } from '../../utils/actions/can-show-action';
import { getActionsFromJsonLd } from '../common/actions/extractActions';
import { extractDownloadUrl } from '../common/download/extractDownloadUrl';

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
		const downloadUrl = extractDownloadUrl(data as JsonLd.Data.Document);
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
