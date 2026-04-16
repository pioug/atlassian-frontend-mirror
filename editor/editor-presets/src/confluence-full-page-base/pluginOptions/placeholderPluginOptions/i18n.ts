// oxlint-disable-next-line @atlassian/no-restricted-imports
import { defineMessages } from 'react-intl';

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
	placeholderADF: {
		id: 'editor-presets-confluence.placeholderADF',
		defaultMessage: 'Press <code>space</code> to Ask Rovo or <code>/</code> to insert elements',
		description: 'The ADF placeholder for the editor which contains formatting.',
	},
});
