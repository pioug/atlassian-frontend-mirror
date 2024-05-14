import { defineMessages } from 'react-intl-next';

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
  copyAriaLabel: {
    id: 'fabric.editor.headingLink.copyAriaLabel',
    defaultMessage: 'Copy',
    description: 'copy aria label for link icon',
  },
});

export const tableCellMessages = defineMessages({
  noneSortingLabel: {
    id: 'fabric.editor.headingLink.noneSortingLabel',
    defaultMessage: 'none',
    description: 'this table column is not sorted',
  },
  ascSortingLabel: {
    id: 'fabric.editor.headingLink.ascSortingLabel',
    defaultMessage: 'ascending',
    description: 'this table column is sorted in ascending order',
  },
  descSortingLabel: {
    id: 'fabric.editor.headingLink.descSortingLabel',
    defaultMessage: 'descending',
    description: 'this table column is sorted in descending order',
  },
});
