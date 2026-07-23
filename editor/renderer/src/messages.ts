/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

import { defineMessages, type MessageDescriptor } from 'react-intl';

export const collapsibleHeadingMessages: Record<
	'collapseSection' | 'expandSection',
	MessageDescriptor
> = defineMessages({
	collapseSection: {
		id: 'fabric.editor.collapsibleHeading.collapseSection.ai-non-final',
		defaultMessage: 'Collapse section',
		description:
			'Accessible label and tooltip for the button beside an expanded renderer heading. Activating the button hides the content in that heading section.',
	},
	expandSection: {
		id: 'fabric.editor.collapsibleHeading.expandSection.ai-non-final',
		defaultMessage: 'Expand section',
		description:
			'Accessible label and tooltip for the button beside a collapsed renderer heading. Activating the button reveals the content in that heading section.',
	},
});

export const headingAnchorLinkMessages: {
	copiedHeadingLinkToClipboard: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	copyAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	copyHeadingLinkLabelledBy: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	copyHeadingLinkToClipboard: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	copyLinkToClipboard: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	failedToCopyHeadingLink: {
		defaultMessage: string;
		description: string;
		id: string;
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
	ascSortingLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	descSortingLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	noneSortingLabel: {
		defaultMessage: string;
		description: string;
		id: string;
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
	contentRendererInlineCommentMarkerEnd: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	contentRendererInlineCommentMarkerStart: {
		defaultMessage: string;
		description: string;
		id: string;
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
