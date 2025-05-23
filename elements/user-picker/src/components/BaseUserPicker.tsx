import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { type UFOExperience, UFOExperienceState } from '@atlaskit/ufo';
import debounce from 'lodash/debounce';
import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { v4 as uuidv4 } from 'uuid';
import {
	cancelEvent,
	clearEvent,
	createAndFireEventInElementsChannel,
	deleteEvent,
	type EventCreator,
	failedEvent,
	focusEvent,
	searchedEvent,
	selectEvent,
	startSession,
	type UserPickerSession,
} from '../analytics';
import type {
	Appearance,
	AtlasKitSelectChange,
	InputActionTypes,
	Option,
	OptionData,
	UserPickerProps,
	UserPickerState,
} from '../types';
import { batchByKey } from './batch';
import { messages } from './i18n';
import {
	callCallback,
	extractOptionValue,
	getOptions,
	isIterable,
	isPopupUserPickerByComponent,
	isDefaultValuePopulated,
	isSingleValue,
	optionToSelectableOptions,
} from './utils';
import { userPickerOptionsShownUfoExperience } from '../util/ufoExperiences';

export type BaseUserPickerProps = UserPickerProps & {
	SelectComponent: React.ComponentType<any>;
	pickerProps?: any;
	styles: any;
	components: any;
	width: string | number;
	name?: string;
	// eslint-disable-next-line @repo/internal/deprecations/deprecation-ticket-required
	/**
	 * @deprecated This is a temporary prop to enable user-pickers to work in Draggable elements in react-beautiful-dnd.
	 * See https://product-fabric.atlassian.net/browse/DSP-15701 for more details.
	 * It may be removed in a future minor or patch when a longer-term workaround is found.
	 */
	UNSAFE_hasDraggableParentComponent?: boolean;
};

const loadingMessage = () => null;

const classNamePrefix = 'fabric-user-picker';
export class BaseUserPickerWithoutAnalytics extends React.Component<
	BaseUserPickerProps,
	UserPickerState
> {
	static defaultProps = {
		isMulti: false,
		subtle: false,
		noBorder: false,
		textFieldBackgroundColor: false,
		isClearable: true,
		loadOptionsErrorMessage: () => <FormattedMessage {...messages.errorMessage} />,
		openMenuOnClick: false,
	};

	static getDerivedStateFromProps(nextProps: Partial<UserPickerProps>, prevState: UserPickerState) {
		const derivedState: Partial<UserPickerState> = {};
		if (nextProps.isDisabled || nextProps.disableInput) {
			derivedState.menuIsOpen = false;
		}
		if (nextProps.open !== undefined) {
			derivedState.menuIsOpen = nextProps.open;
		}
		if (nextProps.value !== undefined) {
			derivedState.value = optionToSelectableOptions(nextProps.value);
		} else if (isDefaultValuePopulated(nextProps.defaultValue) && !prevState.isDefaultSet) {
			derivedState.value = optionToSelectableOptions(nextProps.defaultValue);
			derivedState.isDefaultSet = true;
		}
		if (nextProps.search !== undefined && nextProps.search !== prevState.inputValue) {
			derivedState.inputValue = nextProps.search;
		}

		if (nextProps.options !== undefined) {
			derivedState.options = nextProps.options;
		}

		return derivedState;
	}

	private selectRef: any | null;

	private session?: UserPickerSession;

	// session id for focus to blur
	private journeyId?: string;

	private optionsShownUfoExperienceInstance: UFOExperience;

	constructor(props: BaseUserPickerProps) {
		super(props);
		this.state = {
			options: [],
			isDefaultSet: false,
			inflightRequest: 0,
			count: 0,
			hoveringClearIndicator: false,
			menuIsOpen: !!this.props.open,
			inputValue: props.search || '',
			resolving: false,
			showError: false,
			initialFocusHandled: false,
		};
		this.optionsShownUfoExperienceInstance =
			userPickerOptionsShownUfoExperience.getInstance(uuidv4());
	}

	private getSessionId = () => (this.session && this.session.id ? this.session.id : undefined);

	private withSelectRef = (callback: (selectRef: any) => void) => () => {
		if (this.selectRef) {
			callback(this.selectRef);
		}
	};

	public nextOption = this.withSelectRef((select) => select.focusOption('down'));

	public previousOption = this.withSelectRef((select) => select.focusOption('up'));

	public focus = () => {
		if (this.selectRef && this.selectRef.focus) {
			this.selectRef.focus();
		}
	};

	public blur = () => {
		if (this.selectRef && this.selectRef.blur) {
			this.selectRef.blur();
		}
	};

	public selectOption = this.withSelectRef((select) => {
		const focusedOption = select.state.focusedOption;
		select.selectOption(focusedOption);
	});

	// value = null if user deletes the last item in the user picker
	private handleChange: AtlasKitSelectChange = (value, { action, removedValue, option }) => {
		if (removedValue && removedValue.data.fixed) {
			return;
		}
		this.resetInputState();
		const { onChange, onSelection, onClear, isMulti } = this.props;
		callCallback(onChange, extractOptionValue(value), action);

		switch (action) {
			case 'select-option':
				if (value) {
					callCallback(onSelection, extractOptionValue(value), this.getSessionId(), this);
				}
				this.fireEvent(selectEvent, isMulti ? option : value);
				this.session = isMulti ? startSession() : undefined;
				break;
			case 'clear':
				callCallback(onClear);
				this.fireEvent(clearEvent);
				break;
			case 'remove-value':
			case 'pop-value':
				if (removedValue) {
					this.fireEvent(deleteEvent, removedValue.data);
				}
				break;
		}
		this.fireEvent(searchedEvent);

		if (removedValue && this.state.value && Array.isArray(this.state.value)) {
			const remainingValues = this.state.value.filter(
				(val: Option) => val.data.id !== removedValue.data.id,
			);
			this.setState({
				value: remainingValues ? remainingValues : [],
				menuIsOpen: true,
			});
		}

		if (!this.props.value) {
			this.setState({ value: value ? value : [] });
		}
	};

	private handleSelectRef = (ref: any | null) => {
		this.selectRef = ref;
	};

	private addOptions = batchByKey((request: string, newOptions: (OptionData | OptionData[])[]) => {
		const { resolving } = this.state;

		this.setState(({ inflightRequest, options, count }) => {
			if (inflightRequest.toString() === request) {
				return {
					options: (resolving ? options : []).concat(
						newOptions.reduce<OptionData[]>(
							(nextOptions, item) =>
								Array.isArray(item) ? nextOptions.concat(item[0]) : nextOptions.concat(item),
							[],
						),
					),
					count: count - newOptions.length,
					resolving: count - newOptions.length !== 0,
				};
			}
			return null;
		});
	});

	private handleLoadOptionsError = () => {
		const { count } = this.state;
		const newCount = count - 1;
		const resolving = newCount !== 0;
		let showError = false;

		if (!resolving) {
			showError = true;
		}

		this.setState({
			count: newCount,
			resolving,
			showError,
		});
		this.fireEvent(failedEvent);
	};

	private debouncedLoadOptions = debounce((search?: string) => {
		const { loadOptions } = this.props;
		if (loadOptions) {
			const inflightRequest = this.state.inflightRequest + 1;
			const result =
				this.session && this.session.id
					? loadOptions(search, this.session.id)
					: loadOptions(search);
			const addOptions = this.addOptions.bind(this, inflightRequest.toString()) as (
				value: OptionData | OptionData[],
			) => void | PromiseLike<void>;
			let count = 0;
			if (isIterable(result)) {
				for (const value of result) {
					Promise.resolve(value).then(addOptions).catch(this.handleLoadOptionsError);
					count++;
				}
			} else {
				Promise.resolve(result).then(addOptions).catch(this.handleLoadOptionsError);
				count++;
			}
			this.setState({
				inflightRequest,
				count,
				resolving: count !== 0,
				options: [],
			});
		}
	}, 200);

	private get isMenuOpenOnClickForSingleSelect() {
		return this.props.openMenuOnClick && !this.props.isMulti;
	}

	abortOptionsShownUfoExperience = () => {
		if (this.optionsShownUfoExperienceInstance.state.id === UFOExperienceState.STARTED.id) {
			// There may be an existing UFO timing running from previous key entry or focus,
			// so abort it and restart it just in case.
			this.optionsShownUfoExperienceInstance.abort();
		}
	};

	startOptionsShownUfoExperience = () => {
		this.abortOptionsShownUfoExperience();
		this.optionsShownUfoExperienceInstance.start();
	};

	private executeLoadOptions = (search?: string) => {
		const { loadOptions } = this.props;
		if (loadOptions) {
			this.setState({ resolving: true, showError: false }, () => this.debouncedLoadOptions(search));
		}
	};

	private handleFocus = (event: React.FocusEvent) => {
		const { value, menuIsOpen } = this.state;
		if (!menuIsOpen || !this.session) {
			this.startSession();
		}
		this.startOptionsShownUfoExperience();
		callCallback(this.props.onFocus, this.getSessionId());
		if (!this.isMenuOpenOnClickForSingleSelect) {
			this.setState({ menuIsOpen: true });
			if (!this.props.isMulti && isSingleValue(value)) {
				const input = event.target;
				this.setState({ inputValue: value.label }, () => {
					if (input instanceof HTMLInputElement) {
						input.setSelectionRange(0, value.label.length);
					}
				});
			}
		}
	};

	private resetInputState = () => {
		// Prevent filter if query typed, then blurred with no selection
		this.setState({
			inputValue: '',
		});
		callCallback(this.props.onInputChange, '', this.getSessionId());
	};

	private handleBlur = () => {
		callCallback(this.props.onBlur, this.getSessionId());
		if (isPopupUserPickerByComponent(this.props.SelectComponent)) {
			return;
		}
		this.resetInputState();
		this.abortOptionsShownUfoExperience();
		this.setState({
			menuIsOpen: false,
			initialFocusHandled: false,
			options: [],
		});
	};

	private handleOpen = () => {
		callCallback(this.props.onOpen, this.getSessionId());
		this.setState({
			menuIsOpen: true,
		});
	};

	private handleClose = () => {
		this.resetInputState();
		callCallback(this.props.onClose, this.getSessionId());
		this.setState({
			menuIsOpen: false,
			options: [],
		});
	};

	private handleInputChange = (search: string, { action }: { action: InputActionTypes }) => {
		if (action === 'input-change' || action === 'set-value') {
			callCallback(this.props.onInputChange, search, this.getSessionId());
			this.setState({ inputValue: search });

			this.startOptionsShownUfoExperience();
		}
	};

	private fireEvent = (eventCreator: EventCreator, ...args: any[]) => {
		const { createAnalyticsEvent } = this.props;
		if (createAnalyticsEvent) {
			createAndFireEventInElementsChannel(
				eventCreator(this.props, this.state, this.session, this.journeyId, ...args),
			)(createAnalyticsEvent);
		}
	};

	private startSession = () => {
		this.session = startSession();
		this.journeyId = this.getSessionId();
		this.fireEvent(focusEvent);
	};

	componentDidMount() {
		const { open, search } = this.props;
		// load options when the picker open
		if (open) {
			if (!this.session) {
				this.startSession();
			}
			this.executeLoadOptions(search);
		}
	}

	componentDidUpdate(_: UserPickerProps, prevState: UserPickerState) {
		const { menuIsOpen, options, resolving, count, inputValue } = this.state;

		// Create a new session when the menu is opened and there is no session
		if (menuIsOpen && !prevState.menuIsOpen && !this.session) {
			this.startSession();
		}

		// Load options when user picker opens or when input value changes
		if ((menuIsOpen && !prevState.menuIsOpen) || inputValue !== prevState.inputValue) {
			this.executeLoadOptions(inputValue);
		}

		if (!menuIsOpen && prevState.menuIsOpen && this.session) {
			this.fireEvent(cancelEvent, prevState);
			this.session = undefined;
		}

		if (
			menuIsOpen &&
			((!prevState.menuIsOpen && options.length > 0) || options.length !== prevState.options.length)
		) {
			this.fireEvent(searchedEvent);
		}

		if (this.state.inputValue !== prevState.inputValue) {
			if (this.session) {
				this.session.inputChangeTime = Date.now();
			}
		}

		if (
			menuIsOpen &&
			(!_.loadOptions || prevState.menuIsOpen) &&
			count === 0 &&
			!resolving &&
			[UFOExperienceState.STARTED.id, UFOExperienceState.IN_PROGRESS.id].includes(
				this.optionsShownUfoExperienceInstance.state.id,
			)
		) {
			this.optionsShownUfoExperienceInstance.success();
		}
	}

	private handleKeyDown = (event: React.KeyboardEvent) => {
		if (!this.isMenuOpenOnClickForSingleSelect) {
			// Escape
			if (event.keyCode === 27) {
				this.blur();
			}

			// Space
			if (event.keyCode === 32 && !this.state.inputValue) {
				event.preventDefault();
				!this.props.disableInput && this.setState({ inputValue: ' ' });
			}
		}
		if (this.session) {
			this.session.lastKey = event.keyCode;
			switch (event.keyCode) {
				// KeyUp 38
				case 38:
					this.session.upCount++;
					break;
				// KeyDown 40
				case 40:
					this.session.downCount++;
					break;
			}
		}
		this.props.onKeyDown && this.props.onKeyDown(event);
	};

	handleClearIndicatorHover = (hoveringClearIndicator: boolean) => {
		this.setState({ hoveringClearIndicator });
	};

	private getOptions = (): Option[] => {
		const options = getOptions(this.state.options) || [];
		const { maxOptions, isMulti } = this.props;
		if (maxOptions === 0) {
			return [];
		}
		if (maxOptions && maxOptions > 0 && maxOptions < options.length) {
			const { value } = this.state;
			let filteredOptions = options;
			// Filter out previously selected options
			if (isMulti && Array.isArray(value)) {
				const valueIds: string[] = value.map((item) => item.data.id);
				filteredOptions = options.filter((option) => valueIds.indexOf(option.data.id) === -1);
			}
			return filteredOptions.slice(0, maxOptions);
		}

		return options;
	};

	private getAppearance = (): Appearance =>
		this.props.appearance ? this.props.appearance : 'normal';

	get ariaProps() {
		const ariaLabels = Object.keys(this.props).filter((key) => key.startsWith('aria-'));
		const props: { [key: string]: any } = { ...this.props };
		return ariaLabels.reduce((obj, key) => ({ ...obj, [key]: props[key] }), {});
	}

	private handleClickDraggableParentComponent = () => {
		if (this.state.initialFocusHandled) {
			// As <Select /> is already focused, calling this.selectRef.current.focus() again no longer triggers its own handlers (i.e. onMenuOpen, onMenuClose)
			// We have to manually handle the open and close states of the dropdown menu based on a user's click from this point onwards to prevent the bug
			if (this.state.menuIsOpen) {
				this.handleClose();
			} else {
				this.handleOpen();
			}
			// escaping the below condition when openMenuOnClick is true otherwise menu own't open on click
		} else if (!this.state.menuIsOpen && !this.isMenuOpenOnClickForSingleSelect) {
			// Trigger focus state when ValueContainer is clicked for the first time
			// The focused state will then invoke <Select /> instance's own handlers (e.g. onMenuOpen, onMenuClose)
			// to manage the state of the dropdown menu
			this.focus();
			this.setState(() => ({ initialFocusHandled: true }));
		}
	};

	render() {
		const {
			isMulti,
			isLoading,
			subtle,
			noBorder,
			placeholder,
			isClearable,
			isDisabled,
			isInvalid,
			clearValueLabel,
			menuMinWidth,
			menuPortalTarget,
			loadOptionsErrorMessage,
			addMoreMessage,
			noOptionsMessage,
			footer,
			disableInput,
			components,
			pickerProps,
			SelectComponent,
			styles,
			autoFocus,
			fieldId,
			inputId,
			maxPickerHeight,
			textFieldBackgroundColor,
			ariaLabelledBy,
			ariaDescribedBy,
			ariaLive,
			ariaLabel,
			name,
			header,
			required,
			UNSAFE_hasDraggableParentComponent,
			placeholderAvatar,
		} = this.props;

		const { count, hoveringClearIndicator, menuIsOpen, value, inputValue, resolving, showError } =
			this.state;
		const appearance = this.getAppearance();
		// these props override the default select menu open and close
		const menuOpenDeciderProps = {
			...(!this.isMenuOpenOnClickForSingleSelect && {
				menuIsOpen,
				blurInputOnSelect: !isMulti,
				openMenuOnFocus: true,
			}),
		};

		return (
			<SelectComponent
				name={name}
				value={value}
				autoFocus={autoFocus !== undefined ? autoFocus : menuIsOpen}
				aria-labelledby={ariaLabelledBy}
				aria-describedby={ariaDescribedBy}
				aria-live={ariaLive}
				aria-required={required} // This has been added as a safety net.
				required={required}
				ref={this.handleSelectRef}
				isMulti={isMulti}
				options={this.getOptions()}
				styles={styles}
				enableAnimation={isMulti}
				components={components}
				inputValue={inputValue}
				isLoading={count > 0 || resolving || isLoading}
				loadingMessage={loadingMessage}
				menuPlacement="auto"
				placeholder={placeholder ?? <FormattedMessage {...messages.placeholder} />}
				label={ariaLabel}
				addMoreMessage={addMoreMessage}
				classNamePrefix={classNamePrefix}
				hoveringClearIndicator={hoveringClearIndicator}
				appearance={appearance}
				isClearable={isClearable}
				noBorder={noBorder}
				subtle={subtle}
				closeMenuOnSelect={!isMulti}
				noOptionsMessage={
					showError
						? loadOptionsErrorMessage
						: typeof noOptionsMessage === 'function'
							? noOptionsMessage
							: () => noOptionsMessage
				}
				footer={footer}
				isDisabled={isDisabled}
				isInvalid={isInvalid}
				isFocused={menuIsOpen}
				backspaceRemovesValue={isMulti}
				filterOption={null} // disable local filtering
				clearValueLabel={clearValueLabel}
				menuMinWidth={menuMinWidth}
				menuPortalTarget={menuPortalTarget}
				disableInput={disableInput || isDisabled}
				instanceId={fieldId}
				inputId={inputId}
				onChange={this.handleChange}
				onMenuOpen={this.handleOpen}
				onFocus={this.handleFocus}
				onBlur={this.handleBlur}
				onMenuClose={this.handleClose}
				onInputChange={this.handleInputChange}
				onClearIndicatorHover={this.handleClearIndicatorHover}
				onKeyDown={this.handleKeyDown}
				maxPickerHeight={maxPickerHeight}
				textFieldBackgroundColor={textFieldBackgroundColor}
				header={header}
				placeholderAvatar={placeholderAvatar}
				{...this.ariaProps}
				{...pickerProps}
				{...(UNSAFE_hasDraggableParentComponent && {
					onValueContainerClick: this.handleClickDraggableParentComponent,
				})}
				{...menuOpenDeciderProps}
			/>
		);
	}
}

export const BaseUserPicker = withAnalyticsEvents()(BaseUserPickerWithoutAnalytics);
