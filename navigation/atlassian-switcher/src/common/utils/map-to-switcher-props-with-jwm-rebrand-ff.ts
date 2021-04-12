/**
 * This will need to be removed once JWM rebrand is rolled out to 100%.
 */

import { SwitcherProductType } from '../../types';

import { AVAILABLE_PRODUCT_DATA_MAP } from './links';

export const getProductDataWithJwmRebrandFF = (
  productType: SwitcherProductType,
  jwmRebrandEnabled?: boolean,
) => {
  if (productType === SwitcherProductType.JIRA_BUSINESS && jwmRebrandEnabled) {
    return AVAILABLE_PRODUCT_DATA_MAP[SwitcherProductType.JIRA_WORK_MANAGEMENT];
  }
  return AVAILABLE_PRODUCT_DATA_MAP[productType];
};
