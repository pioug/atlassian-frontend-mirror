export type DatePluginState = {
	focusDateInput: boolean;
	isDateEmpty: boolean;
	isInitialised: boolean;
	isNew: boolean;
	isQuickInsertAction?: boolean;
	showDatePickerAt: number | null;
};
export type DatePluginMeta = {
	isDateEmpty?: boolean;
	isInitialised: boolean;
	isNew?: boolean;
	showDatePickerAt?: number | null;
};
