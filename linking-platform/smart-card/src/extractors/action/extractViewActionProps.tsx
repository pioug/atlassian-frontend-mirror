import { type JsonLd } from 'json-ld-types';

import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { openUrl } from '../../utils';
import { type ExtractActionsProps } from '../common/actions/types';
import { extractViewAction as extractViewActionData } from '../flexible/actions/extract-view-action';

export const extractViewActionProps = ({
	response,
	actionOptions,
	extensionKey = 'empty-object-provider',
	source = 'block',
}: ExtractActionsProps): InvokeClientActionProps | undefined => {
	const data = extractViewActionData(response.data as JsonLd.Data.BaseData, actionOptions);

	if (data) {
		return {
			actionType: 'ViewAction',
			actionFn: () => openUrl(data.viewUrl),
			display: source,
			extensionKey,
		};
	}
};
