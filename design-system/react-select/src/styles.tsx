import { type IndicatorsContainerProps } from './components/containers/indicators-container';
import { type ContainerProps } from './components/containers/select-container';
import { type ValueContainerProps } from './components/containers/value-container';
import { type ControlProps } from './components/control';
import { type GroupProps } from './components/group';
import { type GroupHeadingProps } from './components/group-heading';
import { type ClearIndicatorProps } from './components/indicators/clear-indicator';
import { type DropdownIndicatorProps } from './components/indicators/dropdown-indicator';
import { type LoadingIndicatorProps } from './components/indicators/loading-indicator';
import { type InputProps } from './components/input';
import { type MenuProps } from './components/menu';
import { type MenuListProps } from './components/menu-list';
import { type PortalStyleArgs } from './components/menu-portal';
import { type MultiValueProps } from './components/multi-value';
import { type OptionProps } from './components/option';
import { type PlaceholderProps } from './components/placeholder';
import { type SingleValueProps } from './components/single-value';
import { type CSSObjectWithLabel, type GroupBase, type NoticeProps } from './types';

export interface StylesProps<Option, IsMulti extends boolean, Group extends GroupBase<Option>> {
	clearIndicator: ClearIndicatorProps<Option, IsMulti, Group>;
	container: ContainerProps<Option, IsMulti, Group>;
	control: ControlProps<Option, IsMulti, Group>;
	dropdownIndicator: DropdownIndicatorProps<Option, IsMulti, Group>;
	group: GroupProps<Option, IsMulti, Group>;
	groupHeading: GroupHeadingProps<Option, IsMulti, Group>;
	indicatorsContainer: IndicatorsContainerProps<Option, IsMulti, Group>;
	input: InputProps<Option, IsMulti, Group>;
	loadingIndicator: LoadingIndicatorProps<Option, IsMulti, Group>;
	loadingMessage: NoticeProps<Option, IsMulti, Group>;
	menu: MenuProps<Option, IsMulti, Group>;
	menuList: MenuListProps<Option, IsMulti, Group>;
	menuPortal: PortalStyleArgs;
	multiValue: MultiValueProps<Option, IsMulti, Group>;
	multiValueLabel: MultiValueProps<Option, IsMulti, Group>;
	multiValueRemove: MultiValueProps<Option, IsMulti, Group>;
	noOptionsMessage: NoticeProps<Option, IsMulti, Group>;
	option: OptionProps<Option, IsMulti, Group>;
	placeholder: PlaceholderProps<Option, IsMulti, Group>;
	singleValue: SingleValueProps<Option, IsMulti, Group>;
	valueContainer: ValueContainerProps<Option, IsMulti, Group>;
}

export type StylesConfig<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = {
	[K in keyof StylesProps<Option, IsMulti, Group>]?: (
		base: CSSObjectWithLabel,
		props: StylesProps<Option, IsMulti, Group>[K],
	) => CSSObjectWithLabel;
};

export type ClassNamesConfig<
	Option = unknown,
	IsMulti extends boolean = boolean,
	Group extends GroupBase<Option> = GroupBase<Option>,
> = {
	[K in keyof StylesProps<Option, IsMulti, Group>]?: (
		props: StylesProps<Option, IsMulti, Group>[K],
	) => string;
};

// Merge Utility
// Allows consumers to extend a base Select with additional styles
export function mergeStyles<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
	source: StylesConfig<Option, IsMulti, Group>,
	target: StylesConfig<Option, IsMulti, Group> = {},
): {
	[K in keyof StylesProps<Option, IsMulti, Group>]?: (
		base: CSSObjectWithLabel,
		props: StylesProps<Option, IsMulti, Group>[K],
	) => CSSObjectWithLabel;
} {
	// initialize with source styles
	const styles = { ...source };

	// massage in target styles
	Object.keys(target).forEach((keyAsString) => {
		const key = keyAsString as keyof StylesConfig<Option, IsMulti, Group>;
		if (source[key]) {
			styles[key] = (rsCss: any, props: any) => {
				return target[key]!(source[key]!(rsCss, props), props);
			};
		} else {
			styles[key] = target[key] as any;
		}
	});

	return styles;
}
