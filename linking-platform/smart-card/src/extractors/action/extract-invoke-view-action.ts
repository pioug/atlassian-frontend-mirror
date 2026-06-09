import { type JsonLd } from '@atlaskit/json-ld-types';
import { extractLink } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import { CardAction } from '../../constants';
import { getDefinitionId, getExtensionKey, getResourceType } from '../../state/helpers';
import { type InvokeClientActionProps } from '../../state/hooks/use-invoke-client-action/types';
import { openUrl } from '../../utils';
import { canShowAction } from '../../utils/actions/can-show-action';
import { getActionsFromJsonLd } from '../common/actions/extractActions';

import { type ExtractClientActionsParam, type TransformUrlFn } from './types';

export type ExtractInvokeViewActionParam = ExtractClientActionsParam & {
	transformUrl?: TransformUrlFn;
}
export const extractInvokeViewAction = (
	{ actionOptions, appearance, transformUrl, id, response }: ExtractInvokeViewActionParam,
	force?: boolean,
): InvokeClientActionProps | undefined => {
	if (!canShowAction(CardAction.ViewAction, actionOptions)) {
		return;
	}
	const data = response.data as JsonLd.Data.BaseData;
	if (!data) {
		return;
	}
	const url = extractLink(data);
	const viewActionExists = getActionsFromJsonLd(data).find(
		(action) => action['@type'] === 'ViewAction',
	);

	if (url && (viewActionExists || force)) {
		return {
			actionFn: async () => {
				if (fg('platform_smartlink_xpc_url_wrapping')) {
					const destinationUrl = transformUrl?.(url) ?? url;
					return openUrl(destinationUrl);
				}
				return openUrl(url);
			},
			actionSubjectId: 'shortcutGoToLink',
			actionType: 'ViewAction',
			definitionId: getDefinitionId(response),
			display: appearance,
			extensionKey: getExtensionKey(response),
			id,
			resourceType: getResourceType(response),
		};
	}
};
