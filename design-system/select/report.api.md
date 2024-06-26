<!-- API Report Version: 2.3 -->

## API Report File for "@atlaskit/select"

> Do not edit this file. This report is auto-generated using
> [API Extractor](https://api-extractor.com/).
> [Learn more about API reports](https://hello.atlassian.net/wiki/spaces/UR/pages/1825484529/Package+API+Reports)

### Table of contents

- [Main Entry Types](#main-entry-types)
- [Peer Dependencies](#peer-dependencies)

### Main Entry Types

<!--SECTION START: Main Entry Types-->

```ts
/// <reference types="react" />

import { ActionMeta as ActionMeta_2 } from 'react-select';
import { AsyncProps } from 'react-select/async';
import BaseSelect from 'react-select/base';
import { ClearIndicatorProps } from 'react-select';
import { components } from 'react-select';
import { ContainerProps } from 'react-select';
import { Context } from 'react';
import { ControlProps as ControlProps_2 } from 'react-select';
import { CreatableProps } from 'react-select/creatable';
import { createFilter } from 'react-select';
import { CrossIconProps } from 'react-select/dist/declarations/src/components/indicators';
import { default as default_2 } from 'react-select/base';
import { DownChevronProps } from 'react-select/dist/declarations/src/components/indicators';
import { DropdownIndicatorProps } from 'react-select';
import { ErrorInfo } from 'react';
import { FC } from 'react';
import { FormatOptionLabelMeta } from 'react-select';
import { GroupHeadingProps } from 'react-select';
import { GroupProps as GroupProps_2 } from 'react-select';
import { GroupBase as GroupType } from 'react-select';
import { IndicatorsContainerProps } from 'react-select';
import { IndicatorSeparatorProps } from 'react-select';
import { InputActionMeta } from 'react-select';
import { InputProps } from 'react-select';
import { jsx } from '@emotion/react';
import { KeyboardEventHandler } from 'react';
import { LoadingIndicatorProps } from 'react-select';
import { MemoizedFn } from 'memoize-one';
import { MenuListProps } from 'react-select';
import { MenuPortal } from 'react-select/dist/declarations/src/components/Menu';
import { MenuProps as MenuProps_2 } from 'react-select';
import { mergeStyles } from 'react-select';
import { MultiValueGenericProps } from 'react-select';
import { MultiValueProps } from 'react-select';
import { MultiValueRemove } from 'react-select/dist/declarations/src/components/MultiValue';
import { MultiValueRemoveProps } from 'react-select';
import { NoticeProps } from 'react-select';
import { OnChangeValue } from 'react-select';
import { OptionProps as OptionProps_2 } from 'react-select';
import { Options } from 'react-select';
import { PlaceholderProps as PlaceholderProps_2 } from 'react-select';
import { PopperProps } from 'react-popper';
import { PortalStyleArgs } from 'react-select/dist/declarations/src/components/Menu';
import { PureComponent } from 'react';
import { default as React_2 } from 'react';
import { ReactInstance } from 'react';
import { ReactNode } from 'react';
import { Props as ReactSelectProps } from 'react-select';
import { SelectComponents } from 'react-select/dist/declarations/src/components';
import { SelectComponentsConfig as SelectComponentsConfig_2 } from 'react-select';
import { SelectInstance } from 'react-select';
import { SingleValueProps } from 'react-select';
import { StylesConfig as StylesConfig_2 } from 'react-select';
import { StylesConfigFunction } from 'react-select/dist/declarations/src/styles';
import { UnbindFn } from 'bind-event-listener';
import { useAsync } from 'react-select/async';
import { useCreatable } from 'react-select/creatable';
import { ValueContainerProps as ValueContainerProps_2 } from 'react-select';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

// @public (undocumented)
export type ActionMeta<Option = OptionType> = ActionMeta_2<Option>;

// @public (undocumented)
export const AsyncCreatableSelect: {
	new <Option = OptionType, IsMulti extends boolean = false>(
		props: SelectProps<Option, IsMulti>,
	): {
		components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>;
		select: default_2<unknown, false, GroupType<unknown>> | null;
		UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>): void;
		cacheComponents: (
			components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>,
		) => void;
		focus(): void;
		blur(): void;
		onSelectRef: (ref: default_2<unknown, false, GroupType<unknown>>) => void;
		render(): JSX.Element;
		context: any;
		setState<K extends never>(
			state:
				| ((
						prevState: Readonly<{}>,
						props: Readonly<
							| AsyncSelectProps<Option, IsMulti>
							| CreatableSelectProps<Option, IsMulti>
							| SelectProps<Option, IsMulti>
						>,
				  ) => Pick<{}, K> | null | {})
				| Pick<{}, K>
				| null
				| {},
			callback?: (() => void) | undefined,
		): void;
		forceUpdate(callback?: (() => void) | undefined): void;
		readonly props: Readonly<
			| AsyncSelectProps<Option, IsMulti>
			| CreatableSelectProps<Option, IsMulti>
			| SelectProps<Option, IsMulti>
		> &
			Readonly<{
				children?: ReactNode;
			}>;
		state: Readonly<{}>;
		refs: {
			[key: string]: ReactInstance;
		};
		componentDidMount?(): void;
		shouldComponentUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): boolean;
		componentWillUnmount?(): void;
		componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
		getSnapshotBeforeUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
		): any;
		componentDidUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
			snapshot?: any,
		): void;
		componentWillMount?(): void;
		UNSAFE_componentWillMount?(): void;
		componentWillReceiveProps?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextContext: any,
		): void;
		componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
		UNSAFE_componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
	};
	defaultProps: {
		validationState: string;
		spacing: string;
		onClickPreventDefault: boolean;
		tabSelectsValue: boolean;
		components: {
			Input: (props: InputProps<unknown, boolean, GroupType<unknown>>) => JSX.Element;
		};
		styles: {};
	};
	contextType?: Context<any> | undefined;
};

// @public (undocumented)
export const AsyncSelect: {
	new <Option = OptionType, IsMulti extends boolean = false>(
		props: SelectProps<Option, IsMulti>,
	): {
		components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>;
		select: default_2<unknown, false, GroupType<unknown>> | null;
		UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>): void;
		cacheComponents: (
			components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>,
		) => void;
		focus(): void;
		blur(): void;
		onSelectRef: (ref: default_2<unknown, false, GroupType<unknown>>) => void;
		render(): JSX.Element;
		context: any;
		setState<K extends never>(
			state:
				| ((
						prevState: Readonly<{}>,
						props: Readonly<
							| AsyncSelectProps<Option, IsMulti>
							| CreatableSelectProps<Option, IsMulti>
							| SelectProps<Option, IsMulti>
						>,
				  ) => Pick<{}, K> | null | {})
				| Pick<{}, K>
				| null
				| {},
			callback?: (() => void) | undefined,
		): void;
		forceUpdate(callback?: (() => void) | undefined): void;
		readonly props: Readonly<
			| AsyncSelectProps<Option, IsMulti>
			| CreatableSelectProps<Option, IsMulti>
			| SelectProps<Option, IsMulti>
		> &
			Readonly<{
				children?: ReactNode;
			}>;
		state: Readonly<{}>;
		refs: {
			[key: string]: ReactInstance;
		};
		componentDidMount?(): void;
		shouldComponentUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): boolean;
		componentWillUnmount?(): void;
		componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
		getSnapshotBeforeUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
		): any;
		componentDidUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
			snapshot?: any,
		): void;
		componentWillMount?(): void;
		UNSAFE_componentWillMount?(): void;
		componentWillReceiveProps?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextContext: any,
		): void;
		componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
		UNSAFE_componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
	};
	defaultProps: {
		validationState: string;
		spacing: string;
		onClickPreventDefault: boolean;
		tabSelectsValue: boolean;
		components: {
			Input: (props: InputProps<unknown, boolean, GroupType<unknown>>) => JSX.Element;
		};
		styles: {};
	};
	contextType?: Context<any> | undefined;
};

// @public (undocumented)
export interface AsyncSelectProps<Option, IsMulti extends boolean = false>
	extends AsyncProps<Option, IsMulti, GroupType<Option>>,
		CustomSelectProps {}

// @public (undocumented)
export const CheckboxOption: FC<OptionProps<OptionType, true>>;

// @public (undocumented)
export const CheckboxSelect: React_2.MemoExoticComponent<
	({ components, ...props }: SelectProps<OptionType, true>) => JSX.Element
>;

export { ClearIndicatorProps };

export { components };

// @public (undocumented)
export type ControlProps<Option, IsMulti extends boolean = false> = ControlProps_2<Option, IsMulti>;

// @public (undocumented)
type Country = (typeof groupedCountries)[number]['options'][number];

// @public (undocumented)
interface Country_2 {
	// (undocumented)
	abbr: string;
	// (undocumented)
	code: string;
	// (undocumented)
	icon: string;
	// (undocumented)
	name: string;
	// (undocumented)
	suggested?: boolean;
}

// @public (undocumented)
export const CountrySelect: (props: SelectProps<Country>) => jsx.JSX.Element;

// @public (undocumented)
export const CreatableSelect: {
	new <Option = OptionType, IsMulti extends boolean = false>(
		props: SelectProps<Option, IsMulti>,
	): {
		components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>;
		select: default_2<unknown, false, GroupType<unknown>> | null;
		UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>): void;
		cacheComponents: (
			components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>,
		) => void;
		focus(): void;
		blur(): void;
		onSelectRef: (ref: default_2<unknown, false, GroupType<unknown>>) => void;
		render(): JSX.Element;
		context: any;
		setState<K extends never>(
			state:
				| ((
						prevState: Readonly<{}>,
						props: Readonly<
							| AsyncSelectProps<Option, IsMulti>
							| CreatableSelectProps<Option, IsMulti>
							| SelectProps<Option, IsMulti>
						>,
				  ) => Pick<{}, K> | null | {})
				| Pick<{}, K>
				| null
				| {},
			callback?: (() => void) | undefined,
		): void;
		forceUpdate(callback?: (() => void) | undefined): void;
		readonly props: Readonly<
			| AsyncSelectProps<Option, IsMulti>
			| CreatableSelectProps<Option, IsMulti>
			| SelectProps<Option, IsMulti>
		> &
			Readonly<{
				children?: ReactNode;
			}>;
		state: Readonly<{}>;
		refs: {
			[key: string]: ReactInstance;
		};
		componentDidMount?(): void;
		shouldComponentUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): boolean;
		componentWillUnmount?(): void;
		componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
		getSnapshotBeforeUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
		): any;
		componentDidUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
			snapshot?: any,
		): void;
		componentWillMount?(): void;
		UNSAFE_componentWillMount?(): void;
		componentWillReceiveProps?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextContext: any,
		): void;
		componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
		UNSAFE_componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
	};
	defaultProps: {
		validationState: string;
		spacing: string;
		onClickPreventDefault: boolean;
		tabSelectsValue: boolean;
		components: {
			Input: (props: InputProps<unknown, boolean, GroupType<unknown>>) => JSX.Element;
		};
		styles: {};
	};
	contextType?: Context<any> | undefined;
};

// @public (undocumented)
interface CreatableSelectProps<Option, IsMulti extends boolean = false>
	extends CreatableProps<Option, IsMulti, GroupType<Option>>,
		CustomSelectProps {}

export { createFilter };

// @public (undocumented)
interface CustomSelectProps extends WithAnalyticsEventsProps {
	appearance?: 'default' | 'none' | 'subtle';
	isInvalid?: boolean;
	spacing?: 'compact' | 'default';
	testId?: string;
	// @deprecated (undocumented)
	validationState?: ValidationState;
}

// @public (undocumented)
const _default: {
	new <Option = OptionType, IsMulti extends boolean = false>(
		props: SelectProps<Option, IsMulti>,
	): {
		components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>;
		select: default_2<unknown, false, GroupType<unknown>> | null;
		UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>): void;
		cacheComponents: (
			components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>,
		) => void;
		focus(): void;
		blur(): void;
		onSelectRef: (ref: default_2<unknown, false, GroupType<unknown>>) => void;
		render(): JSX.Element;
		context: any;
		setState<K extends never>(
			state:
				| ((
						prevState: Readonly<{}>,
						props: Readonly<
							| AsyncSelectProps<Option, IsMulti>
							| CreatableSelectProps<Option, IsMulti>
							| SelectProps<Option, IsMulti>
						>,
				  ) => Pick<{}, K> | null | {})
				| Pick<{}, K>
				| null
				| {},
			callback?: (() => void) | undefined,
		): void;
		forceUpdate(callback?: (() => void) | undefined): void;
		readonly props: Readonly<
			| AsyncSelectProps<Option, IsMulti>
			| CreatableSelectProps<Option, IsMulti>
			| SelectProps<Option, IsMulti>
		> &
			Readonly<{
				children?: ReactNode;
			}>;
		state: Readonly<{}>;
		refs: {
			[key: string]: ReactInstance;
		};
		componentDidMount?(): void;
		shouldComponentUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): boolean;
		componentWillUnmount?(): void;
		componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
		getSnapshotBeforeUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
		): any;
		componentDidUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
			snapshot?: any,
		): void;
		componentWillMount?(): void;
		UNSAFE_componentWillMount?(): void;
		componentWillReceiveProps?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextContext: any,
		): void;
		componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
		UNSAFE_componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
	};
	defaultProps: {
		validationState: string;
		spacing: string;
		onClickPreventDefault: boolean;
		tabSelectsValue: boolean;
		components: {
			Input: (props: InputProps<unknown, boolean, GroupType<unknown>>) => JSX.Element;
		};
		styles: {};
	};
	contextType?: Context<any> | undefined;
};
export default _default;

// @public (undocumented)
const defaultComponents: {
	Control: FC<ControlProps<OptionType, boolean>>;
	DropdownIndicator: () => jsx.JSX.Element;
	Menu: ({ children, innerProps }: MenuProps<OptionType, boolean>) => jsx.JSX.Element;
};

// @public (undocumented)
type defaultModifiers = 'offset' | 'preventOverflow';

export { DropdownIndicatorProps };

export { FormatOptionLabelMeta };

// @public (undocumented)
const groupedCountries: readonly [
	{
		readonly label: 'Suggested';
		readonly options: Country_2[];
	},
	{
		readonly label: 'All Countries';
		readonly options: Country_2[];
	},
];

// @public (undocumented)
export type GroupedOptionsType<Option> = ReadonlyArray<GroupType<Option>>;

// @public (undocumented)
export type GroupProps<Option, IsMulti extends boolean = false> = GroupProps_2<Option, IsMulti>;

export { GroupType };

export { IndicatorSeparatorProps };

export { InputActionMeta };

export { InputProps };

export { LoadingIndicatorProps };

// @public (undocumented)
export type MenuListComponentProps<Option, IsMulti extends boolean = false> = MenuListProps<
	Option,
	IsMulti
>;

// @public (undocumented)
export type MenuProps<Option, IsMulti extends boolean = false> = MenuProps_2<Option, IsMulti>;

export { mergeStyles };

// @public (undocumented)
export type ModifierList =
	| 'applyStyles'
	| 'arrow'
	| 'computeStyles'
	| 'eventListeners'
	| 'flip'
	| 'handleFlipStyle'
	| 'hide'
	| 'offset'
	| 'popperOffsets'
	| 'preventOverflow';

export { MultiValueProps };

export { MultiValueRemoveProps };

export { NoticeProps };

// @public (undocumented)
export interface OptionProps<Option = OptionType, IsMulti extends boolean = false>
	extends OptionProps_2<Option, IsMulti> {
	// (undocumented)
	[key: string]: any;
	// (undocumented)
	Icon?: React.ComponentType<{
		label: string;
		size?: 'large' | 'medium' | 'small' | 'xlarge';
		onClick?: (e: MouseEvent) => void;
		primaryColor?: string;
		secondaryColor?: string;
	}>;
	// (undocumented)
	isDisabled: boolean;
	// (undocumented)
	isFocused: boolean;
	// (undocumented)
	isSelected: boolean;
}

// @public (undocumented)
export type OptionsType<Option = OptionType> = Options<Option>;

// @public (undocumented)
export interface OptionType {
	// (undocumented)
	[key: string]: any;
	// (undocumented)
	label: string;
	// (undocumented)
	value: number | string;
}

// @public (undocumented)
export type PlaceholderProps<Option, IsMulti extends boolean = false> = PlaceholderProps_2<
	Option,
	IsMulti
>;

// @public (undocumented)
type PopperPropsNoChildren<Modifiers> = Omit<PopperProps<Modifiers>, 'children'>;

// @public (undocumented)
export class PopupSelect<
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = ModifierList,
> extends PureComponent<PopupSelectProps<Option, IsMulti, Modifiers>, State> {
	close: (options?: { controlOverride?: boolean }) => void;
	// (undocumented)
	componentDidMount(): void;
	// (undocumented)
	componentDidUpdate(prevProps: PopupSelectProps<Option, IsMulti, Modifiers>): void;
	// (undocumented)
	componentWillUnmount(): void;
	// (undocumented)
	defaultOpenState: boolean | undefined;
	// (undocumented)
	static defaultProps: {
		closeMenuOnSelect: boolean;
		components: {};
		maxMenuHeight: number;
		maxMenuWidth: number;
		minMenuWidth: number;
		popperProps: {};
		isSearchable: boolean;
		searchThreshold: number;
		styles: {};
		options: never[];
	};
	// (undocumented)
	defaultStyles: StylesConfig<Option, IsMulti>;
	// (undocumented)
	static getDerivedStateFromProps(
		props: PopupSelectProps<OptionType>,
		state: State,
	): Partial<State<string>> | null;
	// (undocumented)
	getItemCount: () => number;
	// (undocumented)
	getMaxHeight: () => number | undefined;
	// (undocumented)
	getSelectComponents: MemoizedFn<
		(
			mergedComponents: typeof defaultComponents,
			showSearchControl: boolean | undefined,
		) => Partial<{
			ClearIndicator: <Option_1, IsMulti_1 extends boolean, Group extends GroupType<Option_1>>(
				props: ClearIndicatorProps<Option_1, IsMulti_1, Group>,
			) => jsx;
			Control: <Option_1, IsMulti_1 extends boolean, Group_1 extends GroupType<Option_1>>(
				props: ControlProps_2<Option_1, IsMulti_1, Group_1>,
			) => jsx;
			DropdownIndicator: <Option_2, IsMulti_2 extends boolean, Group_2 extends GroupType<Option_2>>(
				props: DropdownIndicatorProps<Option_2, IsMulti_2, Group_2>,
			) => jsx;
			DownChevron: (props: DownChevronProps) => jsx;
			CrossIcon: (props: CrossIconProps) => jsx;
			Group: <Option_3, IsMulti_3 extends boolean, Group_3 extends GroupType<Option_3>>(
				props: GroupProps_2<Option_3, IsMulti_3, Group_3>,
			) => jsx;
			GroupHeading: <Option_4, IsMulti_4 extends boolean, Group_4 extends GroupType<Option_4>>(
				props: GroupHeadingProps<Option_4, IsMulti_4, Group_4>,
			) => jsx;
			IndicatorsContainer: <
				Option_5,
				IsMulti_5 extends boolean,
				Group_5 extends GroupType<Option_5>,
			>(
				props: IndicatorsContainerProps<Option_5, IsMulti_5, Group_5>,
			) => jsx;
			IndicatorSeparator: <
				Option_6,
				IsMulti_6 extends boolean,
				Group_6 extends GroupType<Option_6>,
			>(
				props: IndicatorSeparatorProps<Option_6, IsMulti_6, Group_6>,
			) => jsx;
			Input: <Option_7, IsMulti_7 extends boolean, Group_7 extends GroupType<Option_7>>(
				props: InputProps<Option_7, IsMulti_7, Group_7>,
			) => jsx;
			LoadingIndicator: {
				<Option_8, IsMulti_8 extends boolean, Group_8 extends GroupType<Option_8>>(
					props: LoadingIndicatorProps<Option_8, IsMulti_8, Group_8>,
				): jsx;
				defaultProps: {
					size: number;
				};
			};
			Menu: <Option_9, IsMulti_9 extends boolean, Group_9 extends GroupType<Option_9>>(
				props: MenuProps_2<Option_9, IsMulti_9, Group_9>,
			) => jsx;
			MenuList: <Option_10, IsMulti_10 extends boolean, Group_10 extends GroupType<Option_10>>(
				props: MenuListProps<Option_10, IsMulti_10, Group_10>,
			) => jsx;
			MenuPortal: MenuPortal;
			LoadingMessage: {
				<Option_11, IsMulti_11 extends boolean, Group_11 extends GroupType<Option_11>>(
					props: NoticeProps<Option_11, IsMulti_11, Group_11>,
				): jsx;
				defaultProps: {
					children: string;
				};
			};
			NoOptionsMessage: {
				<Option_12, IsMulti_12 extends boolean, Group_12 extends GroupType<Option_12>>(
					props: NoticeProps<Option_12, IsMulti_12, Group_12>,
				): jsx;
				defaultProps: {
					children: string;
				};
			};
			MultiValue: <Option_13, IsMulti_13 extends boolean, Group_13 extends GroupType<Option_13>>(
				props: MultiValueProps<Option_13, IsMulti_13, Group_13>,
			) => jsx;
			MultiValueContainer: <
				Option_14,
				IsMulti_14 extends boolean,
				Group_14 extends GroupType<Option_14>,
			>({
				children,
				innerProps,
			}: MultiValueGenericProps<Option_14, IsMulti_14, Group_14>) => jsx;
			MultiValueLabel: <
				Option_14_1,
				IsMulti_14_1 extends boolean,
				Group_14_1 extends GroupType<Option_14_1>,
			>({
				children,
				innerProps,
			}: MultiValueGenericProps<Option_14_1, IsMulti_14_1, Group_14_1>) => jsx;
			MultiValueRemove: MultiValueRemove;
			Option: <Option_15, IsMulti_15 extends boolean, Group_15 extends GroupType<Option_15>>(
				props: OptionProps_2<Option_15, IsMulti_15, Group_15>,
			) => jsx;
			Placeholder: <Option_16, IsMulti_16 extends boolean, Group_16 extends GroupType<Option_16>>(
				props: PlaceholderProps_2<Option_16, IsMulti_16, Group_16>,
			) => jsx;
			SelectContainer: <
				Option_17,
				IsMulti_17 extends boolean,
				Group_17 extends GroupType<Option_17>,
			>(
				props: ContainerProps<Option_17, IsMulti_17, Group_17>,
			) => jsx;
			SingleValue: <Option_18, IsMulti_18 extends boolean, Group_18 extends GroupType<Option_18>>(
				props: SingleValueProps<Option_18, IsMulti_18, Group_18>,
			) => jsx;
			ValueContainer: <
				Option_19,
				IsMulti_19 extends boolean,
				Group_19 extends GroupType<Option_19>,
			>(
				props: ValueContainerProps_2<Option_19, IsMulti_19, Group_19>,
			) => jsx;
		}>
	>;
	// (undocumented)
	getSelectRef: (ref: BaseSelect<Option, IsMulti>) => void;
	// (undocumented)
	getSelectStyles: MemoizedFn<
		(
			defaultStyles: StylesConfig<Option, IsMulti>,
			propStyles: StylesConfig<Option, IsMulti> | undefined,
		) => {
			clearIndicator?:
				| StylesConfigFunction<ClearIndicatorProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			container?:
				| StylesConfigFunction<ContainerProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			control?:
				| StylesConfigFunction<ControlProps_2<Option, IsMulti, GroupType<Option>>>
				| undefined;
			dropdownIndicator?:
				| StylesConfigFunction<DropdownIndicatorProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			group?: StylesConfigFunction<GroupProps_2<Option, IsMulti, GroupType<Option>>> | undefined;
			groupHeading?:
				| StylesConfigFunction<GroupHeadingProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			indicatorsContainer?:
				| StylesConfigFunction<IndicatorsContainerProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			indicatorSeparator?:
				| StylesConfigFunction<IndicatorSeparatorProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			input?: StylesConfigFunction<InputProps<Option, IsMulti, GroupType<Option>>> | undefined;
			loadingIndicator?:
				| StylesConfigFunction<LoadingIndicatorProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			loadingMessage?:
				| StylesConfigFunction<NoticeProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			menu?: StylesConfigFunction<MenuProps_2<Option, IsMulti, GroupType<Option>>> | undefined;
			menuList?:
				| StylesConfigFunction<MenuListProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			menuPortal?:
				| StylesConfigFunction<PortalStyleArgs>
				| undefined /** @deprecated Use isInvalid instead. The state of validation if used in a form */;
			multiValue?:
				| StylesConfigFunction<MultiValueProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			multiValueLabel?:
				| StylesConfigFunction<MultiValueProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			multiValueRemove?:
				| StylesConfigFunction<MultiValueProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			noOptionsMessage?:
				| StylesConfigFunction<NoticeProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			option?: StylesConfigFunction<OptionProps_2<Option, IsMulti, GroupType<Option>>> | undefined;
			placeholder?:
				| StylesConfigFunction<PlaceholderProps_2<Option, IsMulti, GroupType<Option>>>
				| undefined;
			singleValue?:
				| StylesConfigFunction<SingleValueProps<Option, IsMulti, GroupType<Option>>>
				| undefined;
			valueContainer?:
				| StylesConfigFunction<ValueContainerProps_2<Option, IsMulti, GroupType<Option>>>
				| undefined;
		}
	>;
	// (undocumented)
	handleClick: ({ target }: MouseEvent) => void;
	// (undocumented)
	handleFirstPopperUpdate: () => void;
	// (undocumented)
	handleKeyDown: (event: KeyboardEvent) => void;
	// (undocumented)
	handleSelectChange: (value: ValueType<Option, IsMulti>, actionMeta: ActionMeta<Option>) => void;
	// (undocumented)
	handleTargetKeyDown: (event: React_2.KeyboardEvent) => void;
	// (undocumented)
	isOpenControlled: boolean;
	// (undocumented)
	menuRef: HTMLElement | null;
	open: (options?: { controlOverride?: boolean }) => void;
	// (undocumented)
	popperWrapperId: string;
	// (undocumented)
	render(): JSX.Element;
	// (undocumented)
	renderSelect: () => JSX.Element | null;
	// (undocumented)
	resolveMenuRef: (popperRef: React_2.Ref<HTMLElement>) => (ref: HTMLElement) => void;
	// (undocumented)
	resolveTargetRef: (popperRef: React_2.Ref<HTMLElement>) => (ref: HTMLElement) => void;
	// (undocumented)
	selectRef: BaseSelect<Option, IsMulti> | null;
	// (undocumented)
	showSearchControl: () => boolean | undefined;
	// (undocumented)
	state:
		| {
				focusLockEnabled: boolean;
				isOpen: boolean;
				mergedComponents: {
					Control: React_2.FC<ControlProps<OptionType, boolean>>;
					DropdownIndicator: () => jsx;
					Menu: ({ children, innerProps }: MenuProps<OptionType, boolean>) => jsx;
				};
				mergedPopperProps: PopperPropsNoChildren<string>;
		  }
		| {
				isOpen: boolean;
				mergedComponents: {
					Control: React_2.FC<ControlProps<OptionType, boolean>>;
					DropdownIndicator: () => jsx;
					Menu: ({ children, innerProps }: MenuProps<OptionType, boolean>) => jsx;
				};
				mergedPopperProps: PopperPropsNoChildren<string>;
				focusLockEnabled?: undefined;
		  };
	// (undocumented)
	targetRef: HTMLElement | null;
	// (undocumented)
	unbindWindowClick: UnbindFn | null;
	// (undocumented)
	unbindWindowKeydown: UnbindFn | null;
}

// @public (undocumented)
export interface PopupSelectProps<
	Option = OptionType,
	IsMulti extends boolean = false,
	Modifiers = ModifierList,
> extends ReactSelectProps<Option, IsMulti> {
	closeMenuOnSelect?: boolean;
	// (undocumented)
	defaultIsOpen?: boolean;
	footer?: ReactNode;
	isInvalid?: boolean;
	// (undocumented)
	isOpen?: boolean;
	isSearchable?: boolean;
	label?: string;
	maxMenuWidth?: number | string;
	minMenuWidth?: number | string;
	popperProps?: PopperPropsNoChildren<Modifiers>;
	searchThreshold?: number;
	spacing?: string;
	target?: (
		options: PopupSelectTriggerProps & {
			isOpen: boolean;
		},
	) => ReactNode;
	// (undocumented)
	testId?: string;
	// @deprecated (undocumented)
	validationState?: ValidationState;
}

// @public (undocumented)
interface PopupSelectTriggerProps {
	// (undocumented)
	'aria-controls'?: string;
	// (undocumented)
	'aria-expanded': boolean;
	// (undocumented)
	'aria-haspopup': 'true';
	// (undocumented)
	onKeyDown: KeyboardEventHandler<HTMLElement>;
	// (undocumented)
	ref: any;
}

// @public (undocumented)
export const RadioOption: FC<OptionProps>;

// @public (undocumented)
export const RadioSelect: React_2.MemoExoticComponent<
	({ components, ...props }: SelectProps<OptionType>) => JSX.Element
>;

export { ReactSelectProps };

// @public (undocumented)
export type SelectComponentsConfig<
	Option,
	IsMulti extends boolean = false,
> = SelectComponentsConfig_2<Option, IsMulti, GroupType<Option>>;

export { SelectInstance };

// @public (undocumented)
export interface SelectProps<Option, IsMulti extends boolean = false>
	extends ReactSelectProps<Option, IsMulti>,
		CustomSelectProps {}

// @public (undocumented)
export const SelectWithoutAnalytics: {
	new <Option = OptionType, IsMulti extends boolean = false>(
		props: SelectProps<Option, IsMulti>,
	): {
		components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>;
		select: default_2<unknown, false, GroupType<unknown>> | null;
		UNSAFE_componentWillReceiveProps(nextProps: SelectProps<Option, IsMulti>): void;
		cacheComponents: (
			components: Partial<SelectComponents<Option, IsMulti, GroupType<Option>>>,
		) => void;
		focus(): void;
		blur(): void;
		onSelectRef: (ref: default_2<unknown, false, GroupType<unknown>>) => void;
		render(): JSX.Element;
		context: any;
		setState<K extends never>(
			state:
				| ((
						prevState: Readonly<{}>,
						props: Readonly<
							| AsyncSelectProps<Option, IsMulti>
							| CreatableSelectProps<Option, IsMulti>
							| SelectProps<Option, IsMulti>
						>,
				  ) => Pick<{}, K> | null | {})
				| Pick<{}, K>
				| null
				| {},
			callback?: (() => void) | undefined,
		): void;
		forceUpdate(callback?: (() => void) | undefined): void;
		readonly props: Readonly<
			| AsyncSelectProps<Option, IsMulti>
			| CreatableSelectProps<Option, IsMulti>
			| SelectProps<Option, IsMulti>
		> &
			Readonly<{
				children?: ReactNode;
			}>;
		state: Readonly<{}>;
		refs: {
			[key: string]: ReactInstance;
		};
		componentDidMount?(): void;
		shouldComponentUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): boolean;
		componentWillUnmount?(): void;
		componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
		getSnapshotBeforeUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
		): any;
		componentDidUpdate?(
			prevProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			prevState: Readonly<{}>,
			snapshot?: any,
		): void;
		componentWillMount?(): void;
		UNSAFE_componentWillMount?(): void;
		componentWillReceiveProps?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextContext: any,
		): void;
		componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
		UNSAFE_componentWillUpdate?(
			nextProps: Readonly<
				| AsyncSelectProps<Option, IsMulti>
				| CreatableSelectProps<Option, IsMulti>
				| SelectProps<Option, IsMulti>
			>,
			nextState: Readonly<{}>,
			nextContext: any,
		): void;
	};
	defaultProps: {
		validationState: string;
		spacing: string;
		onClickPreventDefault: boolean;
		tabSelectsValue: boolean;
		components: {
			Input: (props: InputProps<unknown, boolean, GroupType<unknown>>) => JSX.Element;
		};
		styles: {};
	};
	contextType?: Context<any> | undefined;
};

export { SingleValueProps };

// @public (undocumented)
interface State<Modifiers = string> {
	focusLockEnabled?: boolean;
	// (undocumented)
	isOpen: boolean;
	// (undocumented)
	mergedComponents: Object;
	// (undocumented)
	mergedPopperProps: PopperPropsNoChildren<Modifiers | defaultModifiers>;
}

// @public (undocumented)
export type StylesConfig<Option = OptionType, IsMulti extends boolean = false> = StylesConfig_2<
	Option,
	IsMulti
>;

export { useAsync };

export { useCreatable };

// @public (undocumented)
export type ValidationState = 'default' | 'error' | 'success';

// @public (undocumented)
export type ValueContainerProps<Option, IsMulti extends boolean = false> = ValueContainerProps_2<
	Option,
	IsMulti
>;

// @public (undocumented)
export type ValueType<Option, IsMulti extends boolean = false> = OnChangeValue<Option, IsMulti>;

// (No @packageDocumentation comment for this package)
```

<!--SECTION END: Main Entry Types-->

### Peer Dependencies

<!--SECTION START: Peer Dependencies-->

```json
{
	"react": "^16.8.0",
	"react-dom": "^16.8.0"
}
```

<!--SECTION END: Peer Dependencies-->
