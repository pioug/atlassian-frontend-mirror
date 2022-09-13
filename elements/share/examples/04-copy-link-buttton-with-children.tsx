import React from 'react';

import { CustomThemeButton } from '@atlaskit/button';

import { CopyLinkButton } from '../src/components/CopyLinkButton';

export default () => (
  <CopyLinkButton
    link={'http://atlassian.com'}
    copyLinkButtonText={'Copy link with Tooltip'}
    copiedToClipboardText={'Link copied to clipboard'}
  >
    <CustomThemeButton appearance="link">Fancy Button</CustomThemeButton>
  </CopyLinkButton>
);
