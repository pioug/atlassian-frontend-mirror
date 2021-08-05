import { getAdministrationLinks } from './admin-links';
import { isComplete, isError } from '../../common/providers/as-data-provider';
import { ProviderResults } from '../../types';

export function collectAdminLinks(
  managePermission: ProviderResults['managePermission'],
  adminUrl?: string,
) {
  if (isError(managePermission)) {
    return [];
  }

  if (isComplete(managePermission)) {
    if (managePermission.data) {
      return getAdministrationLinks(adminUrl);
    }
    return [];
  }
}
