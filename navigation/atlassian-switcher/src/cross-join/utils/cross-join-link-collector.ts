import { getJoinableSiteLinks, JoinableSiteItemType } from './cross-join-links';
import { isComplete, isError } from '../../common/providers/as-data-provider';
import { ProviderResults } from '../../types';

export function collectJoinableSiteLinks(
  joinableSites: ProviderResults['joinableSites'],
  features: {
    isMystiqueEnabled?: boolean;
  },
): JoinableSiteItemType[] | undefined {
  if (joinableSites === undefined || isError(joinableSites)) {
    return [];
  }

  if (isComplete(joinableSites)) {
    return getJoinableSiteLinks(joinableSites.data.sites, features);
  }
}
