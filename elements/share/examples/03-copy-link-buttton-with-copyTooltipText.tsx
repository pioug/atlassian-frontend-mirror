import React from 'react';

import { CopyLinkButton } from '../src/components/CopyLinkButton';

export default () => (
  <CopyLinkButton
    link={'http://atlassian.com'}
    copyLinkButtonText={'Copy link with Tooltip'}
    copiedToClipboardText={'Link copied to clipboard'}
    copyTooltipText={'Copy Tooltip Text'}
  />
);
