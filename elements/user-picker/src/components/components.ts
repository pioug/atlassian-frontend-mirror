import memoizeOne, { type MemoizedFn } from 'memoize-one';
import { ClearIndicator } from './ClearIndicator';
import { MultiValue } from './MultiValue';
import { MultiValueContainer } from './MultiValueContainer';
import { Option, type OptionProps } from './Option';
import { SingleValue, type Props } from './SingleValue';
import { Input } from './Input';
import { SingleValueContainer } from './SingleValueContainer';
import { PopupInput } from './PopupInput';
import { PopupControl } from './PopupControl';
import { Menu } from './Menu';
import Control from './Control';
import {
	type ClearIndicatorProps,
	type ControlProps,
	type DropdownIndicatorProps,
	type IndicatorsContainerProps,
	type InputProps,
	type LoadingIndicatorProps,
	type MultiValueGenericProps,
	type MultiValueProps,
	type MultiValueRemoveProps,
	type NoticeProps,
	type SelectComponentsConfig,
	type SingleValueProps,
} from '@atlaskit/select';
import { type OptionData, type UserPickerProps } from '../types';
import type {
	OptionProps as ReactSelectOptionProps,
	GroupBase,
	GroupProps,
	ControlProps as ReactSelectControlProps,
	GroupHeadingProps,
	MenuProps,
	MenuListProps,
	MenuPortalProps,
	PlaceholderProps,
	ContainerProps,
	ValueContainerProps,
} from '@atlaskit/react-select';
import type { ComponentType, FC } from 'react';

/**
 * Memoize getComponents to avoid rerenders.
 */
export const getComponents: MemoizedFn<
	(
		multi?: boolean,
		anchor?: React.ComponentType<any>,
		showClearIndicator?: boolean,
		customComponents?: SelectComponentsConfig<OptionData, boolean>,
	) =>
		| {
				Control: ComponentType<any>;
				Option: FC<OptionProps>;
		  }
		| {
				ClearIndicator:
					| typeof ClearIndicator
					| ComponentType<ClearIndicatorProps<OptionData, boolean, GroupBase<OptionData>>>
					| null;
				Control:
					| ((props: ControlProps<any> & UserPickerProps) => JSX.Element)
					| ComponentType<ReactSelectControlProps<OptionData, boolean, GroupBase<OptionData>>>;
				DropdownIndicator: ComponentType<
					DropdownIndicatorProps<OptionData, boolean, GroupBase<OptionData>>
				> | null;
				Group?: ComponentType<GroupProps<OptionData, boolean, GroupBase<OptionData>>> | undefined;
				GroupHeading?:
					| ComponentType<GroupHeadingProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				IndicatorsContainer?:
					| ComponentType<IndicatorsContainerProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				Input: typeof Input | ComponentType<InputProps<OptionData, boolean, GroupBase<OptionData>>>;
				LoadingIndicator?:
					| ComponentType<LoadingIndicatorProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				LoadingMessage?:
					| ComponentType<NoticeProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				Menu: typeof Menu | ComponentType<MenuProps<OptionData, boolean, GroupBase<OptionData>>>;
				MenuList?:
					| ComponentType<MenuListProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MenuPortal?:
					| ComponentType<MenuPortalProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MultiValue:
					| typeof MultiValue
					| ComponentType<MultiValueProps<OptionData, boolean, GroupBase<OptionData>>>;
				MultiValueContainer?:
					| ComponentType<MultiValueGenericProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MultiValueLabel?:
					| ComponentType<MultiValueGenericProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MultiValueRemove?:
					| ComponentType<MultiValueRemoveProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				NoOptionsMessage?:
					| ComponentType<NoticeProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				Option:
					| FC<OptionProps>
					| ComponentType<ReactSelectOptionProps<OptionData, boolean, GroupBase<OptionData>>>;
				Placeholder?:
					| ComponentType<PlaceholderProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				SelectContainer?:
					| ComponentType<ContainerProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				SingleValue:
					| ((props: Props) => JSX.Element | null)
					| ComponentType<SingleValueProps<OptionData, boolean, GroupBase<OptionData>>>;
				ValueContainer:
					| typeof MultiValueContainer
					| typeof SingleValueContainer
					| ComponentType<ValueContainerProps<OptionData, boolean, GroupBase<OptionData>>>;
		  }
> = memoizeOne(
	(
		multi?: boolean,
		anchor?: React.ComponentType<any>,
		showClearIndicator?: boolean,
		customComponents?: SelectComponentsConfig<OptionData, boolean>,
	):
		| {
				Control: ComponentType<any>;
				Option: FC<OptionProps>;
		  }
		| {
				ClearIndicator:
					| typeof ClearIndicator
					| ComponentType<ClearIndicatorProps<OptionData, boolean, GroupBase<OptionData>>>
					| null;
				Control:
					| ((props: ControlProps<any> & UserPickerProps) => JSX.Element)
					| ComponentType<ReactSelectControlProps<OptionData, boolean, GroupBase<OptionData>>>;
				DropdownIndicator: ComponentType<
					DropdownIndicatorProps<OptionData, boolean, GroupBase<OptionData>>
				> | null;
				Group?: ComponentType<GroupProps<OptionData, boolean, GroupBase<OptionData>>> | undefined;
				GroupHeading?:
					| ComponentType<GroupHeadingProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				IndicatorsContainer?:
					| ComponentType<IndicatorsContainerProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				Input: typeof Input | ComponentType<InputProps<OptionData, boolean, GroupBase<OptionData>>>;
				LoadingIndicator?:
					| ComponentType<LoadingIndicatorProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				LoadingMessage?:
					| ComponentType<NoticeProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				Menu: typeof Menu | ComponentType<MenuProps<OptionData, boolean, GroupBase<OptionData>>>;
				MenuList?:
					| ComponentType<MenuListProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MenuPortal?:
					| ComponentType<MenuPortalProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MultiValue:
					| typeof MultiValue
					| ComponentType<MultiValueProps<OptionData, boolean, GroupBase<OptionData>>>;
				MultiValueContainer?:
					| ComponentType<MultiValueGenericProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MultiValueLabel?:
					| ComponentType<MultiValueGenericProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				MultiValueRemove?:
					| ComponentType<MultiValueRemoveProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				NoOptionsMessage?:
					| ComponentType<NoticeProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				Option:
					| FC<OptionProps>
					| ComponentType<ReactSelectOptionProps<OptionData, boolean, GroupBase<OptionData>>>;
				Placeholder?:
					| ComponentType<PlaceholderProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				SelectContainer?:
					| ComponentType<ContainerProps<OptionData, boolean, GroupBase<OptionData>>>
					| undefined;
				SingleValue:
					| ((props: Props) => JSX.Element | null)
					| ComponentType<SingleValueProps<OptionData, boolean, GroupBase<OptionData>>>;
				ValueContainer:
					| typeof MultiValueContainer
					| typeof SingleValueContainer
					| ComponentType<ValueContainerProps<OptionData, boolean, GroupBase<OptionData>>>;
		  } => {
		if (anchor) {
			return {
				Control: anchor,
				Option,
			};
		} else {
			return {
				MultiValue,
				DropdownIndicator: null,
				SingleValue,
				ClearIndicator: showClearIndicator || !multi ? ClearIndicator : null,
				Option,
				ValueContainer: multi ? MultiValueContainer : SingleValueContainer,
				Input,
				Menu,
				Control,
				...(customComponents ? customComponents : {}),
			};
		}
	},
);

export const getPopupComponents: MemoizedFn<
	(hasPopupTitle: boolean) =>
		| {
				ClearIndicator: typeof ClearIndicator;
				DropdownIndicator: null;
				Input: typeof PopupInput;
				Option: FC<OptionProps>;
				SingleValue: (props: Props) => JSX.Element | null;
				ValueContainer: typeof SingleValueContainer;
		  }
		| {
				ClearIndicator: typeof ClearIndicator;
				Control: typeof PopupControl;
				DropdownIndicator: null;
				Input: typeof PopupInput;
				Option: FC<OptionProps>;
				SingleValue: (props: Props) => JSX.Element | null;
				ValueContainer: typeof SingleValueContainer;
		  }
> = memoizeOne(
	(
		hasPopupTitle: boolean,
	):
		| {
				ClearIndicator: typeof ClearIndicator;
				DropdownIndicator: null;
				Input: typeof PopupInput;
				Option: FC<OptionProps>;
				SingleValue: (props: Props) => JSX.Element | null;
				ValueContainer: typeof SingleValueContainer;
		  }
		| {
				ClearIndicator: typeof ClearIndicator;
				Control: typeof PopupControl;
				DropdownIndicator: null;
				Input: typeof PopupInput;
				Option: FC<OptionProps>;
				SingleValue: (props: Props) => JSX.Element | null;
				ValueContainer: typeof SingleValueContainer;
		  } => {
		const baseProps = {
			DropdownIndicator: null,
			SingleValue,
			ClearIndicator,
			Option,
			ValueContainer: SingleValueContainer,
			Input: PopupInput,
		};
		if (hasPopupTitle) {
			return {
				...baseProps,
				Control: PopupControl,
			};
		}
		return baseProps;
	},
);
