import {
  mapLegacyProductTypeToSwitcherType,
  getProductDataWithMystiqueFF,
} from '../../map-to-switcher-props-with-mystique-ff';
import { SwitcherProductType, ProductKey } from '../../../../types';
import { AVAILABLE_PRODUCT_DATA_MAP } from '../../links';

describe('map-to-switcher-props-with-mystique-ff', () => {
  describe('mapLegacyProductTypeToSwitcherType', () => {
    it('should map to JSD if mystique is falsy', () => {
      expect(
        mapLegacyProductTypeToSwitcherType(ProductKey.JIRA_SERVICE_DESK),
      ).toEqual(SwitcherProductType.JIRA_SERVICE_DESK);
    });
    it('should map to JSD if mystique is true', () => {
      expect(
        mapLegacyProductTypeToSwitcherType(ProductKey.JIRA_SERVICE_DESK, true),
      ).toEqual(SwitcherProductType.JIRA_SERVICE_DESK_MYSTIQUE);
    });
  });
  describe('getProductDataWithMystiqueFF', () => {
    for (let switcherItemType in SwitcherProductType) {
      if (switcherItemType === SwitcherProductType.JIRA_SERVICE_DESK) {
        it('should return JSD when isMystiqueEnabled is false', () => {
          expect(
            getProductDataWithMystiqueFF(
              SwitcherProductType.JIRA_SERVICE_DESK,
              false,
            ),
          ).toEqual(
            AVAILABLE_PRODUCT_DATA_MAP[SwitcherProductType.JIRA_SERVICE_DESK],
          );
        });
        it('should return JSD mystique when isMystiqueEnabled is true', () => {
          expect(
            getProductDataWithMystiqueFF(
              SwitcherProductType.JIRA_SERVICE_DESK,
              true,
            ),
          ).toEqual(
            AVAILABLE_PRODUCT_DATA_MAP[
              SwitcherProductType.JIRA_SERVICE_DESK_MYSTIQUE
            ],
          );
        });
        continue;
      }
      [true, false].forEach(ffValue => {
        it(`should return ${switcherItemType} when FF is ${ffValue}`, () => {
          const type = switcherItemType as SwitcherProductType;
          expect(getProductDataWithMystiqueFF(type, ffValue)).toEqual(
            AVAILABLE_PRODUCT_DATA_MAP[type],
          );
        });
      });
    }
  });
});
