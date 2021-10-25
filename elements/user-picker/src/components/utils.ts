import memoizeOne from 'memoize-one';
import { ReactChild, ReactElement } from 'react';
import {
  AtlaskitSelectValue,
  ExternalUser,
  Email,
  EmailType,
  Option,
  OptionData,
  Promisable,
  Team,
  TeamType,
  Group,
  GroupType,
  User,
  UserType,
  Value,
  OptionIdentifier,
  DefaultValue,
} from '../types';
import { PopupSelect } from '@atlaskit/select';

export const isExternalUser = (option: OptionData): option is ExternalUser =>
  isUser(option) && Boolean(option.isExternal);

export const isUser = (option: OptionData): option is User =>
  option.type === undefined || option.type === UserType;

export const isTeam = (option: OptionData): option is Team =>
  option.type === TeamType;

export const isGroup = (option: OptionData): option is Group =>
  option.type === GroupType;

export const isEmail = (option: OptionData): option is Email =>
  option.type === EmailType;

const isOptionData = (option: any): option is OptionData =>
  (option as OptionData).name !== undefined;

export const optionToSelectableOption = (
  option: OptionData | OptionIdentifier,
): Option => {
  if (isOptionData(option)) {
    return {
      label: option.name,
      value: option.id,
      data: option,
    };
  } else {
    return {
      label: option.id,
      value: option.id,
      data: {
        ...option,
        name: option.id,
      },
    };
  }
};

export const extractOptionValue = (value: AtlaskitSelectValue) => {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.map(({ data: option }) => option);
  }
  return value.data;
};

export const isIterable = (
  a: any,
): a is Iterable<Promisable<OptionData | OptionData[]>> =>
  typeof a[Symbol.iterator] === 'function';

export const getOptions = memoizeOne((options: OptionData[]) =>
  options.map(optionToSelectableOption),
);

export interface OptionToSelectableOptions {
  (defaultValue: OptionData): Option;
  (defaultValue: OptionData[]): Option[];
  (defaultValue?: null): null;
  (defaultValue?: DefaultValue): Option | Option[] | null | undefined;
}

export const optionToSelectableOptions = memoizeOne((defaultValue: Value) => {
  if (!defaultValue) {
    return null;
  }
  if (Array.isArray(defaultValue)) {
    return defaultValue.map(optionToSelectableOption);
  }
  return optionToSelectableOption(defaultValue);
}) as OptionToSelectableOptions;

export const getAvatarSize = (
  appearance: string,
): 'xsmall' | 'small' | 'medium' =>
  appearance === 'big' ? 'medium' : appearance === 'multi' ? 'xsmall' : 'small';

export const isChildInput = (child: ReactChild): child is ReactElement<any> =>
  child &&
  typeof child === 'object' &&
  child.props &&
  child.props.type === 'text';

export const isSingleValue = (value?: AtlaskitSelectValue): value is Option =>
  !!value && !Array.isArray(value);

export const hasValue = (value?: string): value is string =>
  !!value && value.trim().length > 0;

export const callCallback = <U extends any[], R>(
  callback: ((...U: U) => R) | undefined,
  ...args: U
): R | undefined => {
  if (typeof callback === 'function') {
    try {
      //  there is mystery error in IE 11, so we need this try-catch
      return callback(...args);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(
        '@atlassian/user-select: an error happening in `callCallback`: ',
        error,
      );
    }
  }
};

export const getAvatarUrl = (optionData: OptionData) => {
  if (isUser(optionData) || isTeam(optionData)) {
    return optionData.avatarUrl;
  }
  return undefined;
};

export const isPopupUserPickerByComponent = (
  SelectComponent: React.ComponentClass<any>,
) => SelectComponent === PopupSelect;

export const isPopupUserPickerByProps = (selectProps: any) =>
  selectProps.searchThreshold === -1;
