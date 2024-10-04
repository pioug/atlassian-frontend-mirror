import {
	type ClientOptions,
	type CustomAttributes,
	type FrontendExperimentsResponse,
	type Identifiers,
} from '@atlaskit/feature-gate-fetcher';

export type RulesetProfile = Pick<ClientOptions, 'environment' | 'targetApp' | 'perimeter'> & {
	identifiers: Identifiers;
	customAttributes?: CustomAttributes;
};

export interface TransactionsWithCommit extends IDBTransaction {}

export type ObjectWithTimestamp = {
	timestamp: number;
};

export type ExperiemntValuesEntry = {
	profileHash: string;
	rulesetProfile: RulesetProfile;
	experimentValuesResponse: FrontendExperimentsResponse;
} & ObjectWithTimestamp;

export type ClientSdkKeyEntry = Pick<ClientOptions, 'environment' | 'targetApp' | 'perimeter'> & {
	clientSdkKey: string;
	dbKey: string;
} & ObjectWithTimestamp;

export type ClientSdkKeyEntryWithoutKey = Omit<ClientSdkKeyEntry, 'dbKey'>;

export type RequestEvent<T> = Event & {
	target: {
		result: T;
	};
};
