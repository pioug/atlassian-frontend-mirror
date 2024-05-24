import React from 'react';

import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { LinkIconButton } from '../../../../src/new';

const LinkIconButtonSubtleExample = () => {
  return (
    <LinkIconButton
      href="https://atlassian.com"
      appearance="subtle"
      icon={SettingsIcon}
      label="View settings"
    />
  );
};

export default LinkIconButtonSubtleExample;
