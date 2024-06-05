import type { JsonLd } from "json-ld-types";

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { type AutomationActionData } from "../../../state/flexible-ui-context/types";
import { ActionName } from '../../../constants';

export const extractAutomationAction = (
  response: JsonLd.Response
): AutomationActionData | undefined => {
  if (!getBooleanFF('platform.linking-platfom.smart-card.confluence.page.automation-action_xcdoi') || !response.data  ) {
    return undefined;
  }
  if (!response?.meta?.supportedFeature?.includes(ActionName.AutomationAction)) {
    return undefined;
  }
  const data = response.data as JsonLd.Data.BaseData;
  const meta = response.meta as JsonLd.Meta.BaseMeta;

  const { name, "atlassian:ari": objectAri } = data;
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
  }
}
