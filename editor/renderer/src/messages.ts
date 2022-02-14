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
    id: 'fabric.editor.headingLink.noneSortingLabel',
    defaultMessage: 'descending',
    description: 'this table column is sorted in descending order',
  },
});

export const sortingIconMessages = defineMessages({
  noOrderLabel: {
    id: 'fabric.editor.headingLink.noOrderLabel',
    defaultMessage: 'Sort column A to Z',
    description: 'Sort the column in ascending order',
  },
  ascOrderLabel: {
    id: 'fabric.editor.headingLink.ascOrderLabel',
    defaultMessage: 'Sort column Z to A',
    description: 'Sort the column in descending order',
  },
  descOrderLabel: {
    id: 'fabric.editor.headingLink.descOrderLabel',
    defaultMessage: 'Clear sorting',
    description: 'clear the sorting from this column',
  },
  invalidLabel: {
    id: 'fabric.editor.headingLink.descOrderLabel',
    defaultMessage: `⚠️  You can't sort a table with merged cell`,
    description: 'this sort is invalid for merged cells',
  },
});

export const codeBlockCopyButtonMessages = defineMessages({
  copyCodeToClipboard: {
    id: 'fabric.editor.codeBlockCopyButton.copyToClipboard',
    defaultMessage: 'Copy',
    description: 'Copy the whole content of the element to your clipboard',
  },
  copiedCodeToClipboard: {
    id: 'fabric.editor.codeBlockCopyButton.copiedToClipboard',
    defaultMessage: 'Copied!',
    description: 'Copied the whole content of the element to clipboard',
  },
});
