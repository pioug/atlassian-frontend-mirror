/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { defineMessages } from 'react-intl-next';

export const headingAnchorLinkMessages = defineMessages({
	copyHeadingLinkToClipboard: {
		id: 'fabric.editor.headingLink.copyAnchorLink',
		defaultMessage: 'Copy link to heading',
		description: 'Copy heading link to clipboard',
	},
	copyLinkToClipboard: {
		id: 'fabric.editor.headingLink.copyAnchorLinkTo',
		defaultMessage: 'Copy link to',
		description:
			'Copy heading link to clipboard. Will be used as part of a 2-part a11y label ("Copy link to", "{heading text}")',
	},
	copyHeadingLinkLabelledBy: {
		id: 'fabric.editor.headingLink.copyAnchorLinkLabelledBy',
		defaultMessage: '{copyLink} {heading}',
		description:
			'The order in which to read the parts of the aria-labelledby for the copy heading link button depending on the grammar of the language. {copyLink} will be replaced with the "Copy link to" text and {heading} will be replaced with the actual heading text',
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

export const inlineCommentMessages = defineMessages({
	contentRendererInlineCommentMarkerStart: {
		id: 'fabric.editor.inlineComment.marker.start',
		defaultMessage: 'inline comment start',
		description:
			'Starting marker to indicate that text is highlighted with an inline comment by a screen reader.',
	},
	contentRendererInlineCommentMarkerEnd: {
		id: 'fabric.editor.inlineComment.marker.end',
		defaultMessage: 'inline comment end',
		description:
			'Ending marker to indicate that text was highlighted with an inline comment by a screen reader.',
	},
});
