import { ReactElement } from 'react';

export interface OptionBase {
  label: string;
  value: string;
}

export type IconLabelOption = OptionBase & {
  optionType: 'iconLabel';
  icon: string;
};

export type LozengeLabelOption = OptionBase & {
  optionType: 'lozengeLabel';
  appearance?: LozengeAppearance;
};

export type LozengeAppearance =
  | 'default'
  | 'inprogress'
  | 'moved'
  | 'new'
  | 'removed'
  | 'success';

export type AvatarLabelOption = OptionBase & {
  optionType: 'avatarLabel';
  avatar?: string;
  isSquare?: boolean;
  isGroup?: boolean;
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
  optionType: 'dateRange';
  value: DateRangeType;
  from?: string;
  to?: string;
};

export type SelectOption =
  | IconLabelOption
  | LozengeLabelOption
  | AvatarLabelOption
  | DateRangeOption;

export type FormatOptionLabel = (option: SelectOption) => ReactElement;

export interface CommonBasicFilterHookState {
  status: 'empty' | 'loading' | 'resolved' | 'rejected';
  errors: unknown[];
}
