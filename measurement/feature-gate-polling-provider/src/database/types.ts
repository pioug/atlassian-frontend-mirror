import {
	type ClientOptions,
	type CustomAttributes,
	type FrontendExperimentsResult,
	type Identifiers,
} from '@atlaskit/feature-gate-fetcher';

export type RulesetProfile = Pick<ClientOptions, 'environment' | 'targetApp' | 'perimeter'> & {
	identifiers: Identifiers;
	customAttributes?: CustomAttributes;
};

export interface TransactionsWithCommit extends IDBTransaction {}

export interface ObjectWithTimestamp {
	timestamp: number;
}

export interface ExperiemntValuesEntry extends ObjectWithTimestamp {
	profileHash: string;
	context: RulesetProfile;
	experimentValues: FrontendExperimentsResult;
}

export interface ClientSdkKeyEntry extends ObjectWithTimestamp {
	clientSdkKey: string;
	targetApp: string;
}

export type RequestEvent<T> = Event & {
	target: {
		result: T;
	};
};
