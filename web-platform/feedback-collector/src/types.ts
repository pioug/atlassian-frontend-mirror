import type { ReactText } from 'react';
export type SelectValue =
	| 'bug'
	| 'comment'
	| 'suggestion'
	| 'question'
	| 'empty'
	| 'not_relevant'
	| 'not_accurate'
	| 'too_slow'
	| 'unhelpful_links'
	| 'other';

export interface FormFields {
	type: SelectValue;
	description: string;
	canBeContacted: boolean;
	enrollInResearchGroup: boolean;
}

export interface SelectOptionDetails {
	fieldLabel: string;
	selectOptionLabel: string;
}

export interface OptionType {
	label: ReactText;
	value: SelectValue;
}
