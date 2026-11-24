import { type BooleanValidParam, type ValidParam, type ValidPrefix } from './types';

export const ROVO_PARAM_PREFIX: ValidPrefix = 'rovoChat';
export const ROVO_VALID_PARAMS: ValidParam[] = [
	'pathway',
	'agentId',
	'conversationId',
	'prompt',
	'cloudId',
	'triggerOpen',
	'insertPrompt',
	'stagingAreaOpen',
	'messageIdSelectedForPreview',
	'invocationIdSelectedForPreview',
	'promptLibraryOpen',
	'rovoJourneyId',
	'searchQuery',
];

// A record so that adding a boolean field to BaseRovoChatParams, required or optional, fails to
// compile until it is listed here.
const ROVO_BOOLEAN_PARAM_RECORD: Record<BooleanValidParam, true> = {
	triggerOpen: true,
	stagingAreaOpen: true,
	promptLibraryOpen: true,
};
// Object.keys returns string[], but the record's keys are exactly BooleanValidParam.
export const ROVO_BOOLEAN_PARAMS = Object.keys(
	ROVO_BOOLEAN_PARAM_RECORD,
) as readonly BooleanValidParam[];
