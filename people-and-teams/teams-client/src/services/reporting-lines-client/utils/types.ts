/**
 * These are partial types for the reportingLines GQL request from Team Central.
 * Not all data that could be returned is defined here, just what we need.
 */

import type { Maybe } from 'graphql/jsutils/Maybe';

export enum AccountIdentifierType {
	ATLASSIAN_ID = 'ATLASSIAN_ID',
	BASE64_HASH = 'BASE64_HASH',
	UNKNOWN = 'UNKNOWN',
}

export interface ReportingLinesUserPII {
	name?: Maybe<string>;
	accountStatus?: Maybe<string>;
	picture?: Maybe<string>;
	extendedProfile?: Maybe<{
		jobTitle?: Maybe<string>;
	}>;
}

export interface ReportingLinesUser {
	accountIdentifier?: Maybe<string>;
	identifierType?: Maybe<AccountIdentifierType>;
	numberOfDirectReports: number;
	numberOfTotalReports: number;
	pii?: Maybe<ReportingLinesUserPII>;
}

export interface ReportingLines {
	managers?: Maybe<ReportingLinesUser[]>;
	peers?: Maybe<ReportingLinesUser[]>;
	reports?: Maybe<ReportingLinesUser[]>;
	user?: Maybe<ReportingLinesUser>;
	lastModifiedDate?: Maybe<string>;
}
