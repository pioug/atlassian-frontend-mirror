/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import Select, { CreatableSelect, type PopupSelectProps, type SelectComponentsConfig, type StylesConfig } from '@atlaskit/select';
import { UFOExperienceState } from '@atlaskit/ufo';
import React from 'react';
import { type Appearance, type DefaultValue, type LoadOptions, type LoadUserSource, type OnChange, type OnInputChange, type OnOption, type OnPicker, type OptionData, type UserPickerProps, type UserPickerRef, type Value } from '../types';
import { BaseUserPickerWithoutAnalytics } from './BaseUserPicker';
import { getStyles } from './styles';
import { getComponents } from './components';
import { getCreatableProps } from './creatable';
import { getCreatableSuggestedEmailProps } from './creatableEmailSuggestion';
import MessagesIntlProvider from './MessagesIntlProvider';
import { ExusUserSourceProvider } from '../clients/UserSourceProvider';
import {
	userPickerRenderedUfoExperience as experience,
	UfoErrorBoundary,
} from '../util/ufoExperiences';
import { jsx } from '@compiled/react';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';
import { fg } from '@atlaskit/platform-feature-flags';
import type { EmailValidator } from './emailValidation';

export class UserPickerWithoutAnalytics extends React.Component<UserPickerProps> {
	ufoId: string;

	constructor(props: UserPickerProps) {
		super(props);
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		this.ufoId = uuidv4();
		const experienceForId = experience.getInstance(this.ufoId);
		if (
			![UFOExperienceState.IN_PROGRESS.id, UFOExperienceState.STARTED.id].includes(
				experienceForId.state.id,
			)
		) {
			experienceForId.start();
		}
	}

	static defaultProps = {
		width: 350,
		isMulti: false,
	};

	componentDidMount(): void {
		const experienceForId = experience.getInstance(this.ufoId);

		// Send UFO success if the experience is still in progress i.e. hasn't failed
		if (
			[UFOExperienceState.IN_PROGRESS.id, UFOExperienceState.STARTED.id].includes(
				experienceForId.state.id,
			)
		) {
			experienceForId.success();
		}
	}

	render(): JSX.Element {
		const {
			emailLabel,
			allowEmail,
			suggestEmailsForDomain,
			isMulti,
			isValidEmail,
			anchor,
			menuPortalTarget,
			menuPosition,
			menuShouldBlockScroll,
			captureMenuScroll,
			closeMenuOnScroll,
			loadUserSource,
			menuIsOpen,
			required = false,
			showClearIndicator = false,
			includeTeamsUpdates = false,
		} = this.props;
		const width = this.props.width as string | number;

		const SelectComponent = allowEmail ? CreatableSelect : Select;
		const creatableProps = suggestEmailsForDomain
			? getCreatableSuggestedEmailProps(suggestEmailsForDomain, isValidEmail)
			: getCreatableProps(isValidEmail);

		const defaultPickerProps = {
			closeMenuOnScroll,
			menuPortalTarget,
			menuPosition,
			menuShouldBlockScroll,
			captureMenuScroll,
			required,
			includeTeamsUpdates,
			menuIsOpen,
		};

		const pickerProps = allowEmail
			? {
					...defaultPickerProps,
					...creatableProps,
					emailLabel,
				}
			: { ...defaultPickerProps };

		return (
			<UfoErrorBoundary id={this.ufoId}>
				<MessagesIntlProvider>
					<ExusUserSourceProvider fetchUserSource={loadUserSource}>
						<BaseUserPickerWithoutAnalytics
							{...this.props}
							forwardedRef={this.props.forwardedRef}
							width={width}
							SelectComponent={SelectComponent}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
							styles={getStyles(
								width,
								isMulti,
								this.props.appearance === 'compact',
								this.props.styles,
								fg('platform-component-visual-refresh'),
								false,
								this.props.height,
								this.props.minHeight,
							)}
							components={getComponents(
								isMulti,
								anchor,
								showClearIndicator,
								this.props?.components ? this.props.components : {},
							)}
							pickerProps={pickerProps}
						/>
					</ExusUserSourceProvider>
				</MessagesIntlProvider>
			</UfoErrorBoundary>
		);
	}
}

export const UserPicker: React.ForwardRefExoticComponent<Pick<Omit<{
    addMoreMessage?: string;
    allowEmail?: boolean;
    anchor?: React.ComponentType<any>;
    appearance?: Appearance;
    ariaDescribedBy?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaLive?: "polite" | "off" | "assertive";
    autoFocus?: boolean;
    captureMenuScroll?: boolean;
    clearValueLabel?: string;
    closeMenuOnScroll?: boolean | EventListener;
    components?: SelectComponentsConfig<OptionData, boolean>;
    customGroupLabels?: Partial<Record<NonNullable<OptionData["type"]>, React.ReactNode>>;
    defaultValue?: DefaultValue;
    disableInput?: boolean;
    emailLabel?: string;
    fieldId: string | null;
    footer?: React.ReactNode;
    forwardedRef?: React.ForwardedRef<UserPickerRef>;
    groupByTypeOrder?: NonNullable<OptionData["type"]>[];
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
    loadOptionsErrorMessage?: (value: {
        inputValue: string;
    }) => React.ReactNode;
    loadUserSource?: LoadUserSource;
    maxOptions?: number;
    maxPickerHeight?: number;
    menuIsOpen?: boolean;
    menuMinWidth?: number;
    menuPortalTarget?: HTMLElement;
    menuPosition?: "absolute" | "fixed";
    menuShouldBlockScroll?: boolean;
    minHeight?: number | string;
    name?: string;
    noBorder?: boolean;
    noOptionsMessage?: ((value: {
        inputValue: string;
    }) => string | null | React.ReactNode) | null | React.ReactNode;
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
    openMenuOnFocus?: boolean;
    options?: OptionData[];
    placeholder?: React.ReactNode;
    placeholderAvatar?: "person" | "team";
    popupSelectProps?: PopupSelectProps<OptionData>;
    required?: boolean;
    search?: string;
    setIsFooterFocused?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsHeaderFocused?: React.Dispatch<React.SetStateAction<boolean>>;
    showClearIndicator?: boolean;
    strategy?: "fixed" | "absolute";
    styles?: StylesConfig;
    subtle?: boolean;
    suggestEmailsForDomain?: string;
    textFieldBackgroundColor?: boolean;
    UNSAFE_hasDraggableParentComponent?: boolean;
    value?: Value;
    width?: number | string;
}, keyof WithAnalyticsEventsProps>, "search" | "appearance" | "height" | "minHeight" | "open" | "isDisabled" | "options" | "anchor" | "footer" | "header" | "subtle" | "value" | "placeholderAvatar" | "noOptionsMessage" | "placeholder" | "defaultValue" | "autoFocus" | "onFocus" | "onBlur" | "onChange" | "onKeyDown" | "name" | "emailLabel" | "addMoreMessage" | "allowEmail" | "ariaDescribedBy" | "ariaLabel" | "ariaLabelledBy" | "ariaLive" | "captureMenuScroll" | "clearValueLabel" | "closeMenuOnScroll" | "components" | "disableInput" | "fieldId" | "forwardedRef" | "groupByTypeOrder" | "customGroupLabels" | "includeTeamsUpdates" | "inputId" | "isClearable" | "isFooterFocused" | "isHeaderFocused" | "isInvalid" | "isLoading" | "isValidEmail" | "loadOptions" | "loadOptionsErrorMessage" | "loadUserSource" | "maxOptions" | "maxPickerHeight" | "menuIsOpen" | "menuMinWidth" | "menuPortalTarget" | "menuPosition" | "menuShouldBlockScroll" | "noBorder" | "onClear" | "onClose" | "onInputChange" | "onOpen" | "onSelection" | "openMenuOnClick" | "openMenuOnFocus" | "popupSelectProps" | "required" | "setIsFooterFocused" | "setIsHeaderFocused" | "showClearIndicator" | "strategy" | "styles" | "suggestEmailsForDomain" | "textFieldBackgroundColor" | "UNSAFE_hasDraggableParentComponent"> & {
    isMulti?: boolean | undefined;
    width?: number | string | undefined;
    // eslint-disable-next-line @typescript-eslint/ban-types -- intentional `{}` intersection for exotic component typing
} & {} & React.RefAttributes<any>> = withAnalyticsEvents()(UserPickerWithoutAnalytics);
