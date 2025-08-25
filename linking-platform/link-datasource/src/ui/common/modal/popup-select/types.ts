import { type ReactElement } from 'react';

export interface OptionBase {
	label: string;
	value: string;
}

export type IconLabelOption = OptionBase & {
	icon: string;
	optionType: 'iconLabel';
};

export type LozengeLabelOption = OptionBase & {
	appearance?: LozengeAppearance;
	optionType: 'lozengeLabel';
};

export type LozengeAppearance = 'default' | 'inprogress' | 'moved' | 'new' | 'removed' | 'success';

export type AvatarLabelOption = OptionBase & {
	avatar?: string;
	isGroup?: boolean;
	isSquare?: boolean;
	optionType: 'avatarLabel';
};

export type DateRangeType =
	| 'anyTime'
	| 'today'
	| 'yesterday'
	| 'past7Days'
	| 'past30Days'
	| 'pastYear'
	| 'custom';

export type DateRangeOption = OptionBase & {
	from?: string;
	optionType: 'dateRange';
	to?: string;
	value: DateRangeType;
};

export type SelectOption =
	| IconLabelOption
	| LozengeLabelOption
	| AvatarLabelOption
	| DateRangeOption;

export type FormatOptionLabel = (option: SelectOption) => ReactElement;

export interface CommonBasicFilterHookState {
	errors: unknown[];
	status: 'empty' | 'loading' | 'resolved' | 'rejected';
}
