import { type MentionContextIdentifier } from '../types';

export const SMART_EVENT_TYPE = 'smart';

export enum Actions {
	REQUESTED = 'requested',
	SUCCESSFUL = 'successful',
	SEARCHED = 'searched',
	FAILED = 'failed',
	SELECTED = 'selected',
}
export type DefaultAttributes = {
	[key: string]: any;
	context: string;
	pickerType: 'mentions';
	sessionId: string;
	source: 'smarts';
};

export const defaultAttributes = (context?: MentionContextIdentifier): DefaultAttributes => {
	return {
		context: context?.objectId || '',
		sessionId: context?.sessionId || '',
		pickerType: 'mentions',
		source: 'smarts',
	};
};
