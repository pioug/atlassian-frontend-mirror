import {
	withAnalyticsEvents,
	type CreateUIAnalyticsEvent,
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
	PopupSelect,
	type PopupSelectProps,
	type SelectComponentsConfig,
	type StylesConfig,
} from '@atlaskit/select';
import React from 'react';
import {
	type Appearance,
	type BoundariesElement,
	type DefaultValue,
	type LoadOptions,
	type LoadUserSource,
	type OnChange,
	type OnInputChange,
	type OnOption,
	type OnPicker,
	type OptionData,
	type PopupUserPickerProps,
	type RootBoundary,
	type Target,
	type UserPickerRef,
	type Value,
} from '../types';
import { getPopupComponents } from './components';
import { getPopupStyles } from './styles';
import { getPopupProps } from './popup';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';
import { fg } from '@atlaskit/platform-feature-flags';
import type { Placement } from '@popperjs/core';
import type { EmailValidator } from './emailValidation';

interface State {
	flipped: boolean;
}

export class PopupUserPickerWithoutAnalytics extends React.Component<PopupUserPickerProps, State> {
	static defaultProps: Partial<PopupUserPickerProps> = {
		boundariesElement: 'viewport',
		width: 300,
		isMulti: false,
		offset: [0, 0],
		placement: 'auto',
		rootBoundary: 'viewport',
		shouldFlip: true,
		strategy: 'fixed',
	};
	state = {
		flipped: false,
	};

	handleFlipStyle = (data: {
		flipped: boolean;
		popper: any;
		styles: any;
	}): {
		flipped: boolean;
		popper: any;
		styles: any;
	} => {
		const {
			flipped,
			styles: { transform },
			popper: { height },
		} = data;
		this.setState({ flipped });
		if (!flipped) {
			return data;
		}

		data.styles.transform = transform + `translate(0, ${height}px) translate(0, -100%)`;
		return data;
	};

	render(): React.JSX.Element {
		const {
			target,
			popupTitle,
			boundariesElement,
			isMulti,
			offset,
			placement,
			rootBoundary,
			shouldFlip,
			styles,
			strategy,
		} = this.props;
		const width = this.props.width as string | number;

		const selectStyles = getPopupStyles(
			width,
			isMulti,
			styles,
			fg('platform-component-visual-refresh'),
		);

		const pickerProps = {
			...getPopupProps(
				width,
				target,
				this.handleFlipStyle,
				boundariesElement,
				offset,
				placement,
				rootBoundary,
				shouldFlip,
				popupTitle,
				strategy,
			),
			...(this.props.popupSelectProps || {}),
		};

		return (
			<BaseUserPickerWithoutAnalytics
				{...this.props}
				SelectComponent={PopupSelect}
				width={width}
				styles={selectStyles}
				components={getPopupComponents(!!popupTitle)}
				pickerProps={pickerProps}
			/>
		);
	}
}

export const PopupUserPicker: React.ForwardRefExoticComponent<
	Omit<
		Pick<
			Omit<
				{
					addMoreMessage?: string;
					allowEmail?: boolean;
					anchor?: React.ComponentType<any>;
					appearance?: Appearance;
					ariaDescribedBy?: string;
					ariaLabel?: string;
					ariaLabelledBy?: string;
					ariaLive?: 'polite' | 'off' | 'assertive';
					autoFocus?: boolean;
					captureMenuScroll?: boolean;
					clearValueLabel?: string;
					closeMenuOnScroll?: boolean | EventListener;
					components?: SelectComponentsConfig<OptionData, boolean>;
					defaultValue?: DefaultValue;
					disableInput?: boolean;
					emailLabel?: string;
					fieldId: string | null;
					footer?: React.ReactNode;
					forwardedRef?: React.ForwardedRef<UserPickerRef>;
					groupByTypeOrder?: NonNullable<OptionData['type']>[];
					header?: React.ReactNode;
					height?: number | string;
					includeTeamsUpdates?: boolean;
					inputId?: string;
					isClearable?: boolean;
					isDisabled?: boolean;
					isFooterFocused?: boolean;
					isHeaderFocused?: boolean;
					isInvalid?: boolean;
					isLoading?: boolean;
					isMulti?: boolean;
					isValidEmail?: EmailValidator;
					loadOptions?: LoadOptions;
					loadOptionsErrorMessage?: (value: { inputValue: string }) => React.ReactNode;
					loadUserSource?: LoadUserSource;
					maxOptions?: number;
					maxPickerHeight?: number;
					menuIsOpen?: boolean;
					menuMinWidth?: number;
					menuPortalTarget?: HTMLElement;
					menuPosition?: 'absolute' | 'fixed';
					menuShouldBlockScroll?: boolean;
					minHeight?: number | string;
					name?: string;
					noBorder?: boolean;
					noOptionsMessage?:
						| ((value: { inputValue: string }) => string | null | React.ReactNode)
						| null
						| React.ReactNode;
					onBlur?: OnPicker;
					onChange?: OnChange;
					onClear?: OnPicker;
					onClose?: OnPicker;
					onFocus?: OnPicker;
					onInputChange?: OnInputChange;
					onKeyDown?: (event: React.KeyboardEvent) => void;
					onOpen?: OnPicker;
					onSelection?: OnOption;
					open?: boolean;
					openMenuOnClick?: boolean;
					options?: OptionData[];
					placeholder?: React.ReactNode;
					placeholderAvatar?: 'person' | 'team';
					popupSelectProps?: PopupSelectProps<OptionData>;
					required?: boolean;
					search?: string;
					setIsFooterFocused?: React.Dispatch<React.SetStateAction<boolean>>;
					setIsHeaderFocused?: React.Dispatch<React.SetStateAction<boolean>>;
					showClearIndicator?: boolean;
					strategy?: 'fixed' | 'absolute';
					styles?: StylesConfig;
					subtle?: boolean;
					suggestEmailsForDomain?: string;
					textFieldBackgroundColor?: boolean;
					UNSAFE_hasDraggableParentComponent?: boolean;
					value?: Value;
					width?: number | string;
				} & {
					boundariesElement?: BoundariesElement;
					offset?: [number, number];
					placement?: Placement;
					popupTitle?: string;
					rootBoundary?: RootBoundary;
					shouldFlip?: boolean;
					target: Target;
				},
				keyof WithAnalyticsEventsProps
			>,
			never
		> & {
			footer?: React.ReactNode;
			header?: React.ReactNode;
			search?: string | undefined;
			appearance?: Appearance | undefined;
			height?: number | string | undefined;
			minHeight?: number | string | undefined;
			width?: number | string | undefined;
			offset?: [number, number] | undefined;
			shouldFlip?: boolean | undefined;
			boundariesElement?: BoundariesElement | undefined;
			placement?: Placement | undefined;
			anchor?: React.ComponentType<any> | undefined;
			onInputChange?: OnInputChange | undefined;
			onSelection?: OnOption | undefined;
			options?: OptionData[] | undefined;
			required?: boolean | undefined;
			name?: string | undefined;
			placeholder?: React.ReactNode;
			value?: Value;
			onChange?: OnChange | undefined;
			defaultValue?: DefaultValue;
			autoFocus?: boolean | undefined;
			onFocus?: OnPicker | undefined;
			onBlur?: OnPicker | undefined;
			onKeyDown?: ((event: React.KeyboardEvent) => void) | undefined;
			isDisabled?: boolean | undefined;
			addMoreMessage?: string | undefined;
			allowEmail?: boolean | undefined;
			ariaDescribedBy?: string | undefined;
			ariaLabel?: string | undefined;
			ariaLabelledBy?: string | undefined;
			ariaLive?: 'polite' | 'off' | 'assertive' | undefined;
			captureMenuScroll?: boolean | undefined;
			clearValueLabel?: string | undefined;
			closeMenuOnScroll?: (boolean | EventListener) | undefined;
			components?: SelectComponentsConfig<OptionData, boolean> | undefined;
			disableInput?: boolean | undefined;
			emailLabel?: string | undefined;
			fieldId?: string | null | undefined;
			forwardedRef?: React.ForwardedRef<UserPickerRef> | undefined;
			groupByTypeOrder?: NonNullable<OptionData['type']>[] | undefined;
			includeTeamsUpdates?: boolean | undefined;
			inputId?: string | undefined;
			isClearable?: boolean | undefined;
			isFooterFocused?: boolean | undefined;
			isHeaderFocused?: boolean | undefined;
			isInvalid?: boolean | undefined;
			isLoading?: boolean | undefined;
			isMulti?: boolean | undefined;
			isValidEmail?: EmailValidator | undefined;
			loadOptions?: LoadOptions | undefined;
			loadOptionsErrorMessage?: ((value: { inputValue: string }) => React.ReactNode) | undefined;
			loadUserSource?: LoadUserSource | undefined;
			maxOptions?: number | undefined;
			maxPickerHeight?: number | undefined;
			menuIsOpen?: boolean | undefined;
			menuMinWidth?: number | undefined;
			menuPortalTarget?: HTMLElement | undefined;
			menuPosition?: 'absolute' | 'fixed' | undefined;
			menuShouldBlockScroll?: boolean | undefined;
			noBorder?: boolean | undefined;
			noOptionsMessage?:
				| React.ReactNode
				| ((value: { inputValue: string }) => string | null | React.ReactNode);
			onClear?: OnPicker | undefined;
			onClose?: OnPicker | undefined;
			onOpen?: OnPicker | undefined;
			open?: boolean | undefined;
			openMenuOnClick?: boolean | undefined;
			placeholderAvatar?: 'person' | 'team' | undefined;
			popupSelectProps?: PopupSelectProps<OptionData> | undefined;
			setIsFooterFocused?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
			setIsHeaderFocused?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
			showClearIndicator?: boolean | undefined;
			strategy?: 'fixed' | 'absolute' | undefined;
			styles?: StylesConfig | undefined;
			subtle?: boolean | undefined;
			suggestEmailsForDomain?: string | undefined;
			textFieldBackgroundColor?: boolean | undefined;
			UNSAFE_hasDraggableParentComponent?: boolean | undefined;
			popupTitle?: string | undefined;
			rootBoundary?: RootBoundary | undefined;
			target?: Target | undefined;
		} & {
			ref?: React.Ref<any> | undefined;
			createAnalyticsEvent?: CreateUIAnalyticsEvent | undefined;
		},
		'ref'
	> &
		React.RefAttributes<any>
> = withAnalyticsEvents()(PopupUserPickerWithoutAnalytics);
