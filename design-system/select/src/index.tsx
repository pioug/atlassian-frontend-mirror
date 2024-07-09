export { components, createFilter, mergeStyles } from 'react-select';
export { useAsync } from 'react-select/async';
export { useCreatable } from 'react-select/creatable';

export { CheckboxOption, RadioOption } from './components/input-options';

export { default, SelectWithoutAnalytics } from './entry-points/select';
export { default as AsyncSelect } from './entry-points/async-select';
export { default as CreatableSelect } from './entry-points/creatable-select';
export { default as AsyncCreatableSelect } from './entry-points/async-creatable-select';

export { isOptionsGrouped } from './utils/grouped-options-announcement';

export { default as CheckboxSelect } from './CheckboxSelect';
export { default as CountrySelect } from './CountrySelect';
export { default as RadioSelect } from './RadioSelect';
export { default as PopupSelect } from './PopupSelect';
export type { PopupSelectProps, ModifierList } from './PopupSelect';

export type {
	SelectInstance,
	ActionMeta,
	ControlProps,
	FormatOptionLabelMeta,
	InputActionMeta,
	InputProps,
	MenuProps,
	MenuListComponentProps,
	OptionProps,
	OptionsType,
	OptionType,
	SelectComponentsConfig,
	SelectProps,
	StylesConfig,
	ValueContainerProps,
	ValueType,
	GroupedOptionsType,
	GroupType,
	// Types replacing indicatorProps
	ClearIndicatorProps,
	DropdownIndicatorProps,
	IndicatorSeparatorProps,
	LoadingIndicatorProps,
	// we have found usages of the types below in AF and other repos
	MultiValueProps,
	MultiValueRemoveProps,
	ReactSelectProps,
	SingleValueProps,
	NoticeProps,
	ValidationState,
	GroupProps,
	AsyncSelectProps,
	PlaceholderProps,
	AriaOnFocusProps,
} from './types';

/**
 * Types not exported on the public API, didn't find usages in sourcegraph
 *
 * CreatableSelectProps,
 */
