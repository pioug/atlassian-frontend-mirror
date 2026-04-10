// oxlint-disable-next-line @atlassian/no-restricted-imports
import { defineMessages } from 'react-intl-next';

export const i18n = defineMessages({
	easyMentionsPlaceholder: {
		id: 'editor-presets-confluence.placeholder.easy-mentions-placeholder',
		defaultMessage: 'Type / for all elements or @ to mention someone.',
		description: 'The placeholder for the editor to help discover the slash and mention commands',
	},
	aiPlaceholder: {
		id: 'editor-presets-confluence.placeholder.ai-placeholder',
		defaultMessage:
			"Type /ai for Atlassian Intelligence, / to add elements, or @ to mention someone (we'll let them know).",
		description:
			'The placeholder for the editor to help discover our text generative AI, Atlassian Intelligence.',
	},
	defaultPlaceholder: {
		id: 'editor-presets-confluence.placeholder.default-placeholder',
		defaultMessage: 'Type / to insert elements',
		description: 'The placeholder shown in empty document to help discover slash command',
	},
	editorEmptyDocumentPlaceholderAI: {
		id: 'editor-presets-confluence.placeholder.default-placeholder-ai',
		defaultMessage: "Use {key}+' to ask AI, or type / to insert elements",
		description: 'The placeholder shown in empty document to help discover ai and slash command',
	},
	editorEmptyDocumentSpaceShortcutPlaceholder: {
		id: 'editor-presets-confluence.placeholder.space-shortcut-placeholder',
		defaultMessage: 'Press space to Ask Rovo or / to insert elements',
		description:
			'The placeholder shown in empty document to help discover space shortcut to trigger Rovo, and slash shortcut to insert elements',
	},
	editorEmptyDocumentSpaceShortcutPlaceholderADFPrefix: {
		id: 'editor-presets-confluence.placeholder.space-shortcut-adf-prefix',
		defaultMessage: 'Press',
		description: 'Text before keyboard shortcut in space shortcut ADF placeholder',
	},
	editorEmptyDocumentSpaceShortcutPlaceholderADFSpaceShortcut: {
		id: 'editor-presets-confluence.placeholder.space-shortcut-adf-space-key',
		defaultMessage: 'space',
		description: 'Space key shortcut for triggering Rovo in ADF placeholder',
	},
	editorEmptyDocumentSpaceShortcutPlaceholderADFMiddle: {
		id: 'editor-presets-confluence.placeholder.space-shortcut-adf-middle',
		defaultMessage: 'to Ask Rovo or',
		description: 'Text between space and slash shortcuts in ADF placeholder',
	},
	editorEmptyDocumentSpaceShortcutPlaceholderADFSlashShortcut: {
		id: 'editor-presets-confluence.placeholder.space-shortcut-adf-slash-key',
		defaultMessage: '/',
		description: 'Slash key shortcut for inserting elements in space shortcut ADF placeholder',
	},
	editorEmptyDocumentSpaceShortcutPlaceholderADFSuffix: {
		id: 'editor-presets-confluence.placeholder.space-shortcut-adf-suffix',
		defaultMessage: 'to insert elements',
		description: 'Text after slash shortcut in space shortcut ADF placeholder',
	},
	placeholderADF: {
		id: 'editor-presets-confluence.placeholderADF',
		defaultMessage: 'Press <code>space</code> to Ask Rovo or <code>/</code> to insert elements',
		description: 'The ADF placeholder for the editor which contains formatting.',
	},
});
