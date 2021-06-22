import {
  getAdministrationLinks,
  getAdministrationLinksNext,
} from './admin-links';
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

export function collectAdminLinksNext(
  managePermission: ProviderResults['managePermission'],
  adminUrl?: string,
) {
  if (isError(managePermission)) {
    return [];
  }

  if (isComplete(managePermission)) {
    if (managePermission.data) {
      return getAdministrationLinksNext(adminUrl);
    }
    return [];
  }
}
