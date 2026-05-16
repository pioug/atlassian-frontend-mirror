import { defineMessages } from 'react-intl';

/**
 * i18n strings for the Markdown-Mode editor plugin.
 *
 * Defined here in `editor-common` (rather than alongside the components in
 * `editor-plugin-markdown-mode`) because the `no-restricted-imports` rule
 * forbids plugin packages from calling `defineMessages` directly — this
 * keeps every translatable string discoverable from a single location for
 * the i18n tooling. See `@atlaskit/editor/no-defineMessages-in-plugin`.
 */
export const markdownModeMessages: {
	confirmDialogCancel: { defaultMessage: string; description: string; id: string };
	confirmDialogConfirm: { defaultMessage: string; description: string; id: string };
	confirmDialogError: { defaultMessage: string; description: string; id: string };
	confirmDialogTitleToMarkdown: { defaultMessage: string; description: string; id: string };
	confirmDialogTitleToMarkdownLossy: { defaultMessage: string; description: string; id: string };
	confirmDialogTitleToRichText: { defaultMessage: string; description: string; id: string };
	confirmDialogToMarkdownLossyCta: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToMarkdownLossyRichContent: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToMarkdownLossyVersionHistory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToMarkdownToggle: { defaultMessage: string; description: string; id: string };
	confirmDialogToMarkdownToolsRemoved: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToMarkdownVersionHistory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToRichTextInstantEdits: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToRichTextStandardTools: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	confirmDialogToRichTextVersionHistory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	groupLabel: { defaultMessage: string; description: string; id: string };
	labsLozenge: { defaultMessage: string; description: string; id: string };
	preview: { defaultMessage: string; description: string; id: string };
	source: { defaultMessage: string; description: string; id: string };
	sourceAriaLabel: { defaultMessage: string; description: string; id: string };
	unlinkSyncedBlocksBody: { defaultMessage: string; description: string; id: string };
	unlinkSyncedBlocksLearnMore: { defaultMessage: string; description: string; id: string };
	unlinkSyncedBlocksTitle: { defaultMessage: string; description: string; id: string };
	unlinkSyncedBlocksUnderstood: { defaultMessage: string; description: string; id: string };
	wysiwyg: { defaultMessage: string; description: string; id: string };
} = defineMessages({
	groupLabel: {
		id: 'fabric.editor.markdownMode.viewToggle.groupLabel',
		defaultMessage: 'View mode',
		description:
			'Accessible label announced for the group of three view-mode toggle buttons (markdown source, WYSIWYG, preview) shown on Markdown-Mode Live Docs.',
	},
	source: {
		id: 'fabric.editor.markdownMode.viewToggle.source',
		defaultMessage: 'Syntax editor',
		description:
			'Tooltip and accessible label for the toggle button that switches the editor into raw markdown source (syntax) view.',
	},
	wysiwyg: {
		id: 'fabric.editor.markdownMode.viewToggle.wysiwyg',
		defaultMessage: 'WYSIWYG editor',
		description:
			'Tooltip and accessible label for the toggle button that switches the editor into the WYSIWYG markdown editing view (the default).',
	},
	preview: {
		id: 'fabric.editor.markdownMode.viewToggle.preview',
		defaultMessage: 'Split view (coming soon)',
		description:
			'Tooltip and accessible label for the toggle button that will switch the editor into a split view. This feature is not yet available.',
	},
	sourceAriaLabel: {
		id: 'fabric.editor.markdownMode.sourceView.ariaLabel',
		defaultMessage: 'Markdown source',
		description: 'Accessible label for the markdown source editor.',
	},
	confirmDialogTitleToMarkdown: {
		id: 'fabric.editor.markdownMode.confirmDialog.title.toMarkdown',
		defaultMessage: 'Convert to markdown?',
		description:
			'Title of the confirmation dialog shown when the user is about to convert a Live Doc from rich text into markdown mode.',
	},
	confirmDialogTitleToMarkdownLossy: {
		id: 'fabric.editor.markdownMode.confirmDialog.title.toMarkdownLossy',
		defaultMessage: 'Convert to Markdown?',
		description:
			'Title of the warning dialog shown when the user is about to convert a Live Doc whose rich-text content cannot fully round-trip through markdown (lossy conversion).',
	},
	confirmDialogTitleToRichText: {
		id: 'fabric.editor.markdownMode.confirmDialog.title.toRichText',
		defaultMessage: 'Convert to rich text?',
		description:
			'Title of the confirmation dialog shown when the user is about to convert a Live Doc from markdown back to rich text mode.',
	},
	confirmDialogToMarkdownToolsRemoved: {
		id: 'fabric.editor.markdownMode.confirmDialog.toMarkdown.toolsRemoved',
		defaultMessage: 'Standard rich text tools will be removed.',
		description:
			'Body row inside the convert-to-markdown confirmation dialog; explains that the rich-text editor toolbar disappears once the document is in markdown mode.',
	},
	confirmDialogToMarkdownToggle: {
		id: 'fabric.editor.markdownMode.confirmDialog.toMarkdown.toggle',
		defaultMessage: 'Toggle between syntax and WYSIWYG editing as you work.',
		description:
			'Body row inside the convert-to-markdown confirmation dialog; explains that the user can still flip between markdown source view and WYSIWYG view after the conversion.',
	},
	confirmDialogToMarkdownVersionHistory: {
		id: 'fabric.editor.markdownMode.confirmDialog.toMarkdown.versionHistory',
		defaultMessage: 'Revert to the previous version via version history at any time.',
		description:
			'Body row inside the convert-to-markdown confirmation dialog; reassures the user that the pre-conversion version is preserved and recoverable from version history.',
	},
	confirmDialogToMarkdownLossyRichContent: {
		id: 'fabric.editor.markdownMode.confirmDialog.toMarkdownLossy.richContent',
		defaultMessage: 'Your content has rich text formatting that may be unsupported in markdown.',
		description:
			'Body row in the lossy convert-to-markdown warning dialog; explains that rich-text formatting may not survive the conversion.',
	},
	confirmDialogToMarkdownLossyVersionHistory: {
		id: 'fabric.editor.markdownMode.confirmDialog.toMarkdownLossy.versionHistory',
		defaultMessage:
			'Converting may result in data loss, although you can always revert to this previous version in version history.',
		description:
			'Body row in the lossy convert-to-markdown warning dialog; reassures the user that the pre-conversion version is recoverable from version history.',
	},
	confirmDialogToMarkdownLossyCta: {
		id: 'fabric.editor.markdownMode.confirmDialog.toMarkdownLossy.cta',
		defaultMessage: 'Convert to Markdown',
		description:
			'Primary (warning-styled) action button label in the lossy convert-to-markdown warning dialog.',
	},
	confirmDialogToRichTextStandardTools: {
		id: 'fabric.editor.markdownMode.confirmDialog.toRichText.standardTools',
		defaultMessage: 'Standard rich text tools will be available again.',
		description:
			'Body row inside the convert-to-rich-text confirmation dialog; explains that the full rich-text toolbar comes back after the conversion.',
	},
	confirmDialogToRichTextInstantEdits: {
		id: 'fabric.editor.markdownMode.confirmDialog.toRichText.instantEdits',
		defaultMessage: 'Edits will continue to happen instantly without the need to publish.',
		description:
			'Body row inside the convert-to-rich-text confirmation dialog; reassures the user that live-edit semantics are preserved when leaving markdown mode.',
	},
	confirmDialogToRichTextVersionHistory: {
		id: 'fabric.editor.markdownMode.confirmDialog.toRichText.versionHistory',
		defaultMessage: 'Revert to the previous version via version history at any time.',
		description:
			'Body row inside the convert-to-rich-text confirmation dialog; reassures the user that the pre-conversion version is preserved and recoverable from version history.',
	},
	confirmDialogCancel: {
		id: 'fabric.editor.markdownMode.confirmDialog.cancel',
		defaultMessage: 'Cancel',
		description:
			'Cancel button label in the convert-markdown-mode confirmation dialog (used for both directions).',
	},
	confirmDialogConfirm: {
		id: 'fabric.editor.markdownMode.confirmDialog.confirm',
		defaultMessage: 'Confirm',
		description:
			'Primary confirm button label in the convert-markdown-mode confirmation dialog (used for both directions).',
	},
	confirmDialogError: {
		id: 'fabric.editor.markdownMode.confirmDialog.error',
		defaultMessage: 'Something went wrong while converting this page. Please try again.',
		description:
			'Inline error message shown inside the convert-markdown-mode confirmation dialog when the conversion request fails.',
	},
	unlinkSyncedBlocksTitle: {
		id: 'fabric.editor.markdownMode.unlinkSyncedBlocks.title',
		defaultMessage: 'Unlink synced blocks to convert',
		description:
			'Title of the modal shown when the user tries to convert a page to markdown but the page contains synced blocks. The dialog asks them to unlink (unsync) the blocks first.',
	},
	unlinkSyncedBlocksBody: {
		id: 'fabric.editor.markdownMode.unlinkSyncedBlocks.body',
		defaultMessage:
			'{count, plural, one {This content contains 1 synced block syncing to multiple locations. Converting to markdown will detach the synced block and result in it being removed from multiple synced locations, where it will appear as an "Unsynced block". Unsync it to continue.} other {This content contains {count} synced blocks syncing to multiple locations. Converting to markdown will detach the synced blocks and result in them being removed from multiple synced locations, where they will appear as "Unsynced blocks". Unsync them to continue.}}',
		description:
			'Body copy of the unlink-synced-blocks dialog. {count} is the number of synced blocks in the document (always >= 1 in practice; 0 takes the plural branch defensively).',
	},
	unlinkSyncedBlocksLearnMore: {
		id: 'fabric.editor.markdownMode.unlinkSyncedBlocks.learnMore',
		defaultMessage: 'Learn more',
		description:
			'Footer link in the unlink-synced-blocks dialog that opens external documentation about managing synced blocks.',
	},
	unlinkSyncedBlocksUnderstood: {
		id: 'fabric.editor.markdownMode.unlinkSyncedBlocks.understood',
		defaultMessage: 'Understood',
		description:
			'Primary acknowledgement button label in the unlink-synced-blocks dialog. Dismisses the dialog — there is no "convert anyway" action.',
	},
	labsLozenge: {
		id: 'fabric.editor.markdownMode.labsLozenge',
		defaultMessage: 'LABS',
		description:
			'Lozenge label displayed next to the modal title to indicate the markdown mode feature is experimental (Labs).',
	},
});
