/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { defineMessages } from 'react-intl';

export const headingAnchorLinkMessages: {
	copyHeadingLinkToClipboard: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	copyLinkToClipboard: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	copyHeadingLinkLabelledBy: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	copiedHeadingLinkToClipboard: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	failedToCopyHeadingLink: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	copyAriaLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	copyHeadingLinkToClipboard: {
		id: 'fabric.editor.headingLink.copyAnchorLink',
		defaultMessage: 'Copy link to heading',
		description:
			'Tooltip and aria-label for the button that copies an anchor link to a heading in the rendered document to the clipboard.',
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
		description:
			'Confirmation text shown briefly on the copy button after the heading anchor link has been successfully copied to the clipboard.',
	},
	failedToCopyHeadingLink: {
		id: 'fabric.editor.headingLink.failedToCopy',
		defaultMessage: 'Copy failed',
		description: 'failed to copy heading link to clipboard',
	},
	copyAriaLabel: {
		id: 'fabric.editor.headingLink.copyAriaLabel',
		defaultMessage: 'Copy',
		description:
			'Aria label for the copy link button displayed next to a heading. Used by screen readers to describe the button that copies the heading anchor link to the clipboard.',
	},
});

export const tableCellMessages: {
	noneSortingLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	ascSortingLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	descSortingLabel: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	noneSortingLabel: {
		id: 'fabric.editor.headingLink.noneSortingLabel',
		defaultMessage: 'none',
		description:
			'Accessible label for a table column sort indicator when no sorting is applied to that column.',
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

export const inlineCommentMessages: {
	contentRendererInlineCommentMarkerStart: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	contentRendererInlineCommentMarkerEnd: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
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
