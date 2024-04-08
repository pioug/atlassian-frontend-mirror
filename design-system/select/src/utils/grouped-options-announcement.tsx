import { AriaOnFocusProps, GroupBase, OptionsOrGroups } from 'react-select';
import { GroupType, OptionType } from '../types';

// Used for overwriting ariaLiveMessages builtin onFocus method.
// Returns custom built string while focusing each group option. This string is used for screen reader announcement.
export function onFocus(
  props: AriaOnFocusProps<OptionType, GroupBase<OptionType>>,
) {
  const { focused, options } = props;
  const isOptionFocused = (option: OptionType) => {
    return option === focused;
  };
  const groupData = options?.find((option) => {
    return option.options?.some(isOptionFocused);
  });

  const groupOptionIndex = groupData?.options.findIndex(isOptionFocused) ?? 0;

  return `Option ${focused.label}, ${groupData?.label} group, item ${
    groupOptionIndex + 1
  } out of ${groupData?.options.length}. All in all `;
}

// Helper function which identifies if options are grouped.
export const isOptionsGrouped = (
  arr: OptionsOrGroups<OptionType, GroupType<OptionType>>,
) => {
  return arr?.every((obj) => obj.hasOwnProperty('options'));
};
