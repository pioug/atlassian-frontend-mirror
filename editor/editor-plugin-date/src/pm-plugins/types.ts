export type DatePluginState = {
  isQuickInsertAction?: boolean;
  isNew: boolean;
  showDatePickerAt: number | null;
  isDateEmpty: boolean;
  focusDateInput: boolean;
};
export type DatePluginMeta = {
  isNew?: boolean;
  showDatePickerAt?: number | null;
  isDateEmpty?: boolean;
};
