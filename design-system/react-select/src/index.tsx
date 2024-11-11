import type Select from './select';
import type { GroupBase } from './types';
import useStateManager from './use-state-manager';

export { default } from './state-manager';
export { mergeStyles } from './styles';
export { defaultTheme } from './theme';
export { createFilter, type FilterOptionOption } from './filters';
export { components } from './components';
export type SelectInstance<
	Option = unknown,
	IsMulti extends boolean = false,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = Select<Option, IsMulti, Group>;
export type { StateManagerProps as Props } from './use-state-manager';
export { useStateManager };

export type { SelectComponentsConfig } from './components';
export type {
	ContainerProps,
	IndicatorsContainerProps,
	ValueContainerProps,
} from './components/containers';
export type { ControlProps } from './components/control';
export type { GroupProps, GroupHeadingProps } from './components/group';
export type {
	ClearIndicatorProps,
	DropdownIndicatorProps,
	IndicatorSeparatorProps,
	LoadingIndicatorProps,
} from './components/indicators';
export type { InputProps } from './components/input';
export type { MenuListProps, MenuProps, NoticeProps } from './components/menu';
export type {
	MultiValueGenericProps,
	MultiValueProps,
	MultiValueRemoveProps,
} from './components/multi-value';
export type { OptionProps } from './components/option';
export type { PlaceholderProps } from './components/placeholder';
export type { SingleValueProps } from './components/single-value';
export type { ThemeConfig } from './theme';
export type { ClassNamesConfig, StylesConfig } from './styles';
export {
	type GroupBase,
	type OptionsOrGroups,
	type Options,
	type SingleValue,
	type MultiValue,
	type PropsValue,
	type OnChangeValue,
	type Colors,
	type ThemeSpacing,
	type Theme,
	type ClassNamesState,
	type CX,
	type GetStyles,
	type CommonProps,
	type CommonPropsAndClassName,
	type ActionMetaBase,
	type SelectOptionActionMeta,
	type DeselectOptionActionMeta,
	type RemoveValueActionMeta,
	type PopValueActionMeta,
	type ClearActionMeta,
	type CreateOptionActionMeta,
	type InitialInputFocusedActionMeta,
	type ActionMeta,
	type SetValueAction,
	type InputAction,
	type InputActionMeta,
	type MenuPlacement,
	type CoercedMenuPlacement,
	type MenuPosition,
	type FocusDirection,
	type GetOptionLabel,
	type GetOptionValue,
	type CSSObjectWithLabel,
} from './types';
export type {
	OptionContext,
	GuidanceContext,
	AriaGuidanceProps,
	AriaOnChangeProps,
	AriaOnFilterProps,
	AriaOnFocusProps,
	AriaLiveMessages,
	AriaGuidance,
	AriaOnChange,
	AriaOnFilter,
	AriaOnFocus,
} from './accessibility';
export type { FormatOptionLabelContext, FormatOptionLabelMeta } from './select';
