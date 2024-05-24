import type { JsonLd } from "json-ld-types";

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { messages } from '../../../messages'
import { type AutomationActionData } from "../../../state/flexible-ui-context/types";

type ProductData = Pick<AutomationActionData, "siteAri" | "modalTitle" | "modalDescription">
type ProductDataMap = {
  [key: string]: {
    [key: string]: ProductData
  }
}

// This action will not be enabled by default for smart cards, which is opposite of the default behavior for actions.
// The AutomationAction will only appear if product/resourceType combination is handled by this function.
const getProductData = (meta: JsonLd.Meta.BaseMeta): ProductData | undefined => {
  const { tenantId } = meta;
  const product = meta.product as string;
  const resourceType = meta.resourceType as string;
  const ProductData: ProductDataMap = {
    'confluence': {
      'page': {
        //TODO extract to server
        siteAri: `ari:cloud:confluence::site/${tenantId}`,
        //TODO Move to AutomationAction
        modalTitle: messages.automation_action_confluence_page_modal_title,
        modalDescription: messages.automation_action_confluence_page_modal_description,
      }
    }
  }
  return ProductData?.[product]?.[resourceType];
}

export const extractAutomationAction = (
  response: JsonLd.Response
): AutomationActionData | undefined => {
  if (!getBooleanFF('platform.linking-platfom.smart-card.confluence.page.automation-action_xcdoi') || !response.data  ) {
    return undefined;
  }
  const data = response.data as JsonLd.Data.BaseData;
  const meta = response.meta as JsonLd.Meta.BaseMeta;

  const { name, "atlassian:ari": objectAri } = data;

  const productData = getProductData(meta);

  if (!productData) {
    return undefined;
  }

  return {
    ...productData,
    objectName: name,
    objectAri: objectAri,

    // TODO: The admin experience will be a follow up
    canManageAutomation: false,
    baseAutomationUrl: '',

    analyticsSource: 'smartCard',
  }
}
