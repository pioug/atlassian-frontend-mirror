import { defineMessages } from 'react-intl';

export const headingAnchorLinkMessages = defineMessages({
  copyHeadingLinkToClipboard: {
    id: 'fabric.editor.headingLink.copyAnchorLink',
    defaultMessage: 'Copy link to heading',
    description: 'Copy heading link to clipboard',
  },
  copiedHeadingLinkToClipboard: {
    id: 'fabric.editor.headingLink.copied',
    defaultMessage: 'Copied!',
    description: 'Copied heading link to clipboard',
  },
  failedToCopyHeadingLink: {
    id: 'fabric.editor.headingLink.failedToCopy',
    defaultMessage: 'Copy failed',
    description: 'failed to copy heading link to clipboard',
  },
});
