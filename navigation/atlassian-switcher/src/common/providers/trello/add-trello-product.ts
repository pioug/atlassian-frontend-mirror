import { createResultComplete, isComplete } from '../as-data-provider';
import {
  AvailableSite,
  SwitcherProductType,
  Product,
  ProviderResults,
} from '../../../types';

export const addTrelloProduct = (
  availableProducts: ProviderResults['availableProducts'],
): ProviderResults['availableProducts'] => {
  if (isComplete(availableProducts)) {
    //TEAMX-162: APS will start returning trello as an available site for users that have it in perms
    //if trello is in the response there is no need to add it as this will cause duplication and we can return here.
    if (
      availableProducts.data.sites &&
      availableProducts.data.sites.find(s => s.cloudId === Product.TRELLO)
    ) {
      return createResultComplete(availableProducts.data);
    }

    return createResultComplete({
      unstableFeatures: availableProducts.data.unstableFeatures,
      isPartial: availableProducts.data.isPartial,
      sites: [
        ...availableProducts.data.sites,
        {
          adminAccess: false,
          availableProducts: [
            {
              productType: SwitcherProductType.TRELLO,
              url: window.location.origin,
            },
          ],
          cloudId: Product.TRELLO,
          displayName: 'Trello',
          url: window.location.origin,
          avatar: null,
        } as AvailableSite,
      ],
    });
  }
  return availableProducts;
};
