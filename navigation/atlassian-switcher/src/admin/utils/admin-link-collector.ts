import { getAdministrationLinks } from './admin-links';
import { isComplete, isError } from '../../common/providers/as-data-provider';
import { ProviderResults } from '../../types';

export function collectAdminLinks(
  managePermission: ProviderResults['managePermission'],
  addProductsPermission: ProviderResults['addProductsPermission'],
  adminUrl?: string,
) {
  if (isError(managePermission) || isError(addProductsPermission)) {
    return [];
  }

  if (isComplete(managePermission) && isComplete(addProductsPermission)) {
    if (managePermission.data || addProductsPermission.data) {
      return getAdministrationLinks(managePermission.data, adminUrl);
    }

    return [];
  }
}
