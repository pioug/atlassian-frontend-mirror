import { type ComponentType } from 'react';

import { type GroupBase } from '../types';

import {
	type ContainerProps,
	IndicatorsContainer,
	type IndicatorsContainerProps,
	SelectContainer,
	ValueContainer,
	type ValueContainerProps,
} from './containers';
import Control, { type ControlProps } from './control';
import Group, { GroupHeading, type GroupHeadingProps, type GroupProps } from './group';
import {
	ClearIndicator,
	type ClearIndicatorProps,
	DropdownIndicator,
	type DropdownIndicatorProps,
	LoadingIndicator,
	type LoadingIndicatorProps,
} from './indicators';
import Input, { type InputProps } from './input';
import Menu, {
	LoadingMessage,
	MenuList,
	type MenuListProps,
	MenuPortal,
	type MenuPortalProps,
	type MenuProps,
	NoOptionsMessage,
	type NoticeProps,
} from './menu';
import MultiValue, {
	MultiValueContainer,
	type MultiValueGenericProps,
	MultiValueLabel,
	type MultiValueProps,
	MultiValueRemove,
	type MultiValueRemoveProps,
} from './multi-value';
import Option, { type OptionProps } from './option';
import Placeholder, { type PlaceholderProps } from './placeholder';
import SingleValue, { type SingleValueProps } from './single-value';

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

export const components = {
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

export type SelectComponentsGeneric = typeof components;

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
