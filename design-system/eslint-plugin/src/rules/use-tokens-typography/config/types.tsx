/* eslint-disable @atlassian/tangerine/import/entry-points */
type Pattern =
	| 'style-object'
	| 'font-weight'
	| 'font-family'
	| 'untokenized-properties'
	| 'banned-properties'
	| 'restricted-capitalisation';

export type RuleConfig = {
	failSilently: boolean;
	enableUnsafeAutofix: boolean;
	patterns: Pattern[];
};
