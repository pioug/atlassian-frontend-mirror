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

export type SelectOption =
  | IconLabelOption
  | LozengeLabelOption
  | AvatarLabelOption;

export type FormatOptionLabel = (option: SelectOption) => ReactElement;
