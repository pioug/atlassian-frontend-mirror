// eslint-disable-next-line no-restricted-imports
import { defineMessages } from 'react-intl-next';

export const aiFailedStateMessages = defineMessages({
	aupViolationMessage: {
		id: 'fabric.editor.ai.experience.aupViolationMessage',
		defaultMessage:
			'Your prompt or content might not comply with our Acceptable Use Policy. Please review both and refer to our <link>Acceptable Use Policy</link> if needed. If the problem persists, consider trying a different prompt or content.',
		description:
			'Message to indicate to user their prompt or content (this can be a range of content, such as a selection or document -- we used content to keep it vague -- as this will change without user knowing) has been detected as violating Atlassians acceptable use policy.  Note the markdown link -- this is expected to remain as markdown as this string is converted to html.',
	},
	cmdPaletteAupViolationMessage: {
		id: 'fabric.editor.ai.experience.cmdPaletteAupViolationMessage',
		defaultMessage:
			"We couldn’t complete that request because it doesn't comply with our <link>Acceptable Use Policy</link>.",
		description:
			'Message to indicate to user their prompt or content (this can be a range of content, such as a selection or document -- we used content to keep it vague -- as this will change without user knowing) has been detected as violating Atlassians acceptable use policy.  Note the markdown link -- this is expected to remain as markdown as this string is converted to html.',
	},
	documentInsertError: {
		id: 'fabric.editor.ai.experience-application.documentInsertError',
		defaultMessage: `We're having trouble inserting the response. Close the dialog and try again.`,
		description: 'Message to users that displays when error happens during document insertion.',
	},
	tokenLimitExceeded: {
		id: 'fabric.editor.ai.experience-application.tokenLimitExceeded',
		defaultMessage:
			"We couldn't get a response. Your prompt or response was over the limit for this request. Close the dialog and try again.",
		description:
			'Message to users that displays when their request has exceeded the maximum input or output limit.',
	},
	rateLimitEnforced: {
		id: 'fabric.editor.ai.experience-application.rateLimitEnforced',
		defaultMessage:
			'We’ve received too many recent requests for Atlassian Intelligence (AI). Try again in a few minutes or read about <link>excessive use of AI</link>.',
		description: 'Message to users that rate limiting has been enforced.',
	},
	apiError: {
		id: 'fabric.editor.ai.experience.apiError',
		defaultMessage: `We couldn’t get a response, please try again.`,
		description: `We couldn't get a response due to an api error (ie. the backend responded with an error, or got a timeout)`,
	},
	cmdPaletteApiError: {
		id: 'fabric.editor.ai.experience.cmdPaletteApiError',
		defaultMessage: `An error occurred while generating your response.`,
		description: `We couldn't get a response due to an api error (ie. the backend responded with an error, or got a timeout)`,
	},
	elevateDisabledGenerateError: {
		id: 'fabric.editor.ai.experience.elevateDisabledGenetateError',
		defaultMessage: `Free generate is disabled in Elevate at this time.`,
		description: `Message to let internal users know that the free generate editor ai feature is is disabled in Elevate at this time.`,
	},
	internalServerError: {
		id: 'fabric.editor.ai.experience.internalServerError',
		defaultMessage: `Atlassian Intelligence (AI) isn’t responding. Try again later or <link>check the status of AI</link>.`,
		description: `We couldn't get a response due to an internal server error.`,
	},
	inputTooShortError: {
		id: 'fabric.editor.ai.experience.inputTooShortError',
		defaultMessage: `The content is too short to summarize. Please add more and try again.`,
		description: `The input was too short to summarize`,
	},
	hipaaContentError: {
		id: 'fabric.editor.ai.experience.hipaaContentError',
		defaultMessage: `Atlassian Intelligence was unable to process your request as your content contains links to HIPAA restricted content. Please remove these links and try again.`,
		description: `The input contained HIPAA content`,
	},
});
