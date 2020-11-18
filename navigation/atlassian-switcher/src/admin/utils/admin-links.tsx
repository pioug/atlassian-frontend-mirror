import React from 'react';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';
import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import { Product, DiscoverLinkItemKeys } from '../../types';
import { SwitcherItemType, getEmceeLink } from '../../common/utils/links';
import FormattedMessage from '../../ui/primitives/formatted-message';
import { createIcon } from '../../common/utils/icon-themes';
import messages from '../../common/utils/messages';

export const getAdministrationLinks = (
  isAdmin: boolean,
  isDiscoverMoreForEveryoneEnabled: boolean,
  isEmceeLinkEnabled: boolean,
  product?: Product,
  isDiscoverSectionEnabled?: boolean,
  adminUrl?: string,
): SwitcherItemType[] => {
  const adminBaseUrl = isAdmin ? `/admin` : '/trusted-admin';
  const adminLinks: SwitcherItemType[] = [
    {
      key: 'administration',
      label: <FormattedMessage {...messages.administration} />,
      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
      href: adminUrl || adminBaseUrl,
    },
  ];

  if (isDiscoverSectionEnabled) {
    return adminLinks;
  }

  const emceeLink = isEmceeLinkEnabled && getEmceeLink(product);
  if (emceeLink) {
    adminLinks.unshift(emceeLink);
  }

  // If a custom admin URL is provided, it's likely that /billing/addapplication path is not supported
  if (!isDiscoverMoreForEveryoneEnabled && !adminUrl) {
    adminLinks.unshift({
      key: DiscoverLinkItemKeys.DISCOVER_MORE,
      label: <FormattedMessage {...messages.moreAtlassianProductsLink} />,
      Icon: createIcon(DiscoverFilledGlyph, { size: 'medium' }),
      href: `${adminBaseUrl}/billing/addapplication`,
    });
  }
  return adminLinks;
};
