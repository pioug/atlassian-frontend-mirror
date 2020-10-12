import { getAdministrationLinks } from './admin-links';
import { isComplete, isError } from '../../common/providers/as-data-provider';
import { Product, ProviderResults } from '../../types';

export function collectAdminLinks(
  managePermission: ProviderResults['managePermission'],
  addProductsPermission: ProviderResults['addProductsPermission'],
  isDiscoverMoreForEveryoneEnabled: boolean,
  isEmceeLinkEnabled: boolean,
  product?: Product,
  isDiscoverSectionEnabled?: boolean,
  adminUrl?: string,
) {
  if (isError(managePermission) || isError(addProductsPermission)) {
    return [];
  }

  if (isComplete(managePermission) && isComplete(addProductsPermission)) {
    if (managePermission.data || addProductsPermission.data) {
      return getAdministrationLinks(
        managePermission.data,
        isDiscoverMoreForEveryoneEnabled,
        isEmceeLinkEnabled,
        product,
        isDiscoverSectionEnabled,
        adminUrl,
      );
    }

    return [];
  }
}
