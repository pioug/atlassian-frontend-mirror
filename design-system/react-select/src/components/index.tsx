import type { ComponentType } from 'react';

import type { GroupBase, MultiValueGenericProps, NoticeProps } from '../types';

import {
	IndicatorsContainer,
	type IndicatorsContainerProps,
} from './containers/indicators-container';
import { MultiValueContainer } from './containers/multi-value-container';
import { type ContainerProps, SelectContainer } from './containers/select-container';
import { ValueContainer, type ValueContainerProps } from './containers/value-container';
import Control, { type ControlProps } from './control';
import Group, { type GroupProps } from './group';
import { GroupHeading, type GroupHeadingProps } from './group-heading';
import { ClearIndicator, type ClearIndicatorProps } from './indicators/clear-indicator';
import { DropdownIndicator, type DropdownIndicatorProps } from './indicators/dropdown-indicator';
import { LoadingIndicator, type LoadingIndicatorProps } from './indicators/loading-indicator';
import Input, { type InputProps } from './input';
import Menu from './menu';
import type { MenuProps } from './menu';
import { MenuList, type MenuListProps } from './menu-list';
import { LoadingMessage } from './menu-loading-message';
import { NoOptionsMessage } from './menu-no-options-message';
import { MenuPortal, type MenuPortalProps } from './menu-portal';
import MultiValue, { type MultiValueProps } from './multi-value';
import { MultiValueLabel } from './multi-value-label';
import { MultiValueRemove, type MultiValueRemoveProps } from './multi-value-remove';
import Option, { type OptionProps } from './option';
import Placeholder, { type PlaceholderProps } from './placeholder';
import SingleValue, { type SingleValueProps } from './single-value';

// Required export for external packages
export interface SelectComponents<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
> {
	ClearIndicator: ComponentType<ClearIndicatorProps<Option, IsMulti, Group>>;
	Control: ComponentType<ControlProps<Option, IsMulti, Group>>;
	DropdownIndicator: ComponentType<DropdownIndicatorProps<Option, IsMulti, Group>> | null;
	Group: ComponentType<GroupProps<Option, IsMulti, Group>>;
	GroupHeading: ComponentType<GroupHeadingProps<Option, IsMulti, Group>>;
	IndicatorsContainer: ComponentType<IndicatorsContainerProps<Option, IsMulti, Group>>;
	Input: ComponentType<InputProps<Option, IsMulti, Group>>;
	LoadingIndicator: ComponentType<LoadingIndicatorProps<Option, IsMulti, Group>>;
	Menu: ComponentType<MenuProps<Option, IsMulti, Group>>;
	MenuList: ComponentType<MenuListProps<Option, IsMulti, Group>>;
	MenuPortal: ComponentType<MenuPortalProps<Option, IsMulti, Group>>;
	LoadingMessage: ComponentType<NoticeProps<Option, IsMulti, Group>>;
	NoOptionsMessage: ComponentType<NoticeProps<Option, IsMulti, Group>>;
	MultiValue: ComponentType<MultiValueProps<Option, IsMulti, Group>>;
	MultiValueContainer: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	MultiValueLabel: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>;
	MultiValueRemove: ComponentType<MultiValueRemoveProps<Option, IsMulti, Group>>;
	Option: ComponentType<OptionProps<Option, IsMulti, Group>>;
	Placeholder: ComponentType<PlaceholderProps<Option, IsMulti, Group>>;
	SelectContainer: ComponentType<ContainerProps<Option, IsMulti, Group>>;
	SingleValue: ComponentType<SingleValueProps<Option, IsMulti, Group>>;
	ValueContainer: ComponentType<ValueContainerProps<Option, IsMulti, Group>>;
}

export type SelectComponentsConfig<
	Option,
	IsMulti extends boolean,
	Group extends GroupBase<Option>,
> = Partial<SelectComponents<Option, IsMulti, Group>>;

export const components: {
	ClearIndicator: typeof ClearIndicator;
	Control: typeof Control;
	DropdownIndicator: typeof DropdownIndicator;
	Group: typeof Group;
	GroupHeading: typeof GroupHeading;
	IndicatorsContainer: typeof IndicatorsContainer;
	Input: typeof Input;
	LoadingIndicator: typeof LoadingIndicator;
	Menu: typeof Menu;
	MenuList: typeof MenuList;
	MenuPortal: typeof MenuPortal;
	LoadingMessage: typeof LoadingMessage;
	NoOptionsMessage: typeof NoOptionsMessage;
	MultiValue: typeof MultiValue;
	MultiValueContainer: typeof MultiValueContainer;
	MultiValueLabel: typeof MultiValueLabel;
	MultiValueRemove: typeof MultiValueRemove;
	Option: typeof Option;
	Placeholder: typeof Placeholder;
	SelectContainer: typeof SelectContainer;
	SingleValue: typeof SingleValue;
	ValueContainer: typeof ValueContainer;
} = {
	ClearIndicator: ClearIndicator,
	Control: Control,
	DropdownIndicator: DropdownIndicator,
	Group: Group,
	GroupHeading: GroupHeading,
	IndicatorsContainer: IndicatorsContainer,
	Input: Input,
	LoadingIndicator: LoadingIndicator,
	Menu: Menu,
	MenuList: MenuList,
	MenuPortal: MenuPortal,
	LoadingMessage: LoadingMessage,
	NoOptionsMessage: NoOptionsMessage,
	MultiValue: MultiValue,
	MultiValueContainer: MultiValueContainer,
	MultiValueLabel: MultiValueLabel,
	MultiValueRemove: MultiValueRemove,
	Option: Option,
	Placeholder: Placeholder,
	SelectContainer: SelectContainer,
	SingleValue: SingleValue,
	ValueContainer: ValueContainer,
};

type SelectComponentsGeneric = typeof components;

interface ComponentsProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
	components: SelectComponentsConfig<Option, IsMulti, Group>;
}

export const defaultComponents = <Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	props: ComponentsProps<Option, IsMulti, Group>,
): SelectComponentsGeneric =>
	({
		...components,
		...props.components,
	}) as SelectComponentsGeneric;
