export type BasicFilterFieldType =
  | 'project'
  | 'assignee'
  | 'issuetype'
  | 'status';

import { ReactElement } from 'react';

interface OptionBase {
  label: string;
  value: string;
}

export type IconLabelOption = OptionBase & {
  optionType: 'iconLabel';
  icon: string;
};

export type LozengeLabelOption = OptionBase & {
  optionType: 'lozengeLabel';
  appearance?:
    | 'default'
    | 'inprogress'
    | 'moved'
    | 'new'
    | 'removed'
    | 'success';
  isBold?: boolean;
};

export type AvatarLabelOption = OptionBase & {
  optionType: 'avatarLabel';
  avatar?: string;
  isSquare?: boolean;
};

export type SelectOption =
  | IconLabelOption
  | LozengeLabelOption
  | AvatarLabelOption;

export type FormatOptionLabel = (option: SelectOption) => ReactElement;
