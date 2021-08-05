import React from 'react';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';
import { SwitcherItemType } from '../../common/utils/links';
import FormattedMessage from '../../ui/primitives/formatted-message';
import { createIcon } from '../../common/utils/icon-themes';
import messages from '../../common/utils/messages';

export const getAdministrationLinks = (
  adminUrl?: string,
): SwitcherItemType[] => {
  return [
    {
      key: 'administration',
      label: <FormattedMessage {...messages.administration} />,
      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
      href: adminUrl || `/admin`,
    },
  ];
};
