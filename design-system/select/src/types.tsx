import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next/withAnalyticsEvents';
import type { AriaOnFocusProps } from '@atlaskit/react-select/accessibility';
import type { ClearIndicatorProps } from '@atlaskit/react-select/clear-indicator';
import type { DropdownIndicatorProps } from '@atlaskit/react-select/dropdown-indicator';
import type {
	GroupBase as GroupType,
	InputActionMeta,
	MultiValueGenericProps,
	NoticeProps,
	ActionMeta as RSActionMeta,
	Options as RSOptionsType,
	OnChangeValue as RSValueType,
	SelectInstance,
} from '@atlaskit/react-select/types';
import type { IndicatorsContainerProps } from '@atlaskit/react-select/indicators-container';
import type { InputProps } from '@atlaskit/react-select/input';
import type { LoadingIndicatorProps } from '@atlaskit/react-select/loading-indicator';
import type { MultiValueProps } from '@atlaskit/react-select/multi-value';
import type { MultiValueRemoveProps } from '@atlaskit/react-select/multi-value-remove';
import type { ControlProps as RSControlProps } from '@atlaskit/react-select/control';
import type { GroupProps as RSGroupProps } from '@atlaskit/react-select/group';
import type { MenuListProps as RSMenuListComponentProps } from '@atlaskit/react-select/menu-list';
import type { MenuProps as RSMenuProps } from '@atlaskit/react-select/menu';
import type { PlaceholderProps as RSPlaceholderProps } from '@atlaskit/react-select/placeholder';
import type { SelectComponentsConfig as RSSelectComponentsConfig } from '@atlaskit/react-select/components';
import type { StylesConfig as RSStylesConfig } from '@atlaskit/react-select/styles';
import type { ValueContainerProps as RSValueContainerProps } from '@atlaskit/react-select/value-container';
import type { OptionProps as ReactSelectOptionProps } from '@atlaskit/react-select/option';
import type { StateManagerProps as ReactSelectProps } from '@atlaskit/react-select/use-state-manager';
import type { SingleValueProps } from '@atlaskit/react-select/single-value';
import type { AsyncProps } from '@atlaskit/react-select/use-async';
import type { FormatOptionLabelMeta, default as BaseSelect } from '@atlaskit/react-select/base';
import type { CreatableProps } from '@atlaskit/react-select/creatable/default';

export type ValidationState = 'default' | 'error' | 'success';
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export interface OptionType {
	[key: string]: any;
	label: string;
	value: string | number;
}

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type OptionsType<Option = OptionType> = RSOptionsType<Option>;

export interface OptionProps<
	Option = OptionType,
	IsMulti extends boolean = false,
> extends ReactSelectOptionProps<Option, IsMulti> {
	[key: string]: any;
	Icon?: React.ComponentType<{
		label: string;
		size?: 'small' | 'medium' | 'large' | 'xlarge';
		onClick?: (e: MouseEvent) => void;
		primaryColor?: string;
		secondaryColor?: string;
		isFacadeDisabled?: boolean;
	}>;
	isDisabled: boolean;
	isFocused: boolean;
	isSelected: boolean;
}

interface CustomSelectProps extends WithAnalyticsEventsProps {
	/**
	 * Controls how the menu is rendered. The default `popup` mode uses the normal transient menu
	 * rendering. The `inline` mode keeps the menu open and renders it within the parent layout.
	 */
	menuRenderMode?: 'popup' | 'inline';
	/**
	 * This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5
	 */
	spacing?: 'compact' | 'default';
	/**
	 * This prop affects the backgroundColor and border of the Select field. 'subtle' makes these transparent while 'none' prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.
	 */
	appearance?: 'default' | 'subtle' | 'none';
	// TODO: Fix testId prop in https://product-fabric.atlassian.net/browse/DSP-12033
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 *
	 *WARNING:** This prop is currently broken and a test ID will not be added to select.
	 * Please refer to the [select testing page](https://atlassian.design/components/select/testing)
	 * for guidance on alternatives to identifying select in tests.
	 */
	testId?: string;
	/**
	 * This prop indicates if the component is in an error state
	 */
	isInvalid?: boolean;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated Use isInvalid instead. The state of validation if used in a form.
	 */
	validationState?: ValidationState;
	descriptionId?: string;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	onClickPreventDefault?: boolean;
}

export interface SelectProps<Option, IsMulti extends boolean = false>
	extends ReactSelectProps<Option, IsMulti>, CustomSelectProps {
	formatOptionLabel?: (
		data: Option,
		formatOptionLabelMeta: FormatOptionLabelMeta<Option>,
	) => React.ReactNode;
	noOptionsMessage?: (obj: { inputValue: string }) => React.ReactNode;
	// temp fix to support unofficial props. https://product-fabric.atlassian.net/browse/DSP-21074
	[key: string]: any;
}

export interface AsyncSelectProps<Option, IsMulti extends boolean = false>
	extends AsyncProps<Option, IsMulti, GroupType<Option>>, CustomSelectProps {
	// temp fix to support unofficial props. https://product-fabric.atlassian.net/browse/DSP-21074
	[key: string]: any;
}

export interface CreatableSelectProps<Option, IsMulti extends boolean = false>
	extends CreatableProps<Option, IsMulti, GroupType<Option>>, CustomSelectProps {
	// temp fix to support unofficial props. https://product-fabric.atlassian.net/browse/DSP-21074
	[key: string]: any;
}

export type ActionMeta<Option = OptionType> = RSActionMeta<Option>;

export type ControlProps<Option, IsMulti extends boolean = false> = RSControlProps<Option, IsMulti>;

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type ValueType<Option, IsMulti extends boolean = false> = RSValueType<Option, IsMulti>;

export type StylesConfig<Option = OptionType, IsMulti extends boolean = false> = RSStylesConfig<
	Option,
	IsMulti
>;

export type SelectComponentsConfig<
	Option,
	IsMulti extends boolean = false,
> = RSSelectComponentsConfig<Option, IsMulti, GroupType<Option>>;

export type GroupProps<Option, IsMulti extends boolean = false> = RSGroupProps<Option, IsMulti>;

export type MenuProps<Option, IsMulti extends boolean = false> = RSMenuProps<Option, IsMulti>;

export type MenuListComponentProps<
	Option,
	IsMulti extends boolean = false,
> = RSMenuListComponentProps<Option, IsMulti>;

export type PlaceholderProps<Option, IsMulti extends boolean = false> = RSPlaceholderProps<
	Option,
	IsMulti
>;

export type ValueContainerProps<Option, IsMulti extends boolean = false> = RSValueContainerProps<
	Option,
	IsMulti
>;

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type GroupedOptionsType<Option> = ReadonlyArray<GroupType<Option>>;

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type AtlaskitSelectRefType = {
	select: BaseSelect | null;
	blur: () => void;
	focus: () => void;
};

export type {
	SelectInstance,
	FormatOptionLabelMeta,
	InputActionMeta,
	GroupType,
	InputProps,
	MultiValueProps,
	MultiValueGenericProps,
	ReactSelectProps,
	SingleValueProps,
	ClearIndicatorProps,
	DropdownIndicatorProps,
	IndicatorsContainerProps,
	LoadingIndicatorProps,
	NoticeProps,
	MultiValueRemoveProps,
	AriaOnFocusProps,
};
