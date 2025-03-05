import { defineMessages } from 'react-intl-next';

export const aiConfigItemMessages = defineMessages({
	// Agent config messages
	agentConfigTitle: {
		id: 'fabric.editor.ai.config.item.agent.title',
		defaultMessage: 'Atlassian Intelligence Rovo Agent',
		description:
			'Title for the menu item of the Atlassian Intelligence agent without a predefined name.',
	},
	agentConfigDescription: {
		id: 'fabric.editor.ai.config.item.range.agent.description',
		defaultMessage: 'No description',
		description:
			'Subtitle for the menu item of the Atlassian Intelligence agent without a predefined description.',
	},
	agentConfigPromptHint: {
		id: 'fabric.editor.ai.config.item.range.agent.prompt.hint',
		defaultMessage: 'Tell the Agent to write anything or choose from below',
		description: 'Hint text for the prompt input when interacting with the Atlassian Intelligence',
	},

	// Config action messages
	configActionInsert: {
		id: 'fabric.editor.ai.config.item.action.insert',
		defaultMessage: 'Insert',
		description: 'Inserts the response at the current location',
	},
	configActionInsertAtTop: {
		id: 'fabric.editor.ai.config.item.action.insertAtTop',
		defaultMessage: 'Insert at top',
		description: 'Inserts the response at the start of the content',
	},
	configActionInsertBelow: {
		id: 'fabric.editor.ai.config.item.action.insertBelow',
		defaultMessage: 'Insert below',
		description: 'Inserts the response below the current location',
	},
	configActionReplace: {
		id: 'fabric.editor.ai.config.item.action.replace',
		defaultMessage: 'Replace',
		description: 'Replaces the existing or selected content with the response',
	},
	configActionReplaceTitle: {
		id: 'fabric.editor.ai.config.item.action.replaceTitle',
		defaultMessage: 'Replace title',
		description: 'Replaces the existing Confluence document title with the generated title',
	},
	configActionReplaceTitleTooLongDisabledTooltip: {
		id: 'fabric.editor.ai.config.item.action.replaceTitleTooLongDisabledTooltip',
		defaultMessage: 'Title cannot exceed {maxLength} characters',
		description:
			'Tooltip that appears over disabled action button when disabled because of title being too long',
	},
	configActionContinueInChatLabel: {
		id: 'fabric.editor.ai.config.item.action.rovoAgents.continueInChatLabel',
		defaultMessage: 'Open in Chat',
		description: 'Tooltip and label for Open in Chat button',
	},

	// Advanced prompt messages
	advancedPromptTitle: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.title',
		defaultMessage: 'Build an advanced prompt',
		description: 'Describes an option to use Atlassian Intelligence to show a more advanced prompt',
	},
	advancedPromptDescription: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.description',
		defaultMessage: 'Specify task, instructions and rules',
		description: 'Description for the the Atlassian Intelligence "Build an advanced prompt".',
	},
	advancedPromptLabel: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.promptLabel',
		defaultMessage: 'Build an advanced prompt',
		description: 'Label text in the prompt input.',
	},
	advancedPromptTaskLabel: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.task.label',
		defaultMessage: 'Task',
		description: 'Label for the Task input in the prompt builder.',
	},
	advancedPromptTaskPlaceholder: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.task.placeholder',
		defaultMessage: 'Describe the task that needs completing.',
		description: 'Placeholder for the Task input in the prompt builder.',
	},
	advancedPromptTaskHelperMessage: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.task.helperMessage',
		defaultMessage:
			'For example: Create an onboarding documentation for new employees joining the team.',
		description: 'Helper message for the Task input in the prompt builder.',
	},
	advancedPromptTaskRequired: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.task.error.required',
		defaultMessage: 'Please provide task',
		description: 'Error message for the Task input in the prompt builder.',
	},
	advancedPromptInstructionsLabel: {
		id: 'fabric.editor.ai.config.item.advanced-prompt.form.instructions.label',
		defaultMessage: 'Instructions',
		description: 'Label for the Instructions input in the prompt builder.',
	},
	advancedPromptInstructionsPlaceholder: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.instructions.placeholder',
		defaultMessage: 'Provide task instructions to help generate specific outputs.',
		description: 'Placeholder for the Instructions input in the prompt builder.',
	},
	advancedPromptInstructionsHelperMessage: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.instructions.helperMessage',
		defaultMessage:
			'For example: 1. Start the document with a brief overview of our company goals. 2. Create a list of key team members to meet in their first week.',
		description: 'Helper message for the Instructions input in the prompt builder.',
	},
	advancedPromptRulesLabel: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.rules.label',
		defaultMessage: 'Rules',
		description: 'Label for the Rules input in the prompt builder.',
	},
	advancedPromptRulesPlaceholder: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.rules.placeholder',
		defaultMessage: 'Outline any rules you want followed.',
		description: 'Placeholder for the Rules input in the prompt builder.',
	},
	advancedPromptRulesHelperMessage: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.rules.helperMessage',
		defaultMessage:
			'For example: The output must follow the company style guidelines and not use unverified data.',
		description: 'Helper message for the Rules input in the prompt builder.',
	},
	advancedPromptToneLabel: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.tone.label',
		defaultMessage: 'Tone',
		description: 'Label for the Tone input in the prompt builder.',
	},
	advancedPromptToneProfessional: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.tone.option.professional',
		defaultMessage: 'Professional',
		description: 'Option for the Tone input in the prompt builder.',
	},
	advancedPromptToneEmpathetic: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.tone.option.empathetic',
		defaultMessage: 'Empathetic',
		description: 'Option for the Tone input in the prompt builder.',
	},
	advancedPromptToneCasual: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.tone.option.casual',
		defaultMessage: 'Casual',
		description: 'Option for the Tone input in the prompt builder.',
	},
	advancedPromptToneNeutral: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.tone.option.neutral',
		defaultMessage: 'Neutral',
		description: 'Option for the Tone input in the prompt builder.',
	},
	advancedPromptToneEducational: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.tone.option.educational',
		defaultMessage: 'Educational',
		description: 'Option for the Tone input in the prompt builder.',
	},
	advancedPromptCreativityLabel: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.creativity.label',
		defaultMessage: 'Creativity',
		description: 'Label for the Creativity input in the prompt builder.',
	},
	advancedPromptCreativityLow: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.creativity.option.low',
		defaultMessage: 'Low',
		description: 'Option for the Creativity input in the prompt builder.',
	},
	advancedPromptCreativityMedium: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.creativity.option.medium',
		defaultMessage: 'Medium',
		description: 'Option for the Creativity input in the prompt builder.',
	},
	advancedPromptCreativityHigh: {
		id: 'fabric.editor.ai.config.item.advancedPrompt.form.creativity.option.high',
		defaultMessage: 'High',
		description: 'Option for the Creativity input in the prompt builder.',
	},

	// Atlas shorten update messages
	atlasShortenUpdatetitle: {
		id: 'fabric.editor.ai.config.item.atlas-shorten-update.title',
		defaultMessage: 'Shorten update',
		description:
			'Describes an option to use Atlassian Intelligence to shorten the content currently selected by the user',
	},
	atlasShortenUpdateDescription: {
		id: 'fabric.editor.ai.config.item.atlas-shorten-update.description',
		defaultMessage: 'Shortens the content to make it more concise',
		description: 'Description for the the Atlassian Intelligence "Shorten update".',
	},

	// Brainstorm messages
	brainstormTitle: {
		id: 'fabric.editor.ai.config.item.brainstorm.title',
		defaultMessage: 'Brainstorm',
		description:
			'Title for "Brainstorm" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},
	brainstormDescription: {
		id: 'fabric.editor.ai.config.item.brainstorm.description',
		defaultMessage: 'Generates a list of ideas for a topic you provide',
		description:
			'Describes the "Brainstorm" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},
	brainstormPromptLabel: {
		id: 'fabric.editor.ai.config.item.brainstorm.promptLabel',
		defaultMessage: 'Brainstorm',
		description: 'Label text in the prompt input.',
	},
	brainstormPromptHint: {
		id: 'fabric.editor.ai.config.item.brainstorm.promptHint',
		defaultMessage: 'Tell me the topic...',
		description: 'Placeholder text in the prompt input guiding user interaction.',
	},

	// Change tone messages
	changeToneNestingParentTitlePostGA: {
		id: 'fabric.editor.ai.config.item.changeTone.nestingParentTitlePostGA',
		defaultMessage: 'Change tone to ...',
		description:
			'Describes a (nested) option to use Atlassian Intelligence to change the tone of content currently selected by the user',
	},
	changeToneNeutralToneTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.neutralTone.title',
		defaultMessage: 'Change tone to neutral',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneNeutralToneShortTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.neutralTone.shortTitle',
		defaultMessage: 'Neutral',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneNeutralToneDescription: {
		id: 'fabric.editor.ai.config.item.changeTone.neutralTone.description',
		defaultMessage: 'Changes the tone of the content to neutral',
		description: 'Desciption for the Atlassian Intellgience "Change tone to neutral" option',
	},
	changeToneNeutralToneSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.neutralTone.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Neutral',
		description:
			'Title for Atlassian Intelligence "Change tone to neutral" in editor selection floating toolbar',
	},
	changeToneProfessionalToneTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.professionalTone.title',
		defaultMessage: 'Change tone to professional',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneProfessionalToneShortTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.professionalTone.shortTitle',
		defaultMessage: 'Professional',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneProfessionalToneDescription: {
		id: 'fabric.editor.ai.config.item.changeTone.professionalTone.description',
		defaultMessage: 'Changes the tone of the content to professional',
		description: 'Desciption for the Atlassian Intellgience "Change tone to professional" option',
	},
	changeToneProfessionalToneSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.professionalTone.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Professional',
		description:
			'Title for Atlassian Intelligence "Change tone to professional" in editor selection floating toolbar',
	},
	changeToneCasualToneTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.casualTone.title',
		defaultMessage: 'Change tone to casual',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneCasualToneShortTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.casualTone.shortTitle',
		defaultMessage: 'Casual',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneCasualToneDescription: {
		id: 'fabric.editor.ai.config.item.changeTone.casualTone.description',
		defaultMessage: 'Changes the tone of the content to casual',
		description: 'Desciption for the Atlassian Intellgience "Change tone to casual" option',
	},
	changeToneCasualToneSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.casualTone.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Casual',
		description:
			'Title for Atlassian Intelligence "Change tone to casual" in editor selection floating toolbar',
	},
	changeToneEducationalToneTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.educationalTone.title',
		defaultMessage: 'Change tone to educational',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneEducationalToneShortTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.educationalTone.shortTitle',
		defaultMessage: 'Educational',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneEducationalToneDescription: {
		id: 'fabric.editor.ai.config.item.changeTone.educationalTone.description',
		defaultMessage: 'Changes the tone of the content to educational',
		description: 'Desciption for the Atlassian Intellgience "Change tone to educational" option',
	},
	changeToneEducationalToneSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.educationalTone.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Educational',
		description:
			'Title for Atlassian Intelligence "Change tone to educational" in editor selection floating toolbar',
	},
	changeToneEmpatheticToneTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.empatheticTone.title',
		defaultMessage: 'Change tone to empathetic',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneEmpatheticToneShortTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.empatheticTone.shortTitle',
		defaultMessage: 'Empathetic',
		description:
			'Describes an option to use Atlassian Intellgience to change the tone of content currently selected by the user',
	},
	changeToneEmpatheticToneDescription: {
		id: 'fabric.editor.ai.config.item.changeTone.empatheticTone.description',
		defaultMessage: 'Changes the tone of the content to empathetic',
		description: 'Desciption for the Atlassian Intellgience "Change tone to empathetic" option',
	},
	changeToneEmpatheticToneSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.changeTone.empatheticTone.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Empathetic',
		description:
			'Title for Atlassian Intelligence "Change tone to empathetic" in editor selection floating toolbar',
	},

	// Convert to bullet list messages
	convertToBulletListTitle: {
		id: 'fabric.editor.ai.config.item.convertToBulletList.title',
		defaultMessage: 'Convert to bulleted list',
		description:
			'Describes an option to use Atlassian Intelligence to reformat content currently selected by the user to a bulleted list',
	},
	convertToBulletListDescription: {
		id: 'fabric.editor.ai.config.item.convertToBulletList.description',
		defaultMessage: 'Reformats content to a bulleted list',
		description: 'Description for the the Atlassian Intelligence "Convert to bulleted list".',
	},

	// Convert to table messages
	convertToTableTitle: {
		id: 'fabric.editor.ai.config.item.convertToTable.title',
		defaultMessage: 'Convert to table',
		description:
			'Describes an option to use Atlassian Intelligence to reformat content currently selected by the user to a table with headings',
	},
	convertToTableDescription: {
		id: 'fabric.editor.ai.config.item.convertToTable.description',
		defaultMessage: 'Reformats content to a table with headings',
		description: 'Description for the the Atlassian Intelligence "Convert to table".',
	},

	// Draft reply messages
	draftReplyTitle: {
		id: 'fabric.editor.ai.config.item.draftReply.title',
		defaultMessage: 'Draft reply',
		description:
			'Title for "Draft reply" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},
	draftReplyDescription: {
		id: 'fabric.editor.ai.config.item.draftReply.description',
		defaultMessage: 'Drafts a reply based on issues similar to the one you’re working on',
		description:
			'Describes the "Draft reply" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},

	// Enhance messages
	improveWritingTitle: {
		id: 'fabric.editor.ai.config.item.enhance.improveWriting.title',
		defaultMessage: 'Improve writing',
		description:
			'Describes an option to use Atlassian Intellgience to improve the writing of content currently selected by the user',
	},
	improveWritingSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.enhance.improveWriting.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Improve writing',
		description:
			'Title for Atlassian Intelligence "improve writing" in editor selection floating toolbar',
	},
	fixSpellingGrammarTitle: {
		id: 'fabric.editor.ai.config.item.enhance.fixSpellingGrammar.title',
		defaultMessage: 'Fix spelling & grammar',
		description:
			'Describes an option to use Atlassian Intellgience to improve the writing of content currently selected by the user',
	},
	improveWritingDescription: {
		id: 'fabric.editor.ai.config.item.enhance.improveWriting.description',
		defaultMessage: 'Enhances clarity, structure, and tone for better engagement and comprehension',
		description: 'Description for the the Atlassian Intelligence "Improve Writing".',
	},
	fixSpellingGrammarDescription: {
		id: 'fabric.editor.ai.config.item.enhance.fixSpellingGrammar.description',
		defaultMessage: 'Fixes spelling and grammar mistakes',
		description: 'Description for the the Atlassian Intelligence "Fix Spelling & Grammar".',
	},
	fixSpellingGrammarSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.enhance.fixSpellingGrammar.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Spelling & grammar',
		description:
			'Title for Atlassian Intelligence "fix spelling grammar" in editor selection floating toolbar',
	},

	// Find action items messages
	findActionItemsTitle: {
		id: 'fabric.editor.ai.config.item.findActionItems.title',
		defaultMessage: 'Find action items',
		description:
			'Title for "Find Action Items" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},
	findActionItemsDescription: {
		id: 'fabric.editor.ai.config.item.findActionItems.description',
		defaultMessage: 'Finds action items in the content you provide',
		description:
			'Describes the "Find Action Items" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},

	// Free generate messages
	freeGeneratePromptHint: {
		id: 'fabric.editor.ai.config.item.generateContent.promptHint',
		defaultMessage: 'Write with AI or select from below',
		description: 'Placeholder text in the prompt input guiding user interaction.',
	},

	// Free generate disabled messages
	freeGenerateDisabledPromptHint: {
		id: 'fabric.editor.ai.config.item.freeGenerate.disabled.promptHint',
		defaultMessage: 'Select from below (free generate is disabled in Elevate at this time)',
		description: 'Placeholder text in the prompt input guiding user interaction.',
	},

	// Improve description messages
	reformatWithTemplateDescription: {
		id: 'fabric.editor.ai.config.item.improveDescription.default.description',
		defaultMessage: 'Restructure the issue description based on the issue type',
		description: 'Description for the Atlassian Intelligence "Improve description" feature.',
	},
	improveDescription: {
		id: 'fabric.editor.ai.config.item.improveDescription.default.title.experiment.one',
		defaultMessage: 'Improve description',
		description:
			'Describes an option to use Atlassian Intelligence to improve the issue description currently selected by the user.',
	},

	// Make longer messages
	makeLongerTitle: {
		id: 'fabric.editor.ai.config.item.makeLonger.title',
		defaultMessage: 'Make longer',
		description:
			'Describes an option to use Atlassian Intelligence to make the content longer currently selected by the user',
	},
	makeLongerDescription: {
		id: 'fabric.editor.ai.config.item.makeLonger.description',
		defaultMessage: 'Expands the content based on the context you provide',
		description: 'Description for the the Atlassian Intelligence "Make longer".',
	},

	// Make shorter messages
	makeShorterTitle: {
		id: 'fabric.editor.ai.config.item.shorten.title',
		defaultMessage: 'Make shorter',
		description:
			'Describes an option to use Atlassian Intelligence to shorten the content currently selected by the user',
	},
	makeShorterDescription: {
		id: 'fabric.editor.ai.config.item.shorten.description',
		defaultMessage: 'Shortens the content to make it more concise',
		description: 'Description for the the Atlassian Intelligence "Shorten".',
	},
	makeShorterSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.shorten.selectionToolbar.dropdownItem.title',
		defaultMessage: 'Make shorter',
		description: 'Title for Atlassian Intelligence "Shorten" in editor selection floating toolbar',
	},

	// PR Description messages
	prDescriptionTitle: {
		id: 'fabric.editor.ai.config.item.bb.pr.description.title',
		defaultMessage: 'Create pull request description',
		description:
			'Title for "Create pull request description" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},
	prDescriptionDescription: {
		id: 'fabric.editor.ai.config.item.bb.pr.description.description',
		defaultMessage: 'Creates a pull request description with a summary of changes',
		description:
			'Describes the "Create pull request description" Atlassian Intelligence feature shown in editor typeahead and element browser.',
	},

	// Rephrase messages
	rephraseTitle: {
		id: 'fabric.editor.ai.config.item.rephrase.title',
		defaultMessage: 'Rephrase',
		description:
			'Describes an option to use Atlassian Intelligence to rephrase the content currently selected by the user',
	},
	rephraseDescription: {
		id: 'fabric.editor.ai.config.item.rephrase.description',
		defaultMessage: 'Creates a suggestion for rewriting your sentences',
		description: 'Description for the the Atlassian Intelligence "Rephrase".',
	},

	// Suggest title messages
	suggestTitleTitle: {
		id: 'fabric.editor.ai.config.item.suggest.title',
		defaultMessage: 'Suggest a title',
		description:
			'Describes an option to use Atlassian Intellgience to suggest an appropriate title for the content currently selected by the user',
	},
	suggestTitleDescription: {
		id: 'fabric.editor.ai.config.item.suggest.description',
		defaultMessage: 'Suggests a title for content you provide',
		description:
			'Describes "Suggest a Title" Atlassian Intelligence feature to suggest an appropriate title for the content currently selected by the user',
	},

	// Summarize writing messages
	summarizeWritingtitle: {
		id: 'fabric.editor.ai.config.item.summarize.title',
		defaultMessage: 'Summarize writing',
		description:
			'Describes an option to use Atlassian Intellgience to summarize the content currently selected by the user',
	},
	summarizeWritingDescription: {
		id: 'fabric.editor.ai.config.item.summarize.description',
		defaultMessage: "Creates a summary of the text you're working on, highlighting key points",
		description:
			'Describes "Summarize writing" Atlassian Intelligence feature to summarize the content currently selected by the user',
	},
	summarizeWritingSelectionToolbarDropdownItemTitle: {
		id: 'fabric.editor.ai.config.item.summarize.dropdownItem.title',
		defaultMessage: 'Summarize writing',
		description:
			'Title for Atlassian Intelligence "Summarize writing" in editor selection floating toolbar',
	},
});
