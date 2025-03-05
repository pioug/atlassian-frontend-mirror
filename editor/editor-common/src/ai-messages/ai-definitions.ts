import { defineMessages } from 'react-intl-next';

export const aiDefinitionsMessages = defineMessages({
	aiDefineToolbarButtonTitle: {
		id: 'fabric.editor.ai.selectionToolbar.define.title',
		defaultMessage: 'Define',
		description:
			'Title for AI Define button in editor selection floating toolbar in live pages view mode',
	},
	aiDefineToolbarButtonDisabledTooltip: {
		id: 'fabric.editor.ai.selectionToolbar.define.disabled.tooltip',
		defaultMessage: 'Highlight a term, acronym, or abbreviation',
		description:
			'Tooltip for explaining why AI define button in editor selection floating toolbar is disabled (due to exceeding max word count) in live pages view mode',
	},
});
