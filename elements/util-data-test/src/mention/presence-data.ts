export interface PresenceValidInfo {
	data: Data;
}

export interface Data {
	PresenceBulk: PresenceBulk[];
}

export interface PresenceBulk {
	date: null | string;
	message: null | string;
	state: null | string;
	stateMetadata?: string;
	type: null | string;
	userId: string;
}

export const validPresenceData: PresenceValidInfo =
	require('../json-data/presence-valid-info.json') as PresenceValidInfo;

export const invalidPresenceData: PresenceValidInfo =
	require('../json-data/presence-invalid-info.json') as PresenceValidInfo;
