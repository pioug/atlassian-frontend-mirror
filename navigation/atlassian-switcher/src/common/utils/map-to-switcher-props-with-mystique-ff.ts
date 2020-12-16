/**
 * This will need to cleaned up after Mystique is properly released
 */
import { SwitcherProductType, ProductKey } from '../../types';
import { AVAILABLE_PRODUCT_DATA_MAP, TO_SWITCHER_PRODUCT_KEY } from './links';

export const mapLegacyProductTypeToSwitcherType = (
  productKey: ProductKey,
  isMystiqueEnabled?: boolean,
): SwitcherProductType => {
  const key = TO_SWITCHER_PRODUCT_KEY[productKey];
  if (isMystiqueEnabled && key === SwitcherProductType.JIRA_SERVICE_DESK) {
    return SwitcherProductType.JIRA_SERVICE_DESK_MYSTIQUE;
  }
  return key;
};

export const getProductDataWithMystiqueFF = (
  productType: SwitcherProductType,
  isMystiqueEnabled?: boolean,
) => {
  if (
    productType === SwitcherProductType.JIRA_SERVICE_DESK &&
    isMystiqueEnabled
  ) {
    return AVAILABLE_PRODUCT_DATA_MAP[
      SwitcherProductType.JIRA_SERVICE_DESK_MYSTIQUE
    ];
  }
  return AVAILABLE_PRODUCT_DATA_MAP[productType];
};
