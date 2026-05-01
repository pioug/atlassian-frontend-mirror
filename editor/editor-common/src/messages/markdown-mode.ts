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
	groupLabel: { defaultMessage: string; description: string; id: string };
	preview: { defaultMessage: string; description: string; id: string };
	source: { defaultMessage: string; description: string; id: string };
	sourceAriaLabel: { defaultMessage: string; description: string; id: string };
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
});
