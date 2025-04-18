import type { JsonLd } from '@atlaskit/json-ld-types';

import { ActionName } from '../../../constants';
import { type AutomationActionData } from '../../../state/flexible-ui-context/types';

export const extractAutomationAction = (
	response: JsonLd.Response,
): AutomationActionData | undefined => {
	if (!response.data) {
		return undefined;
	}
	if (!response?.meta?.supportedFeature?.includes(ActionName.AutomationAction)) {
		return undefined;
	}
	const data = response.data as JsonLd.Data.BaseData;
	const meta = response.meta as JsonLd.Meta.BaseMeta;

	const { name, 'atlassian:ari': objectAri } = data;
	const { product, tenantId, resourceType } = meta;

	return {
		product: product,
		resourceType: resourceType,
		siteAri: `ari:cloud:${product}::site/${tenantId}`,
		objectName: name,
		objectAri: objectAri,
		// TODO: The admin experience will be a follow up
		canManageAutomation: false,
		baseAutomationUrl: '',
		analyticsSource: 'smartCardAutomationAction',
	};
};
