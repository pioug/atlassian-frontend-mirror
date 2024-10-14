import { type FrontendExperimentsResponse } from '@atlaskit/feature-gate-fetcher';
import {
	type BaseClientOptions,
	type CustomAttributes,
	type Identifiers,
} from '@atlaskit/feature-gate-js-client';

export type RulesetProfile = Pick<BaseClientOptions, 'environment' | 'targetApp' | 'perimeter'> & {
	identifiers: Identifiers;
	customAttributes?: CustomAttributes;
};

export interface TransactionsWithCommit extends IDBTransaction {}

export type ObjectWithTimestamp = {
	timestamp: number;
};

export type ExperimentValuesEntry = {
	profileHash: string;
	rulesetProfile: RulesetProfile;
	experimentValuesResponse: FrontendExperimentsResponse;
} & ObjectWithTimestamp;

export type ClientSdkKeyEntry = Pick<
	BaseClientOptions,
	'environment' | 'targetApp' | 'perimeter'
> & {
	clientSdkKey: string;
	dbKey: string;
} & ObjectWithTimestamp;

export type ClientSdkKeyEntryWithoutKey = Omit<ClientSdkKeyEntry, 'dbKey'>;

export type RequestEvent<T> = Event & {
	target: {
		result: T;
	};
};
